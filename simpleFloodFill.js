/**
 * Created by Iggy on 8/27/2016.
 */

$(document).ready(function () {
    var canvas = document.getElementById("canvas"),
        gridCanvas = document.getElementById("topCanvas"),
        ctx = canvas.getContext("2d"),
        gridCtx = gridCanvas.getContext("2d"),
        color = "rgba(255, 0, 0, 0.5)",
        isDown = false,
        closed = false,
        working = false,
        x1, y1, x2, y2,
        prevPoints = [],
        pixelSize = 20;

    drawGrid(gridCanvas, pixelSize);

    $(window).on('mouseup', function (e) {
        isDown = false;
    });

    $('#pixelSize').bind('input', function () {
        pixelSize = parseInt($(this).val());
        resetCanvas(gridCanvas);
        resetCanvas(canvas);
        drawBoard(gridCanvas, pixelSize);
        prevPoints = [];
        closed = working = false;
    });

    $('#clearCanvas').click(function () {
        resetCanvas(gridCanvas);
        resetCanvas(canvas);
        drawGrid(gridCanvas, pixelSize);
        prevPoints = [];
        closed = working = false;
    });

    $('#draw').click(function () {
        if (closed) {
            return;
        }
        var length = prevPoints.length;
        if (length >= 3) {
            bresenhamLine(canvas, prevPoints[length - 1].x, prevPoints[length - 1].y, prevPoints[0].x,
                prevPoints[0].y, color, pixelSize);
            closed = true;
        }
    });

    $('#html5colorpicker').bind('input', function () {
        var c = hexToRgb($(this).val());
        color = "rgba(" + c['r'] + ", " + c['g'] + ", " + c['b'] + ", " + "0.5)";
    });

    $('#canvas').on('mousedown', function (e) {
        if (working) {
            return;
        }
        if (isDown === false) {
            isDown = true;
            var pos = getMousePos(canvas, e);
            var pixelX = Math.floor(pos.x / pixelSize) * pixelSize,
                pixelY = Math.floor(pos.y / pixelSize) * pixelSize;
            console.log(pixelX, pixelY);
            if (!closed) {
                setPixel(gridCanvas, pos.x, pos.y, "blue");
                prevPoints.push({"x": pixelX, "y": pixelY});
                var length = prevPoints.length;
                if (length >= 2) {
                    bresenhamLine(canvas, prevPoints[length - 1].x, prevPoints[length - 1].y, prevPoints[length - 2].x,
                        prevPoints[length - 2].y, color, pixelSize);
                }
                gridCtx.font = "14px Arial";
                ctx.fillStyle = "rgba(42, 124, 175, 1)";
                var text = "(" + pixelX / pixelSize + ", " + pixelY / pixelSize + ")";
                gridCtx.fillText(text, pos.x + 3, pos.y + 3);

                for (var i = 0; i < length - 1; i++) {
                    if (prevPoints[i].x == pixelX && prevPoints[i].y == pixelY) {
                        closed = true;
                    }
                }
            } else {
                var p = ctx.getImageData(pos.x, pos.y, 1, 1).data;
                var currentColor = rgbaToArray(color);
                if ((currentColor.length == p.length) && currentColor.every(function(element, index) {
                        return element === p[index];
                    })) {
                    return;
                }
                working = true;
                var methodType = $('#methodType').is(':checked') ? 8 : 4;
                simpleFloodFill(canvas, pixelX, pixelY, p, color, pixelSize, methodType);
                working = false;
            }
        }
    });
});