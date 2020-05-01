/**
 * PolyClock.
 */
define(['frame'], (c)=>{
    'use strict'
    let polyClock = function (p) {
        const R = c.x / 12 // Poly Size
        const MARKER_SIZE = 16

        const start = new Date().getTime();

        let FORE = p.color(c.c.f),
            BACK = p.color(c.c.b),
            STROKE = p.color(c.c.p[6]),
            MARKER = p.color(c.c.p[8])

        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(30)
            c.info('b1', 'poly clock')
        }

        p.draw = function draw () {
            p.background(BACK)
            let time = new Date().getTime()

            let seconds = (time / 1000) % 86400,
                minutes = seconds / 60,
                hour = minutes / 60,
                minutePer10 = minutes / 10 % 6,
                minuteMod10 = minutes % 10,
                secondsPer10 = seconds / 10 % 6,
                secondsMod10 = seconds % 10

            const DIGITS = 6

            //    delta from current loaded / mils * radian / second per round
            let secondSpeed = (time - start) / 1000 * p.TWO_PI / 10

            // Bottom Right
            digit(c.x / DIGITS * 3.5, c.y / 5 * 4, secondsPer10, secondSpeed / 10)
            digit(c.x / DIGITS * 5, c.y / 5 * 4, secondsMod10, secondSpeed)

            // Middle Middle
            digit(c.x / DIGITS * 1.5, c.cy, minutePer10, secondSpeed / 600)
            digit(c.x / DIGITS * 3, c.cy, minuteMod10, secondSpeed / 60)

            // Top left
            digit(c.x / DIGITS, c.y / 5, hour, secondSpeed / 3600)
        }

        function digit (x, y, n, a) {
            p.push()
            p.translate(x, y)
            p.rotate(a)

            p.fill(FORE)
            p.strokeWeight(1)
            p.stroke(STROKE)
            polygon(0, 0, R, n)

            // Marker dot.
            p.stroke(MARKER)
            p.strokeWeight(MARKER_SIZE)
            p.beginShape()
            p.vertex(R, 0)
            p.endShape(p.CLOSE)

            // Text in the marker.
            p.strokeWeight(1)
            p.fill(BACK)
            p.textAlign(p.CENTER, p.CENTER);
            p.translate(R, 0)
            p.text(Math.floor(n), 0, 0)
            p.pop()
        }

        function polygon (x, y, radius, n) {
            let angle = p.TWO_PI / n;
            p.beginShape()
            // Always draw a dot.
            p.vertex(x + radius, y);
            for (let a = angle; a < p.TWO_PI; a += angle) {
                let sx = x + p.cos(a) * radius
                let sy = y + p.sin(a) * radius
                p.vertex(sx, sy);
            }
            p.endShape(p.CLOSE);
        }
    }
    return polyClock
});
