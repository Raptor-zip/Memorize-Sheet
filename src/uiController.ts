import { ImageProcessor, ColorInfo } from './imageProcessor';

export class UIController {
    private processor: ImageProcessor;
    private currentImage: HTMLCanvasElement | null = null;
    private isEyedropperActive: boolean = false;

    // UI要素
    private fileInput: HTMLInputElement;
    private viewContainer: HTMLDivElement;
    private colorListContainer: HTMLDivElement;
    private colorThresholdSlider: HTMLInputElement;
    private colorThresholdValue: HTMLSpanElement;
    private minAreaSlider: HTMLInputElement;
    private minAreaValue: HTMLSpanElement;
    private eyedropperButton: HTMLButtonElement;
    private clearColorsButton: HTMLButtonElement;
    private comparisonSlider: HTMLInputElement;
    private comparisonValue: HTMLSpanElement;
    private directionButtons: NodeListOf<HTMLInputElement>;

    // 画像データ
    private images: {
        canvas: HTMLCanvasElement;
        originalElement: HTMLImageElement;
        processedElement: HTMLImageElement;
        container: HTMLDivElement;
    }[] = [];

    // 比較設定（ビューポートに対するピクセル値）
    private dividerX: number = 0; // ピクセル
    private dividerY: number = 0; // ピクセル
    private isDragging: boolean = false;
    private dragHandle: HTMLDivElement | null = null;
    private dragOffsetX: number = 0; // ドラッグ開始時のオフセット
    private dragOffsetY: number = 0;

