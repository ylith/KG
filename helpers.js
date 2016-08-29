/**
 * Created by Iggy on 8/27/2016.
 */

function setPixel(canvas, x, y, color, pixelSize) {
    color = color || [255, 0, 0, 127];
    pixelSize = pixelSize || 1;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    return ctx.fillRect(x, y, pixelSize, pixelSize);
}

function rgbaToArray(color) {
    color = color.replace(/\s/g, '');
    var start_pos = color.indexOf('rgba(') + 5;
    var end_pos = color.indexOf(')', start_pos);
    var text = color.substring(start_pos, end_pos);
    var c = text.split(",");
    c[3] = Math.floor(c[3] * 255);
    for (var i = 0; i < c.length; i++) {
        c[i] = parseInt(c[i]);
    }
    return c;
}

function drawLine(canvas, x1, y1, x2, y2, color) {
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function drawGrid(canvas, pixelSize) {
    var ctx = canvas.getContext("2d"),
        w = canvas.width,
        h = canvas.height;
    ctx.beginPath();
    for (var x = 0; x <= w; x += pixelSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h + pixelSize);
    }

    for (var x = 0; x <= h; x += pixelSize) {
        ctx.moveTo(0, x);
        ctx.lineTo(w + pixelSize, x);
    }

    ctx.closePath();
    ctx.strokeStyle = "rgba(50, 50, 50, 0.1)";
    ctx.stroke();
}

function resetCanvas(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function fact(k) {
    if (k == 0 || k == 1) {
        return 1;
    } else {
        return k * fact(k - 1);
    }
}

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
}