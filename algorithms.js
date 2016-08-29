function DDAline(canvas, x1, y1, x2, y2, color, pixelSize) {
    pixelSize = Math.abs(pixelSize) || 1;
    var h = Math.abs(x2 - x1),
        v = Math.abs(y2 - y1),
        slope = v / h,
        sX = false,
        sY = false,
        reverse = false;
    if (x2 < x1) {
        sX = true;
    }
    if (y2 < y1) {
        sY = true;
    }
    if (h < v) {
        reverse = true;
        slope = 1 / slope;
        h = [v, v = h][0]; //swap h and v
    }
    if (h == 0) {
        setPixel(canvas, x1, y1, color, pixelSize);
        return;
    }
    for (var i = 0; i <= h; i += pixelSize) {
        var x = Math.round(i / pixelSize) * pixelSize;
        var y = Math.round(Math.floor(slope * i + 0.5) / pixelSize) * pixelSize;
        if (reverse) {
            x = [y, y = x][0]; //swap x and y
        }
        if (sX) {
            x = (-1) * x;
        }
        if (sY) {
            y = (-1) * y;
        }
        setPixel(canvas, x + x1, y + y1, color, pixelSize);
    }
}

function bresenhamLine(canvas, x1, y1, x2, y2, color, pixelSize) {
    pixelSize = Math.abs(pixelSize) || 1;
    var incX = 1,
        incY = 1,
        reverse = false,
        h = Math.abs(x2 - x1),
        v = Math.abs(y2 - y1);
    if (x2 < x1) {
        incX = -1;
    }
    if (y2 < y1) {
        incY = -1;
    }
    if (h < v) {
        reverse = true;
        h = [v, v = h][0]; //swap h and v
    }
    incX *= pixelSize;
    incY *= pixelSize;

    var incUP = 2 * v - 2 * h,
        incDOWN = 2 * v,
        x = x1,
        y = y1,
        est = 2 * v - h;

    for (var i = 0; i <= h; i += pixelSize) {
        setPixel(canvas, x, y, color, pixelSize);
        if (est >= 0) {
            est += incUP;
            x += incX;
            y += incY;
        } else {
            est += incDOWN;
            if (reverse) {
                y += incY;
            } else {
                x += incX;
            }
        }
    }
}

function fourSymmetric(xc, yc, x, y, canvas, color, pixelSize) {
    setPixel(canvas, xc + x, yc + y, color, pixelSize);
    setPixel(canvas, xc - x, yc - y, color, pixelSize);
    setPixel(canvas, xc - x, yc + y, color, pixelSize);
    setPixel(canvas, xc + x, yc - y, color, pixelSize);
}

function eightSymmetric(xc, yc, x, y, canvas, color, pixelSize) {
    fourSymmetric(xc, yc, x, y, canvas, color, pixelSize);
    fourSymmetric(xc, yc, y, x, canvas, color, pixelSize);
}

function DDACircle(canvas, xc, yc, radius, color, pixelSize) {
    radius = Math.floor(radius / pixelSize) * pixelSize;
    var x = 0,
        y = radius;

    setPixel(canvas, xc, yc + radius, color, pixelSize);
    setPixel(canvas, xc, yc - radius, color, pixelSize);
    setPixel(canvas, xc + radius, yc, color, pixelSize);
    setPixel(canvas, xc - radius, yc, color, pixelSize);

    while (x < y) {
        x += pixelSize;
        y = Math.round(Math.floor(Math.sqrt(radius * radius - x * x)) / pixelSize) * pixelSize;
        eightSymmetric(xc, yc, x, y, canvas, color, pixelSize);
    }
    if (x == y) {
        fourSymmetric(xc, yc, x, y, canvas, color, pixelSize);
    }
}

