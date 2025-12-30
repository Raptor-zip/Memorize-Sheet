// OpenCV.js型定義
declare module 'opencv.js' {
    export interface Mat {
        data: Uint8Array | Uint8ClampedArray | Int8Array | Uint16Array | Int16Array | Int32Array | Float32Array | Float64Array;
        rows: number;
        cols: number;
        channels(): number;
        delete(): void;
        clone(): Mat;
    }

    export interface Size {
        width: number;
        height: number;
    }

    export interface Point {
        x: number;
        y: number;
    }

    export interface Scalar {
        [index: number]: number;
    }

    export const CV_8UC1: number;
    export const CV_8UC3: number;
    export const CV_8UC4: number;
    export const COLOR_RGBA2RGB: number;
    export const COLOR_RGB2HSV: number;
    export const COLOR_BGR2HSV: number;
    export const THRESH_BINARY: number;
    export const THRESH_BINARY_INV: number;

    export function matFromImageData(imageData: ImageData): Mat;
    export function imread(canvas: HTMLCanvasElement | HTMLImageElement | string): Mat;
    export function imshow(canvas: HTMLCanvasElement | string, mat: Mat): void;
    export function cvtColor(src: Mat, dst: Mat, code: number): void;
    export function inRange(src: Mat, lowerb: Mat, upperb: Mat, dst: Mat): void;
    export function threshold(src: Mat, dst: Mat, thresh: number, maxval: number, type: number): number;
    export function bitwise_and(src1: Mat, src2: Mat, dst: Mat): void;
    export function bitwise_or(src1: Mat, src2: Mat, dst: Mat): void;
    export function bitwise_not(src: Mat, dst: Mat): void;
    export function merge(mv: Mat[], dst: Mat): void;
    export function split(src: Mat, mv: Mat[]): void;

    const cv: {
        Mat: {
            new(): Mat;
            new(rows: number, cols: number, type: number): Mat;
            zeros(rows: number, cols: number, type: number): Mat;
            ones(rows: number, cols: number, type: number): Mat;
        };
        matFromImageData: typeof matFromImageData;
        imread: typeof imread;
        imshow: typeof imshow;
        cvtColor: typeof cvtColor;
        inRange: typeof inRange;
        threshold: typeof threshold;
        bitwise_and: typeof bitwise_and;
        bitwise_or: typeof bitwise_or;
        bitwise_not: typeof bitwise_not;
        merge: typeof merge;
        split: typeof split;
        CV_8UC1: number;
        CV_8UC3: number;
        CV_8UC4: number;
        COLOR_RGBA2RGB: number;
        COLOR_RGB2HSV: number;
        COLOR_BGR2HSV: number;
        THRESH_BINARY: number;
        THRESH_BINARY_INV: number;
    };

    export default cv;
}
