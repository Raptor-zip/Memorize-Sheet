import cv from 'opencv.js';

export interface ColorInfo {
    hsv: [number, number, number];
    rgb: [number, number, number];
    id: number;
}

export class ImageProcessor {
    private cv: typeof cv;
    private selectedColors: ColorInfo[] = [];
    private colorThreshold: number = 30;
    private minAreaThreshold: number = 100; // ピクセル数

    constructor(cvInstance: typeof cv) {
        this.cv = cvInstance;
    }

    /**
     * RGB値をHSVに変換
     */
    private rgbToHsv(r: number, g: number, b: number): [number, number, number] {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        let h = 0;
        let s = 0;
        const v = max;

        if (delta > 0) {
            s = delta / max;
            if (max === r) {
                h = 60 * (((g - b) / delta) % 6);
            } else if (max === g) {
                h = 60 * ((b - r) / delta + 2);
            } else {
                h = 60 * ((r - g) / delta + 4);
            }
            if (h < 0) h += 360;
        }

        return [h / 2, s * 255, v * 255]; // OpenCVのHSV範囲に合わせる (H: 0-180, S: 0-255, V: 0-255)
    }

    /**
     * 画像から指定座標の色を取得
     */
    public getColorAtPoint(canvas: HTMLCanvasElement, x: number, y: number): ColorInfo {
        const ctx = canvas.getContext('2d')!;
        const imageData = ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = imageData.data;

        const hsv = this.rgbToHsv(r, g, b);
        return {
            rgb: [r, g, b],
            hsv: hsv,
            id: Date.now()
        };
    }

    /**
     * 選択色を追加
     */
    public addSelectedColor(color: ColorInfo): void {
        this.selectedColors.push(color);
    }

    /**
     * 選択色を削除
     */
    public removeSelectedColor(id: number): void {
        this.selectedColors = this.selectedColors.filter(c => c.id !== id);
    }

    /**
     * すべての選択色をクリア
     */
    public clearSelectedColors(): void {
        this.selectedColors = [];
    }

    /**
     * 選択色の一覧を取得
     */
    public getSelectedColors(): ColorInfo[] {
        return [...this.selectedColors];
    }

    /**
     * 色の閾値を設定
     */
    public setColorThreshold(value: number): void {
        this.colorThreshold = value;
    }

    /**
     * 最小面積閾値を設定（これより小さい連結成分は除外）
     */
    public setMinAreaThreshold(value: number): void {
        this.minAreaThreshold = value;
    }

    /**
     * 赤シートレイヤーを作成
     * 選択した色の部分を透明化（小さいクラスタは除外）
     */
    public createRedSheetLayer(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
        const width = sourceCanvas.width;
        const height = sourceCanvas.height;

        // 赤シートレイヤー用のキャンバスを作成
        const redSheetCanvas = document.createElement('canvas');
        redSheetCanvas.width = width;
        redSheetCanvas.height = height;
        const ctx = redSheetCanvas.getContext('2d')!;

        // 選択色がない場合は元画像をそのまま返す
        if (this.selectedColors.length === 0) {
            ctx.drawImage(sourceCanvas, 0, 0);
            return redSheetCanvas;
        }

        // ソース画像のピクセルデータを取得
        const srcCtx = sourceCanvas.getContext('2d')!;
        const imageData = srcCtx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // マスクを作成（選択色の部分を白、それ以外を黒）
        const mask = new Uint8Array(width * height);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = y * width + x;
                const pixelIdx = idx * 4;

                const r = data[pixelIdx];
                const g = data[pixelIdx + 1];
                const b = data[pixelIdx + 2];

                const hsv = this.rgbToHsv(r, g, b);
                const [h, s, v] = hsv;

                // 選択色に一致するかチェック
                let isMatchColor = false;
                for (const color of this.selectedColors) {
                    const [targetH, targetS, targetV] = color.hsv;

                    let hDiff = Math.abs(h - targetH);
                    if (hDiff > 90) hDiff = 180 - hDiff;

                    if (hDiff <= this.colorThreshold &&
                        Math.abs(s - targetS) <= 80 &&
                        Math.abs(v - targetV) <= 80) {
                        isMatchColor = true;
                        break;
                    }
                }

                mask[idx] = isMatchColor ? 255 : 0;
            }
        }

        // 連結成分分析で小さいクラスタを除去
        const filteredMask = this.filterSmallComponents(mask, width, height);

        // フィルタリングされたマスクを使って出力画像を作成
        const outputData = ctx.createImageData(width, height);
        const output = outputData.data;

        for (let i = 0; i < width * height; i++) {
            const pixelIdx = i * 4;
            const shouldRemove = filteredMask[i] === 255;

            if (shouldRemove) {
                // 選択色に一致する場合は透明化
                output[pixelIdx] = 0;
                output[pixelIdx + 1] = 0;
                output[pixelIdx + 2] = 0;
                output[pixelIdx + 3] = 0;
            } else {
                // 一致しない場合は元の色を保持
                output[pixelIdx] = data[pixelIdx];
                output[pixelIdx + 1] = data[pixelIdx + 1];
                output[pixelIdx + 2] = data[pixelIdx + 2];
                output[pixelIdx + 3] = 255;
            }
        }

        ctx.putImageData(outputData, 0, 0);
        return redSheetCanvas;
    }

    /**
     * 連結成分分析を使って小さいクラスタを除去
     */
    private filterSmallComponents(mask: Uint8Array, width: number, height: number): Uint8Array {
        const labels = new Int32Array(width * height);
        const areas = new Map<number, number>();
        let nextLabel = 1;

        // 4連結で連結成分をラベリング
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = y * width + x;

                if (mask[idx] === 255 && labels[idx] === 0) {
                    // 新しい連結成分を発見
                    const area = this.floodFill(mask, labels, width, height, x, y, nextLabel);
                    areas.set(nextLabel, area);
                    nextLabel++;
                }
            }
        }

        // 面積が閾値以上の連結成分のみを残す
        const filteredMask = new Uint8Array(width * height);
        for (let i = 0; i < width * height; i++) {
            const label = labels[i];
            if (label > 0 && areas.get(label)! >= this.minAreaThreshold) {
                filteredMask[i] = 255;
            }
        }

        return filteredMask;
    }

    /**
     * Flood fill アルゴリズムで連結成分をラベリング
     */
    private floodFill(
        mask: Uint8Array,
        labels: Int32Array,
        width: number,
        height: number,
        startX: number,
        startY: number,
        label: number
    ): number {
        const stack: [number, number][] = [[startX, startY]];
        let area = 0;

        while (stack.length > 0) {
            const [x, y] = stack.pop()!;

            if (x < 0 || x >= width || y < 0 || y >= height) continue;

            const idx = y * width + x;

            if (mask[idx] !== 255 || labels[idx] !== 0) continue;

            labels[idx] = label;
            area++;

            // 4連結の隣接ピクセルをスタックに追加
            stack.push([x + 1, y]);
            stack.push([x - 1, y]);
            stack.push([x, y + 1]);
            stack.push([x, y - 1]);
        }

        return area;
    }
}
