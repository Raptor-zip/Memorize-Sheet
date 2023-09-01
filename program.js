function first_script() {
    document.getElementById("file").addEventListener("change", (ev) => {
        for (let i = 0; i < ev.target.files.length; i++) {
            let file = ev.target.files[i];

            // ディレクトリの相対パス
            let relativePath = file.webkitRelativePath;

            // ここではテキストファイルとして読み出してみる.
            let fileReader = new FileReader();
            fileReader.onload = (event) => {
                // 内容を取得する.
                let text = event.target.result;

                // 表示してみる.
                //console.log(relativePath, text);

                // data64形式に変換する.
                let data64 = btoa(unescape(encodeURIComponent(text)));

                // canvasまたはimgでhtml上に表示させる.
                let img = document.createElement("img");
                img.src = "data:image/png;base64," + data64;
                document.body.appendChild(img);
            };
            fileReader.readAsText(file);
        }
    });

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


// 画像を読み込む
var image = new Image();
image.src = "1.png"; //.jpgでも.pngでも対応

// 画像をBlobオブジェクトに変換
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

            let html_red_sheet_truth = document.createElement("div");
            html_red_sheet_truth.id = "redsheet-truth";
            document.getElementById("view").appendChild(html_red_sheet_truth);

            let html_red_sheet_false = document.createElement("div");
            html_red_sheet_false.id = "redsheet-false";
            document.getElementById("view").appendChild(html_red_sheet_false);

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