function MichenerCircle(canvas, xc, yc, radius, color, pixelSize) {
    radius = Math.floor(radius / pixelSize) * pixelSize;
    var y = radius,
        d = 3 - 2 * radius;
    eightSymmetric(xc, yc, 0, radius, canvas, color, pixelSize);
    for (var x = 0; x < y; x += pixelSize) {
        if (d >= 0) {
            d += 10 + 4 * x - 4 * y;
            y -= pixelSize;
        } else {
            d += 6 + 4 * x;
        }
        eightSymmetric(xc, yc, x, y, canvas, color, pixelSize);
    }
}

function simpleFloodFill(canvas, x, y, currentColor, color, pixelSize, neighboursToCheck, delay) {
    delay = delay || 100;
    neighboursToCheck = neighboursToCheck == 4 ? 4 : 8;
    var ctx = canvas.getContext("2d");
    var p = ctx.getImageData(x, y, 1, 1).data;
    if ((currentColor.length == p.length) && currentColor.every(function (element, index) {
            return element === p[index];
        })) {
        x = Math.floor(x / pixelSize) * pixelSize;
        y = Math.floor(y / pixelSize) * pixelSize;
        ctx.clearRect(x, y, pixelSize, pixelSize);
        console.log(x, y);
        setPixel(canvas, x, y, color, pixelSize);
        if (x + pixelSize < canvas.width) {
            setTimeout(function () {
                simpleFloodFill(canvas, x + pixelSize, y, currentColor, color, pixelSize, neighboursToCheck, delay);
            }, delay);
        }
        if (x - pixelSize >= 0) {
            setTimeout(function () {
                simpleFloodFill(canvas, x - pixelSize, y, currentColor, color, pixelSize, neighboursToCheck, delay);
            }, delay);
        }
        if (y - pixelSize >= 0) {
            setTimeout(function () {
                simpleFloodFill(canvas, x, y - pixelSize, currentColor, color, pixelSize, neighboursToCheck, delay);
            }, delay);
        }
        if (y + pixelSize < canvas.height) {
            setTimeout(function () {
                simpleFloodFill(canvas, x, y + pixelSize, currentColor, color, pixelSize, neighboursToCheck, delay);
            }, delay);
        }
        if (neighboursToCheck == 8) {
            if (x + pixelSize < canvas.width && y + pixelSize < canvas.height) {
                var p1 = ctx.getImageData(x + pixelSize, y, 1, 1).data;
                var p2 = ctx.getImageData(x, y + pixelSize, 1, 1).data;
                var t1 = (currentColor.length == p1.length) && currentColor.every(function (element, index) {
                        return element === p1[index];
                    });
                var t2 = (currentColor.length == p2.length) && currentColor.every(function (element, index) {
                        return element === p2[index];
                    });
                if (t1 && t2) {
                    setTimeout(function () {
                        simpleFloodFill(canvas, x + pixelSize, y + pixelSize, currentColor, color, pixelSize, neighboursToCheck, delay);
                    }, delay);
                }
            }
            if (x - pixelSize >= 0 && y - pixelSize >= 0) {
                var p1 = ctx.getImageData(x - pixelSize, y, 1, 1).data;
                var p2 = ctx.getImageData(x, y - pixelSize, 1, 1).data;
                var t1 = (currentColor.length == p1.length) && currentColor.every(function (element, index) {
                        return element === p1[index];
                    });
                var t2 = (currentColor.length == p2.length) && currentColor.every(function (element, index) {
                        return element === p2[index];
                    });
                if (t1 && t2) {
                    setTimeout(function () {
                        simpleFloodFill(canvas, x - pixelSize, y - pixelSize, currentColor, color, pixelSize, neighboursToCheck, delay);
                    }, delay);
                }
            }
            if (x - pixelSize >= 0 && y + pixelSize < canvas.height) {
                var p1 = ctx.getImageData(x - pixelSize, y, 1, 1).data;
                var p2 = ctx.getImageData(x, y + pixelSize, 1, 1).data;
                var t1 = (currentColor.length == p1.length) && currentColor.every(function (element, index) {
                        return element === p1[index];
                    });
                var t2 = (currentColor.length == p2.length) && currentColor.every(function (element, index) {
                        return element === p2[index];
                    });
                if (t1 && t2) {
                    setTimeout(function () {
                        simpleFloodFill(canvas, x - pixelSize, y + pixelSize, currentColor, color, pixelSize, neighboursToCheck, delay);
                    }, delay);
                }
            }
            if (x + pixelSize < canvas.width && y - pixelSize >= 0) {
                var p1 = ctx.getImageData(x + pixelSize, y, 1, 1).data;
                var p2 = ctx.getImageData(x, y - pixelSize, 1, 1).data;
                var t1 = (currentColor.length == p1.length) && currentColor.every(function (element, index) {
                        return element === p1[index];
                    });
                var t2 = (currentColor.length == p2.length) && currentColor.every(function (element, index) {
                        return element === p2[index];
                    });
                if (t1 && t2) {
                    setTimeout(function () {
                        simpleFloodFill(canvas, x + pixelSize, y - pixelSize, currentColor, color, pixelSize, neighboursToCheck, delay);
                    }, delay);
                }
            }
        }
    }
}

