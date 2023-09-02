function first_script() {
    document.getElementById("file").addEventListener("change", (ev) => {
<<<<<<< HEAD
        for (let i = 0; i < ev.target.files.length; i++) {
            // let i = 0;
            let file = ev.target.files[i];

            // ファイルリーダーを作成する
            let fileReader = new FileReader();
            // ファイルが読み込まれたら、次の処理を行う
            fileReader.onload = (event) => {
                // 画像要素を作成する
                let img = new Image();
                img.src = event.target.result;
                // 画像が読み込まれたら
                img.onload = () => {
                    console.log(18);
                    // canvasのサイズを画像と同じにする
                    // 修正箇所：img.widthとimg.heightを使う
                    var canvas_black = document.createElement("canvas");
                    var canvas_white = document.createElement("canvas");
                    var ctx_black = canvas_black.getContext("2d");
                    var ctx_white = canvas_white.getContext("2d");
                    canvas_black.width = img.width;
                    canvas_white.width = img.width;
                    canvas_black.height = img.height;
                    canvas_white.height = img.height;
                    // canvasに画像を描画する
                    ctx_black.drawImage(img, 0, 0);
                    ctx_white.drawImage(img, 0, 0);
                    var imgData_black = ctx_black.getImageData(
                        0,
                        0,
                        canvas_black.width,
                        canvas_black.height
                    );
                    var imgData_white = ctx_white.getImageData(
                        0,
                        0,
                        canvas_white.width,
                        canvas_white.height
                    );
                    // ピクセル配列をループして白色のピクセルを透明にする
                    for (var j = 0; j < imgData_black.data.length; j += 4) {
                        //0は透明

                        //黒レイヤーの操作
                        //黒は黒くする 黒以外は透明にする

                        //if (r >= threshold && g >= threshold && b >= threshold) {

                        function euclidean(r1, g1, b1, r2, g2, b2) {
                            return Math.sqrt(
                                Math.pow(r2 - r1, 2) +
                                Math.pow(g2 - g1, 2) +
                                Math.pow(b2 - b1, 2)
                            );
                        }
                        //白の値は360付近

                        let base_rgb = [51, 16, 36];

                        let shikisa = euclidean(
                            imgData_black.data[j],
                            imgData_black.data[j + 1],
                            imgData_black.data[j + 2],
                            base_rgb[0],
                            base_rgb[1],
                            base_rgb[2]
                        );

                        // 黒の判定用の閾値（0～255）
                        var threshold = 180;

                        let rgb_threshold = 160; //小さくすると透明になる面積が多くなる

                        //黒を黒くする
                        if (shikisa <= rgb_threshold) {
                            //ピンク以外を表示させる
                            imgData_black.data[j + 3] = 255;
                        } else {
                            //ピンクを透明にする
                            imgData_black.data[j] = 0;
                            imgData_black.data[j + 1] = 0;
                            imgData_black.data[j + 2] = 0;
                            imgData_black.data[j + 3] = 0;
                        }
                    }
                    // canvasに変更した画像データを反映する
                    ctx_black.putImageData(imgData_black, 0, 0);
                    ctx_white.putImageData(imgData_white, 0, 0);
                    let resultImg = new Image();
                    resultImg.src = canvas_white.toDataURL();
                    resultImg.id = "page-" + i + 1 + "_background";
                    resultImg.style.zIndex = 10000 - i - 1;
                    resultImg.style.top = 2000 * i + "px";
                    document.getElementById("view").appendChild(resultImg);

                    resultImg = new Image();
                    resultImg.src = canvas_black.toDataURL();
                    resultImg.id = "page-" + i + 1 + "_black";
                    resultImg.style.zIndex = 10000 + i + 1;
                    resultImg.style.top = 2000 * i + "px";
                    document.getElementById("view").appendChild(resultImg);
                };
            };
            // ファイルをデータURLとして読み込む
            fileReader.readAsDataURL(file);
        }
=======
        //for (let i = 0; i < ev.target.files.length; i++) {
        i = 0;
        let file = ev.target.files[i];

        // ファイルリーダーを作成する
        let fileReader = new FileReader();

        // ファイルが読み込まれたら、次の処理を行う
        fileReader.onload = (event) => {
            // 画像要素を作成する
            let img = document.createElement("img");
            img.src = event.target.result;
            // 画像が読み込まれたら
            img.onload = () => {
                // canvas要素を作成する
                let canvas = document.createElement("canvas");
                // canvasのサイズを画像と同じにする
                // 修正箇所：img.widthとimg.heightを使う
                var canvas_black = document.createElement("canvas");
                var canvas_white = document.createElement("canvas");
                var ctx_black = canvas_black.getContext("2d");
                var ctx_white = canvas_white.getContext("2d");
                canvas_black.width = image.width;
                canvas_white.width = image.width;
                canvas_black.height = image.height;
                canvas_white.height = image.height;
                canvas.width = img.width;
                canvas.height = img.height;
                // canvasのコンテキストを取得する
                let ctx = canvas.getContext("2d");
                // canvasに画像を描画する
                ctx.drawImage(img, 0, 0);
                var imgData_black = ctx_black.getImageData(
                    0,
                    0,
                    canvas_black.width,
                    canvas_black.height
                );
                var imgData_white = ctx_white.getImageData(
                    0,
                    0,
                    canvas_white.width,
                    canvas_white.height
                );
                // canvasの画像データを取得する
                let imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);

                // 画像データのピクセル配列を取得する
                let pix = imgd.data;
                // ピクセル配列をループして白色のピクセルを透明にする
                for (var i = 0; i < imgData_black.data.length; i += 4) {
                    // RGBの値を取得
                    var r = imgData_black.data[i];
                    var g = imgData_black.data[i + 1];
                    var b = imgData_black.data[i + 2];

                    //0は透明

                    //黒レイヤーの操作
                    //黒は黒くする 黒以外は透明にする

                    //if (r >= threshold && g >= threshold && b >= threshold) {

                    function euclidean(r1, g1, b1, r2, g2, b2) {
                        return Math.sqrt(
                            Math.pow(r2 - r1, 2) +
                            Math.pow(g2 - g1, 2) +
                            Math.pow(b2 - b1, 2)
                        );
                    }
                    //白の値は360付近

                    let base_rgb = [51, 16, 36];

                    let shikisa = euclidean(
                        imgData_black.data[i],
                        imgData_black.data[i + 1],
                        imgData_black.data[i + 2],
                        base_rgb[0],
                        base_rgb[1],
                        base_rgb[2]
                    );

                    // 黒の判定用の閾値（0～255）
                    var threshold = 180;

                    let rgb_threshold = 150; //小さくすると透明になる面積が多くなる

                    //黒を黒くする
                    if (shikisa <= rgb_threshold) {
                        //ピンク以外を表示させる
                        imgData_black.data[i + 3] = 255;
                    } else {
                        //ピンクを透明にする
                        imgData_black.data[i] = 0;
                        imgData_black.data[i + 1] = 0;
                        imgData_black.data[i + 2] = 0;
                        imgData_black.data[i + 3] = 0;
                    }
                }
                // canvasに変更した画像データを反映する
                ctx.putImageData(imgd, 0, 0);
                // canvasのデータURLをimgのsrc属性に設定する
                img.src = canvas.toDataURL();
                document.getElementById("view").appendChild(img);
            };
        };
        // ファイルをデータURLとして読み込む
        fileReader.readAsDataURL(file);
>>>>>>> c3b097039e992598291187b624073c56434bba5b
    });
    /*
        //画像を作る
        for (let j = 1; j < 3; j++) {
            // 画像を読み込む
            var image = new Image();
            console.log(j + j * j);
            image.src = j + ".png"; //.jpgでも.pngでも対応

            // 画像をBlobオブジェクトに変換
            var xhr = new XMLHttpRequest();
            xhr.open("GET", image.src, true);
            xhr.responseType = "blob";
            xhr.onload = function () {
                console.log(j);
                var blob = this.response;
                var reader = new FileReader();
                reader.onloadend = function () {
                    var dataURL = reader.result;
                    var canvas_black = document.createElement("canvas");
                    var canvas_white = document.createElement("canvas");
                    var ctx_black = canvas_black.getContext("2d");
                    var ctx_white = canvas_white.getContext("2d");
                    canvas_black.width = image.width;
                    canvas_white.width = image.width;
                    canvas_black.height = image.height;
                    canvas_white.height = image.height;

                    // 画像を読み込んだ後にdrawImageメソッドを呼び出すように変更
                    image.onload = function () {
                        ctx_black.drawImage(image, 0, 0);
                        ctx_white.drawImage(image, 0, 0);
                        var imgData_black = ctx_black.getImageData(
                            0,
                            0,
                            canvas_black.width,
                            canvas_black.height
                        );
                        var imgData_white = ctx_white.getImageData(
                            0,
                            0,
                            canvas_white.width,
                            canvas_white.height
                        );

                        //灰色は白くする

                        for (var i = 0; i < imgData_black.data.length; i += 4) {
                            // RGBの値を取得
                            var r = imgData_black.data[i];
                            var g = imgData_black.data[i + 1];
                            var b = imgData_black.data[i + 2];

                            //0は透明

                            //黒レイヤーの操作
                            //黒は黒くする 黒以外は透明にする

                            //if (r >= threshold && g >= threshold && b >= threshold) {

                            function euclidean(r1, g1, b1, r2, g2, b2) {
                                return Math.sqrt(
                                    Math.pow(r2 - r1, 2) +
                                    Math.pow(g2 - g1, 2) +
                                    Math.pow(b2 - b1, 2)
                                );
                            }
                            //白の値は360付近

                            let base_rgb = [51, 16, 36];

                            let shikisa = euclidean(
                                imgData_black.data[i],
                                imgData_black.data[i + 1],
                                imgData_black.data[i + 2],
                                base_rgb[0],
                                base_rgb[1],
                                base_rgb[2]
                            );

                            // 黒の判定用の閾値（0～255）
                            var threshold = 180;

                            let rgb_threshold = 150; //小さくすると透明になる面積が多くなる

                            //黒を黒くする
                            if (shikisa <= rgb_threshold) {
                                //ピンク以外を表示させる
                                imgData_black.data[i + 3] = 255;
                            } else {
                                //ピンクを透明にする
                                imgData_black.data[i] = 0;
                                imgData_black.data[i + 1] = 0;
                                imgData_black.data[i + 2] = 0;
                                imgData_black.data[i + 3] = 0;
                            }
                        }

                        ctx_black.putImageData(imgData_black, 0, 0);
                        ctx_white.putImageData(imgData_white, 0, 0);

                        resultImg = new Image();
                        resultImg.src = canvas_white.toDataURL();
                        console.log(j);
                        console.log(100 * j + " px");
                        resultImg.style.top = 100 * j + "px";
                        resultImg.id = "page-1_background";
                        document.getElementById("view").appendChild(resultImg);
                        var resultImg = new Image();
                        resultImg.src = canvas_black.toDataURL();
                        resultImg.style.top = 100 * j + "px";
                        resultImg.id = "page-1_black";
                        document.getElementById("view").appendChild(resultImg);
                    };
                    image.src = dataURL;
                };
                reader.readAsDataURL(blob);
            };
            xhr.send();
        }
        */

    //赤シートを作る
    let html_red_sheet_truth = document.createElement("div");
    html_red_sheet_truth.id = "redsheet-truth";
    document.getElementById("view").appendChild(html_red_sheet_truth);

    let html_red_sheet_false = document.createElement("div");
    html_red_sheet_false.id = "redsheet-false";
    document.getElementById("view").appendChild(html_red_sheet_false);


    //画像を作る
    for (let j = 1; j < 3; j++) {
        // 画像を読み込む
        var image = new Image();
        console.log(j + j * j);
        image.src = j + ".png"; //.jpgでも.pngでも対応

        // 画像をBlobオブジェクトに変換
        var xhr = new XMLHttpRequest();
        xhr.open("GET", image.src, true);
        xhr.responseType = "blob";
        xhr.onload = function () {
            console.log(j);
            var blob = this.response;
            var reader = new FileReader();
            reader.onloadend = function () {
                var dataURL = reader.result;
                var canvas_black = document.createElement("canvas");
                var canvas_white = document.createElement("canvas");
                var ctx_black = canvas_black.getContext("2d");
                var ctx_white = canvas_white.getContext("2d");
                canvas_black.width = image.width;
                canvas_white.width = image.width;
                canvas_black.height = image.height;
                canvas_white.height = image.height;

                // 画像を読み込んだ後にdrawImageメソッドを呼び出すように変更
                image.onload = function () {
                    ctx_black.drawImage(image, 0, 0);
                    ctx_white.drawImage(image, 0, 0);
                    var imgData_black = ctx_black.getImageData(
                        0,
                        0,
                        canvas_black.width,
                        canvas_black.height
                    );
                    var imgData_white = ctx_white.getImageData(
                        0,
                        0,
                        canvas_white.width,
                        canvas_white.height
                    );

                    //灰色は白くする

                    for (var i = 0; i < imgData_black.data.length; i += 4) {
                        // RGBの値を取得
                        var r = imgData_black.data[i];
                        var g = imgData_black.data[i + 1];
                        var b = imgData_black.data[i + 2];

                        //0は透明

                        //黒レイヤーの操作
                        //黒は黒くする 黒以外は透明にする

                        //if (r >= threshold && g >= threshold && b >= threshold) {

                        function euclidean(r1, g1, b1, r2, g2, b2) {
                            return Math.sqrt(
                                Math.pow(r2 - r1, 2) +
                                Math.pow(g2 - g1, 2) +
                                Math.pow(b2 - b1, 2)
                            );
                        }
                        //白の値は360付近

                        let base_rgb = [51, 16, 36];

                        let shikisa = euclidean(
                            imgData_black.data[i],
                            imgData_black.data[i + 1],
                            imgData_black.data[i + 2],
                            base_rgb[0],
                            base_rgb[1],
                            base_rgb[2]
                        );

                        // 黒の判定用の閾値（0～255）
                        var threshold = 180;

                        let rgb_threshold = 150; //小さくすると透明になる面積が多くなる

                        //黒を黒くする
                        if (shikisa <= rgb_threshold) {
                            //ピンク以外を表示させる
                            imgData_black.data[i + 3] = 255;
                        } else {
                            //ピンクを透明にする
                            imgData_black.data[i] = 0;
                            imgData_black.data[i + 1] = 0;
                            imgData_black.data[i + 2] = 0;
                            imgData_black.data[i + 3] = 0;
                        }

                        //黒を黒くする
                        // if (r <= threshold && b <= threshold) {
                        //   //黒を黒くする
                        //   imgData_black.data[i + 3] = 255;
                        // } else {
                        //   //黒以外を透明にする
                        //   imgData_black.data[i] = 0;
                        //   imgData_black.data[i + 1] = 0;
                        //   imgData_black.data[i + 2] = 0;
                        //   imgData_black.data[i + 3] = 0;
                        // }

                        //黒を白くする  理想は、灰色(jpgのノイズ)を白にする
                        // if (r >= threshold && g >= threshold && b >= threshold) {
                        //   continue;
                        // } else {
                        // imgData_white.data[i] = 255;
                        // imgData_white.data[i + 1] = 255;
                        // imgData_white.data[i + 2] = 255;
                        // imgData_white.data[i + 3] = 255; //0にすると黒が透明になる
                        //}
                    }

                    ctx_black.putImageData(imgData_black, 0, 0);
                    ctx_white.putImageData(imgData_white, 0, 0);

                    resultImg = new Image();
                    resultImg.src = canvas_white.toDataURL();
                    console.log(j);
                    console.log(100 * j + " px");
                    resultImg.style.top = 100 * j + "px";
                    resultImg.id = "page-1_background";
                    document.getElementById("view").appendChild(resultImg);

                    var resultImg = new Image();
                    resultImg.src = canvas_black.toDataURL();
                    resultImg.style.top = 100 * j + "px";
                    resultImg.id = "page-1_black";
                    document.getElementById("view").appendChild(resultImg);
                };
                image.src = dataURL;
            };
            reader.readAsDataURL(blob);
        };
        xhr.send();
    }

    //赤シートを作る
    let html_red_sheet_truth = document.createElement("div");
    html_red_sheet_truth.id = "redsheet-truth";
    document.getElementById("view").appendChild(html_red_sheet_truth);

    let html_red_sheet_false = document.createElement("div");
    html_red_sheet_false.id = "redsheet-false";
    document.getElementById("view").appendChild(html_red_sheet_false);


    //赤シートを移動させる
    //要素の取得
    var element = document.getElementById("redsheet-false");
    console.log(element);

    //要素内のクリックされた位置を取得するグローバル（のような）変数
    var x;
    var y;

    //マウスが要素内で押されたとき、又はタッチされたとき発火
    element.addEventListener("mousedown", mdown, false);
    element.addEventListener("touchstart", mdown, false);

    //マウスが押された際の関数
    function mdown(e) {
        //クラス名に .drag を追加
        this.classList.add("drag");

        //タッチデイベントとマウスのイベントの差異を吸収
        if (e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //要素内の相対座標を取得
        x = event.pageX - this.offsetLeft;
        y = event.pageY - this.offsetTop;

        //ムーブイベントにコールバック
        document.body.addEventListener("mousemove", mmove, false);
        document.body.addEventListener("touchmove", mmove, false);
    }

    //マウスカーソルが動いたときに発火
    function mmove(e) {
        //ドラッグしている要素を取得
        var drag = document.getElementsByClassName("drag")[0];
        let redsheet_truth = document.getElementById("redsheet-truth");

        //同様にマウスとタッチの差異を吸収
        if (e.type === "mousemove") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //フリックしたときに画面を動かさないようにデフォルト動作を抑制
        e.preventDefault();

        //マウスが動いた場所に要素を動かす
        drag.style.top = event.pageY - y + "px";
        redsheet_truth.style.top = event.pageY - y + "px";
        drag.style.left = event.pageX - x + "px";
        redsheet_truth.style.left = event.pageX - x + "px";

        //マウスボタンが離されたとき、またはカーソルが外れたとき発火
        drag.addEventListener("mouseup", mup, false);
        document.body.addEventListener("mouseleave", mup, false);
        drag.addEventListener("touchend", mup, false);
        document.body.addEventListener("touchleave", mup, false);
    }

    //マウスボタンが上がったら発火
    function mup(e) {
        var drag = document.getElementsByClassName("drag")[0];
        console.log(drag);

        //ムーブベントハンドラの消去
        document.body.removeEventListener("mousemove", mmove, false);
        drag.removeEventListener("mouseup", mup, false);
        document.body.removeEventListener("touchmove", mmove, false);
        drag.removeEventListener("touchend", mup, false);

        //クラス名 .drag も消す
        drag.classList.remove("drag");
    }
}

