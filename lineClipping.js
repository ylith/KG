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
        x1, y1, x2, y2,
        xmin = 100, ymin = 100, xmax = 200, ymax = 200,
        lines = [];

    function drawClippingArea(xmin, ymin, xmax, ymax) {
        gridCtx.beginPath();
        gridCtx.rect(xmin, ymin, xmax, ymax);
        gridCtx.stroke();
    }

    drawClippingArea(xmin, ymin, xmax, ymax);

    $(window).on('mouseup', function (e) {
        isDown = false;
    });

    $('#xmin').bind('input', function() {
        xmin = parseInt($(this).val());
        resetCanvas(canvas);
        resetCanvas(gridCanvas);
        drawClippingArea(xmin, ymin, xmax, ymax);
        x1 = x2 = y1 = y2 = undefined;
    });

    $('#xmax').bind('input', function() {
        xmax = parseInt($(this).val());
        resetCanvas(canvas);
        resetCanvas(gridCanvas);
        drawClippingArea(xmin, ymin, xmax, ymax);
        x1 = x2 = y1 = y2 = undefined;
    });

    $('#ymin').bind('input', function() {
        ymin = parseInt($(this).val());
        resetCanvas(canvas);
        resetCanvas(gridCanvas);
        drawClippingArea(xmin, ymin, xmax, ymax);
        x1 = x2 = y1 = y2 = undefined;
    });

    $('#ymax').bind('input', function() {
        ymax = parseInt($(this).val());
        resetCanvas(canvas);
        resetCanvas(gridCanvas);
        drawClippingArea(xmin, ymin, xmax, ymax);
        x1 = x2 = y1 = y2 = undefined;
    });

    $('#clearCanvas').click(function () {
        resetCanvas(canvas);resetCanvas(gridCanvas);
        drawClippingArea(xmin, ymin, xmax, ymax);
        lines = [];
        x1 = x2 = y1 = y2 = undefined;
    });

    $('#draw').click(function () {
        for (var i = 0; len = lines.length, i < len; i++) {
            console.log(lines[i]);
            lines[i] = cohenSutherlandClipping(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2, xmin, ymin, xmax+xmin, ymax+ymin);
            console.log(lines[i]);
        }
        resetCanvas(canvas);
        for (var i = 0; len = lines.length, i < len; i++) {
            if (lines[i]) {
                ctx.beginPath();
                ctx.moveTo(lines[i].x1, lines[i].y1);
                ctx.lineTo(lines[i].x2, lines[i].y2);
                ctx.stroke();
            }
        }
    });

    $('#html5colorpicker').bind('input', function () {
        var c = hexToRgb($(this).val());
        color = "rgba(" + c['r'] + ", " + c['g'] + ", " + c['b'] + ", " + "0.5)";
    });

    $('#canvas').on('mousedown', function (e) {
        if (isDown === false) {
            isDown = true;
            var pos = getMousePos(canvas, e);
            if (x1 != undefined && y1 != undefined) {
                console.log(2);
                x2 = pos.x;
                y2 = pos.y;
            } else {
                console.log(1);
                x1 = pos.x;
                y1 = pos.y;
            }
            console.log(x1, y1, x2, y2);
            if (x1 != undefined && x2 != undefined && y1 != undefined && y2 != undefined) {
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                lines.push({x1: x1, y1: y1, x2: x2, y2: y2});
                x1 = x2 = y1 = y2 = undefined;
            }
        }
    });
});