function cohenSutherlandClipping(x1, y1, x2, y2, xmin, ymin, xmax, ymax) {
    var o2 = (y2 > ymax) * 8 + (y2 < ymin) * 4 + (x2 > xmax) * 2 + (x2 < xmin);
    while (true) {
        var o1 = (y1 > ymax) * 8 + (y1 < ymin) * 4 + (x1 > xmax) * 2 + (x1 < xmin);
        if (o1 == 0 && o2 == 0) {
            return {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            };
        }
        if ((o1 & o2) != 0) {
            return false;
        }
        console.log('o1', o1, ~o1);
        if (o1 == 0) {
            o1 = [o2, o2 = o1][0];
            x1 = [x2, x2 = x1][0];
            y1 = [y2, y2 = y1][0];
        }
        if (o1 & 8) {
            x1 = x1 + (x2 - x1) * (ymax - y1) / (y2 - y1);
            y1 = ymax;
        } else if (o1 & 4) {
            x1 = x1 + (x2 - x1) * (ymin - y1) / (y2 - y1);
            y1 = ymin;
        } else if (o1 & 2) {
            y1 = y1 + (y2 - y1) * (xmax - x1) / (x2 - x1);
            x1 = xmax;
        } else {
            y1 = y1 + (y2 - y1) * (xmin - x1) / (x2 - x1);
            x1 = xmin;
        }
    }
}

//Bernstein
function B(i, n, t) {
    return fact(n) / (fact(i) * fact(n - i)) * Math.pow(t, i) * Math.pow(1 - t, n - i);
}

function P(t, points) {
    var r = [0, 0];
    var n = points.length - 1;
    for (var i = 0; i <= n; i++) {
        r[0] += points[i][0] * B(i, n, t);
        r[1] += points[i][1] * B(i, n, t);
    }
    return r;
}

function bezier(canvas, initialPoints, color) {
    var ctx = canvas.getContext("2d"),
        length = initialPoints.length,
        tLength = 0,
        newPoints = [];
    for (var i = 0; i < initialPoints.length - 1; i++) {
        tLength += getDistance(initialPoints[i][0], initialPoints[i][1], initialPoints[i + 1][0], initialPoints[i + 1][1]);
    }
    var step = 1 / tLength;
    for (var t = 0; t <= 1; t = t + step) {
        var p = P(t, initialPoints);
        newPoints.push(p);
    }

    ctx.beginPath();
    ctx.moveTo(newPoints[0][0], newPoints[0][1]);
    for (var i = 1; i < newPoints.length; i++) {
        ctx.lineTo(newPoints[i][0], newPoints[i][1]);
    }
    ctx.stroke();
}