<<<<<<< HEAD
function memorization_sheet_resize(resize_x, resize_y) {
    console.log(resize_x);
    console.log(resize_y);
    if (resize_x != 0) {
        document.getElementById("redsheet-truth").style.width = document.getElementById("redsheet-truth").clientWidth + resize_x + "px";
        document.getElementById("redsheet-false").style.width = document.getElementById("redsheet-false").clientWidth + resize_x + "px";
    }
    if (resize_y != 0) {
        document.getElementById("redsheet-truth").style.height = document.getElementById("redsheet-truth").clientHeight + resize_y + "px";
        document.getElementById("redsheet-false").style.height = document.getElementById("redsheet-false").clientHeight + resize_y + "px";
    }
}

=======
>>>>>>> c3b097039e992598291187b624073c56434bba5b
/*
// 画像を読み込む
var image = new Image();
image.src = "2.png"; //.jpgでも.pngでも対応
var xhr = new XMLHttpRequest();
xhr.open("GET", image.src, true);
xhr.responseType = "blob";
xhr.onload = function () {
    var blob = this.response;
    var reader = new FileReader();
    reader.onloadend = function () {
        var dataURL = reader.result;
        var canvas_black = document.createElement("canvas");
        var canvas_white = document.createElement("canvas");
        var ctx_black = canvas_black.getContext("2d");
        var ctx_white = canvas_white.getContext("2d");
        canvas_black.width = image.width;
        canvas_white.width = image.width;
        canvas_black.height = image.height;
        canvas_white.height = image.height;

        // 画像を読み込んだ後にdrawImageメソッドを呼び出すように変更
        image.onload = function () {
            ctx_black.drawImage(image, 0, 0);
            ctx_white.drawImage(image, 0, 0);
            var imgData_black = ctx_black.getImageData(
                0,
                0,
                canvas_black.width,
                canvas_black.height
            );
            var imgData_white = ctx_white.getImageData(
                0,
                0,
                canvas_white.width,
                canvas_white.height
            );

            //灰色は白くする

            for (var i = 0; i < imgData_black.data.length; i += 4) {
                // RGBの値を取得
                var r = imgData_black.data[i];
                var g = imgData_black.data[i + 1];
                var b = imgData_black.data[i + 2];

                //0は透明

                //黒レイヤーの操作
                //黒は黒くする 黒以外は透明にする

                //if (r >= threshold && g >= threshold && b >= threshold) {

                function euclidean(r1, g1, b1, r2, g2, b2) {
                    return Math.sqrt(
                        Math.pow(r2 - r1, 2) +
                        Math.pow(g2 - g1, 2) +
                        Math.pow(b2 - b1, 2)
                    );
                }
                //白の値は360付近

                let base_rgb = [51, 16, 36];

                let shikisa = euclidean(
                    imgData_black.data[i],
                    imgData_black.data[i + 1],
                    imgData_black.data[i + 2],
                    base_rgb[0],
                    base_rgb[1],
                    base_rgb[2]
                );

                // 黒の判定用の閾値（0～255）
                var threshold = 180;

                let rgb_threshold = 150; //小さくすると透明になる面積が多くなる

                //黒を黒くする
                if (shikisa <= rgb_threshold) {
                    //ピンク以外を表示させる
                    imgData_black.data[i + 3] = 255;
                } else {
                    //ピンクを透明にする
                    imgData_black.data[i] = 0;
                    imgData_black.data[i + 1] = 0;
                    imgData_black.data[i + 2] = 0;
                    imgData_black.data[i + 3] = 0;
                }

                //黒を黒くする
                // if (r <= threshold && b <= threshold) {
                //   //黒を黒くする
                //   imgData_black.data[i + 3] = 255;
                // } else {
                //   //黒以外を透明にする
                //   imgData_black.data[i] = 0;
                //   imgData_black.data[i + 1] = 0;
                //   imgData_black.data[i + 2] = 0;
                //   imgData_black.data[i + 3] = 0;
                // }

                //黒を白くする  理想は、灰色(jpgのノイズ)を白にする
                // if (r >= threshold && g >= threshold && b >= threshold) {
                //   continue;
                // } else {
                // imgData_white.data[i] = 255;
                // imgData_white.data[i + 1] = 255;
                // imgData_white.data[i + 2] = 255;
                // imgData_white.data[i + 3] = 255; //0にすると黒が透明になる
                //}
            }

            ctx_black.putImageData(imgData_black, 0, 0);
            ctx_white.putImageData(imgData_white, 0, 0);

            resultImg = new Image();
            resultImg.src = canvas_white.toDataURL();
            resultImg.id = "page-1_background";
            document.getElementById("view").appendChild(resultImg);
            var resultImg = new Image();
            resultImg.src = canvas_black.toDataURL();
            resultImg.id = "page-1_black";
            document.getElementById("view").appendChild(resultImg);
        };
        image.src = dataURL;
    };
    reader.readAsDataURL(blob);
};
xhr.send();
*/