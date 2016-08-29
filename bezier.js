/**
 * Created by Iggy on 8/28/2016.
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
        points = [],
        pixelSize = 1;

    $(window).on('mouseup', function (e) {
        isDown = false;
    });

    $('#clearCanvas').click(function () {
        resetCanvas(gridCanvas);
        resetCanvas(canvas);
        points = [];
        closed = working = false;
    });

    $('#draw').click(function () {
        bezier(canvas, points, color);
    });

    $('#html5colorpicker').bind('input', function () {
        var c = hexToRgb($(this).val());
        color = "rgba(" + c['r'] + ", " + c['g'] + ", " + c['b'] + ", " + "0.5)";
    });

    $('#canvas').on('mousedown', function (e) {
        if (isDown === false) {
            isDown = true;
            var pos = getMousePos(canvas, e);
            setPixel(gridCanvas, pos.x, pos.y, "rgba(42, 124, 175, 1)");
            gridCtx.font = "14px Arial";
            ctx.fillStyle = "rgba(42, 124, 175, 1)";
            var text = "P" + points.length + "(" + pos.x + ", " + pos.y + ")";
            gridCtx.fillText(text, pos.x + 3, pos.y + 3);
            points.push([pos.x, pos.y]);
            var length = points.length;
            if (length >= 2) {
                drawLine(canvas, points[length - 2][0], points[length - 2][1], pos.x, pos.y, color);
            }
        }
    });
});