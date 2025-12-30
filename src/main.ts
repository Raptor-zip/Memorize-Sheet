import cv from 'opencv.js';
import { ImageProcessor } from './imageProcessor';
import { UIController } from './uiController';

// OpenCV.jsの読み込みを待つ
declare global {
    interface Window {
        cv: typeof cv;
    }
}

function initApp(): void {
    console.log('OpenCV.js is ready');

    const processor = new ImageProcessor(window.cv);
    const uiController = new UIController(processor);

    console.log('Application initialized');
}

// OpenCV.jsが読み込まれたら初期化
if (typeof window.cv !== 'undefined') {
    initApp();
} else {
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.x/opencv.js';
    script.async = true;
    script.onload = () => {
        // OpenCV.jsの初期化を待つ
        if (window.cv && window.cv.Mat) {
            initApp();
        } else {
            setTimeout(() => {
                if (window.cv && window.cv.Mat) {
                    initApp();
                }
            }, 1000);
        }
    };
    document.head.appendChild(script);
}