    constructor(processor: ImageProcessor) {
        this.processor = processor;

        // UI要素を取得
        this.fileInput = document.getElementById('file-input') as HTMLInputElement;
        this.viewContainer = document.getElementById('view') as HTMLDivElement;
        this.colorListContainer = document.getElementById('color-list') as HTMLDivElement;
        this.colorThresholdSlider = document.getElementById('color-threshold') as HTMLInputElement;
        this.colorThresholdValue = document.getElementById('color-threshold-value') as HTMLSpanElement;
        this.minAreaSlider = document.getElementById('min-area') as HTMLInputElement;
        this.minAreaValue = document.getElementById('min-area-value') as HTMLSpanElement;
        this.eyedropperButton = document.getElementById('eyedropper-btn') as HTMLButtonElement;
        this.clearColorsButton = document.getElementById('clear-colors-btn') as HTMLButtonElement;
        this.dragHandle = document.getElementById('drag-handle') as HTMLDivElement;

        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        // ファイル選択
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // 閾値スライダー
        this.colorThresholdSlider.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value);
            this.colorThresholdValue.textContent = value.toString();
            this.processor.setColorThreshold(value);
            this.reprocessAllImages();
        });

        // 最小面積スライダー
        this.minAreaSlider.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value);
            this.minAreaValue.textContent = value.toString();
            this.processor.setMinAreaThreshold(value);
            this.reprocessAllImages();
        });

        // スポイトボタン
        this.eyedropperButton.addEventListener('click', () => {
            this.toggleEyedropper();
        });

        // 色クリアボタン
        this.clearColorsButton.addEventListener('click', () => {
            this.processor.clearSelectedColors();
            this.updateColorList();
            this.reprocessAllImages();
        });

        // ドラッグハンドルの初期化
        this.initializeDragHandle();

        // 全画面ボタン
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                document.documentElement.requestFullscreen();
            });
        }
    }

    private handleFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files) return;

        // 既存の画像をクリア
        this.clearAllImages();

        const files = Array.from(input.files);
        let loadedCount = 0;

        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    this.addImage(img, index, false); // updateDividersを呼ばない
                    loadedCount++;

                    // すべての画像を読み込み終わったら一度だけupdateDividersを呼ぶ
                    if (loadedCount === files.length) {
                        this.updateDividers();
                    }
                };
                img.src = e.target!.result as string;
            };
            reader.readAsDataURL(file);
        });
    }

    private addImage(img: HTMLImageElement, index: number, updateDividers: boolean = true): void {
        // 一時キャンバスに画像を描画
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);

        // 前の画像の下に配置するため、累積高さを計算
        let topOffset = 50;
        if (index > 0) {
            for (let i = 0; i < index; i++) {
                topOffset += this.images[i].canvas.height + 50;
            }
        }

        // コンテナを作成
        const container = document.createElement('div');
        container.className = 'image-container';
        container.style.position = 'absolute';
        container.style.top = topOffset + 'px';
        container.style.left = '50px';
        container.style.width = canvas.width + 'px';
        container.style.height = canvas.height + 'px';
        this.viewContainer.appendChild(container);

        // 元画像
        const originalImg = this.createImageFromCanvas(canvas);
        originalImg.className = 'layer-image original';
        originalImg.style.cursor = this.isEyedropperActive ? 'crosshair' : 'default';
        container.appendChild(originalImg);

        // 加工後画像
        const processedCanvas = this.processor.createRedSheetLayer(canvas);
        const processedImg = this.createImageFromCanvas(processedCanvas);
        processedImg.className = 'layer-image processed';
        processedImg.style.cursor = this.isEyedropperActive ? 'crosshair' : 'default';
        container.appendChild(processedImg);

        // 画像データを保存
        this.images.push({
            canvas: canvas,
            originalElement: originalImg,
            processedElement: processedImg,
            container: container
        });

        // クリックイベント（両方の画像でスポイト可能）
        originalImg.addEventListener('click', (e) => this.handleImageClick(e, canvas));
        processedImg.addEventListener('click', (e) => this.handleImageClick(e, canvas));

        // 必要な場合のみ比較モードを適用
        if (updateDividers) {
            this.updateDividers();
        }
    }

    private createImageFromCanvas(canvas: HTMLCanvasElement): HTMLImageElement {
        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }

    private handleImageClick(event: MouseEvent, canvas: HTMLCanvasElement): void {
        if (!this.isEyedropperActive) return;

        const target = event.target as HTMLImageElement;
        const rect = target.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
        const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));

        const color = this.processor.getColorAtPoint(canvas, x, y);
        this.processor.addSelectedColor(color);
        this.updateColorList();
        this.reprocessAllImages();
    }

    private toggleEyedropper(): void {
        this.isEyedropperActive = !this.isEyedropperActive;
        this.eyedropperButton.classList.toggle('active', this.isEyedropperActive);

        // すべての画像のカーソルを変更
        this.images.forEach(img => {
            img.originalElement.style.cursor = this.isEyedropperActive ? 'crosshair' : 'default';
            img.processedElement.style.cursor = this.isEyedropperActive ? 'crosshair' : 'default';
        });
    }

    private updateColorList(): void {
        this.colorListContainer.innerHTML = '';
        const colors = this.processor.getSelectedColors();

        colors.forEach(color => {
            const colorItem = document.createElement('div');
            colorItem.className = 'color-item';

            const colorPreview = document.createElement('div');
            colorPreview.className = 'color-preview';
            colorPreview.style.backgroundColor = `rgb(${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]})`;

            const colorInfo = document.createElement('span');
            colorInfo.className = 'color-info';
            colorInfo.textContent = `RGB(${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]})`;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-color-btn';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', () => {
                this.processor.removeSelectedColor(color.id);
                this.updateColorList();
                this.reprocessAllImages();
            });

            colorItem.appendChild(colorPreview);
            colorItem.appendChild(colorInfo);
            colorItem.appendChild(removeBtn);
            this.colorListContainer.appendChild(colorItem);
        });
    }

    private reprocessAllImages(): void {
        // すべての画像の赤シートレイヤーを再生成
        this.images.forEach(imageData => {
            const processedCanvas = this.processor.createRedSheetLayer(imageData.canvas);
            imageData.processedElement.src = processedCanvas.toDataURL();
        });

        // 再生成後、表示を更新
        this.updateDividers();
    }

    private clearAllImages(): void {
        this.images.forEach(imageData => {
            imageData.container.remove();
        });
        this.images = [];
    }

    private initializeDragHandle(): void {
        if (!this.dragHandle) return;

        // 初期位置をビューポートの中央に設定
        this.dividerX = window.innerWidth / 2;
        this.dividerY = window.innerHeight / 2;
        this.updateDragHandlePosition();

        // マウスイベント
        this.dragHandle.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());

        // タッチイベント
        this.dragHandle.addEventListener('touchstart', (e) => this.startDrag(e));
        document.addEventListener('touchmove', (e) => this.drag(e));
        document.addEventListener('touchend', () => this.stopDrag());

        // すべての親要素にスクロールイベントを追加してデバッグ
        const addScrollListenerToParents = (element: HTMLElement | null) => {
            let current = element;
            while (current) {
                const elementName = current.id || current.className || current.tagName;
                current.addEventListener('scroll', () => {
                    console.log(`Scroll event on: ${elementName}`);
                    this.updateDividers();
                });
                current = current.parentElement;
            }
        };

        // viewContainerから上の階層すべてにリスナーを追加
        addScrollListenerToParents(this.viewContainer);

        // document全体のスクロール
        document.addEventListener('scroll', () => {
            console.log('document scroll event fired');
            this.updateDividers();
        });

        // windowのスクロール
        window.addEventListener('scroll', () => {
            console.log('window scroll event fired');
            this.updateDividers();
        });
    }

    private startDrag(e: MouseEvent | TouchEvent): void {
        this.isDragging = true;
        this.dragHandle!.classList.add('dragging');

        // ドラッグ開始時のマウス位置とハンドルの現在位置の差分を記録
        const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

        // マウスポインタとハンドル中心のオフセットを記録
        this.dragOffsetX = clientX - this.dividerX;
        this.dragOffsetY = clientY - this.dividerY;

        e.preventDefault();
    }

    private drag(e: MouseEvent | TouchEvent): void {
        if (!this.isDragging) return;

        const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

        // オフセットを考慮してハンドルの中心位置を計算（ビューポート座標系）
        this.dividerX = clientX - this.dragOffsetX;
        this.dividerY = clientY - this.dragOffsetY;

        this.updateDragHandlePosition();
        this.updateDividers();

        e.preventDefault();
    }

    private stopDrag(): void {
        this.isDragging = false;
        if (this.dragHandle) {
            this.dragHandle.classList.remove('dragging');
        }
    }

    private updateDragHandlePosition(): void {
        if (!this.dragHandle) return;

        // ビューポートに対する位置を設定
        // transform: translate(-50%, -50%)があるので、中心を基準にする
        this.dragHandle.style.left = this.dividerX + 'px';
        this.dragHandle.style.top = this.dividerY + 'px';
    }

    private updateDividers(): void {
        this.images.forEach((imageData, index) => {
            const { originalElement, processedElement, container } = imageData;

            const rect = container.getBoundingClientRect();

            // コンテナに対する相対位置を計算
            const relativeX = ((this.dividerX - rect.left) / rect.width) * 100;
            const relativeY = ((this.dividerY - rect.top) / rect.height) * 100;

            // デバッグログ（画像ごとに出力）
            console.log(`Image ${index}:`, {
                dividerX: this.dividerX,
                dividerY: this.dividerY,
                rectLeft: rect.left,
                rectTop: rect.top,
                rectBottom: rect.bottom,
                rectWidth: rect.width,
                rectHeight: rect.height,
                relativeX: relativeX.toFixed(2),
                relativeY: relativeY.toFixed(2),
                crossInImage: relativeX >= 0 && relativeX <= 100 && relativeY >= 0 && relativeY <= 100
            });

            // 十字線が画像のどこにあるかを判定
            const crossInImage = relativeX >= 0 && relativeX <= 100 &&
                relativeY >= 0 && relativeY <= 100;

            if (!crossInImage) {
                // 十字線が画像外の場合
                // 画像の中心から見て十字線がどの方向にあるかで表示を決定
                const centerX = 50;
                const centerY = 50;
                const isLeft = relativeX < centerX;
                const isTop = relativeY < centerY;

                if (isLeft && isTop) {
                    // 左上 - 元画像を表示
                    originalElement.style.display = 'block';
                    processedElement.style.display = 'none';
                } else if (!isLeft && isTop) {
                    // 右上 - 加工後を表示
                    originalElement.style.display = 'none';
                    processedElement.style.display = 'block';
                } else if (isLeft && !isTop) {
                    // 左下 - 加工後を表示
                    originalElement.style.display = 'none';
                    processedElement.style.display = 'block';
                } else {
                    // 右下 - 元画像を表示
                    originalElement.style.display = 'block';
                    processedElement.style.display = 'none';
                }
                originalElement.style.clipPath = 'none';
                processedElement.style.clipPath = 'none';
            } else {
                // 十字線が画像内を通る場合
                originalElement.style.display = 'block';
                processedElement.style.display = 'block';

                // relativeX/Yを0-100の範囲にクランプ
                const clampedX = Math.max(0, Math.min(100, relativeX));
                const clampedY = Math.max(0, Math.min(100, relativeY));

                // 元画像: 左上と右下の2つの矩形
                originalElement.style.clipPath =
                    `polygon(` +
                    `0% 0%, ${clampedX}% 0%, ${clampedX}% ${clampedY}%, 0% ${clampedY}%, 0% 0%, ` + // 左上
                    `${clampedX}% ${clampedY}%, 100% ${clampedY}%, 100% 100%, ${clampedX}% 100%, ${clampedX}% ${clampedY}%` + // 右下
                    `)`;

                // 加工後: 右上と左下の2つの矩形
                processedElement.style.clipPath =
                    `polygon(` +
                    `${clampedX}% 0%, 100% 0%, 100% ${clampedY}%, ${clampedX}% ${clampedY}%, ${clampedX}% 0%, ` + // 右上
                    `0% ${clampedY}%, ${clampedX}% ${clampedY}%, ${clampedX}% 100%, 0% 100%, 0% ${clampedY}%` + // 左下
                    `)`;
            }
        });
    }
}
