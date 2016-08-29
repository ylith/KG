/**
 * Created by Iggy on 8/27/2016.
 */
$( document ).ready(function() {
    var canvas = document.getElementById("canvas"),
        gridCanvas = document.getElementById("topCanvas"),
        ctx = canvas.getContext("2d"),
        gridCtx = gridCanvas.getContext("2d"),
        color = "rgba(255, 0, 0, 0.5)",
        isDown = false,
        x1, y1, x2, y2,
        pixelSize = 10,
        distance,
        method = 1;

    drawGrid(gridCanvas, pixelSize);

    $(window).on('mouseup', function (e) {
        isDown = false;
    });

    $('#pixelSize').bind('input', function() {
        pixelSize = parseInt($(this).val());
        resetCanvas(canvas);
        resetCanvas(gridCanvas);
        drawGrid(gridCanvas, pixelSize);
        x1 = x2 = y1 = y2 = undefined;
    });

    $('#clearCanvas').click(function() {
        resetCanvas(canvas);
        resetCanvas(gridCanvas);
        drawGrid(gridCanvas, pixelSize);
        x1 = x2 = y1 = y2 = undefined;
    });

    $('#html5colorpicker').bind('input', function() {
        var c = hexToRgb($(this).val());
        color = "rgba(" + c['r'] + ", " + c['g'] + ", " + c['b'] + ", " + "0.5)";
    });

    $('#cgMethod').bind('input', function() {
        method = parseInt($(this).val());
    });

    $('#canvas').on('mousedown', function (e) {
        if (isDown === false) {
            isDown = true;
            var pos = getMousePos(canvas, e);
            var pixelX = Math.floor(pos.x / pixelSize) * pixelSize,
                pixelY = Math.floor(pos.y / pixelSize) * pixelSize;
            if (x1 != undefined && x2 != undefined && y1 != undefined && y2 != undefined) {
                x2 = y2 = undefined;
                x1 = pixelX;
                y1 = pixelY;
            } else if (x1 != undefined && y1 != undefined) {
                x2 = pixelX;
                y2 = pixelY;
            } else {
                x1 = pixelX;
                y1 = pixelY;
            }
            distance = getDistance(x1, y1, x2, y2);
            ctx.font = "14px Arial";
            ctx.fillStyle = "rgba(42, 124, 175, 1)";
            setPixel(canvas, pos.x, pos.y, ctx.fillStyle, 5);
            var text = "(" + pixelX / pixelSize + ", " + pixelY / pixelSize + ")";
            ctx.fillText(text, pos.x + 3, pos.y + 3);
        }
    });

    $('#useMethod').click(function() {
        if (x1 == undefined || x2 == undefined || y1 == undefined || y2 == undefined) {
            return;
        }
        switch (method) {
            case 1:
                bresenhamLine(canvas, x1, y1, x2, y2, color, pixelSize);
                break;
            case 2:
                DDAline(canvas, x1, y1, x2, y2, color, pixelSize);
                break;
            case 3:
                DDACircle(canvas, x1, y1, distance, color, pixelSize);
                break;
            case 4:
                MichenerCircle(canvas, x1, y1, distance, color, pixelSize);
                break;
        }
    });
});