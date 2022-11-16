/**
 * circle angle explosions
 */
 define(['frame', 'underscore', 'p5'], (c, _, p5)=>{
    'use strict'

    let CircleProjection = function (p) {
        // Defaults
        p.properties = _.extend({}, CircleProjection.prototype.properties)

        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(30)
            c.info(29, 'pecs')
        }

        function drawPoly(r, n){
            let da = Math.PI / n * 2

            for ( let i = 0; i < n; i++){
                let x1 = Math.sin(i * da) * r,
                    y1 = Math.cos(i * da) * r,
                    x2 = Math.sin((i + 1) * da) * r,
                    y2 = Math.cos((i + 1) * da) * r
                p.line(x1, y1, x2, y2)
            }

        }

        p.draw = function draw () {
            let v = c.v(p),
                mouseX = CircleProjection.mouseX || p.mouseX,
                mouseY = CircleProjection.mouseY || p.mouseY,
                r1 = p.map(mouseX + mouseY, 0, c.w, 0, Math.PI)

            let BACK = p.color(c.c.b)

            p.background(BACK)
            p.stroke(0)
            p.strokeWeight(0)
            p.translate(c.cx, c.cy)
            for (let n = 0; n < v.depth; n++) {
                p.push()

                p.rotate(r1 + ((Math.PI * 2 / v.poly) / 2  * (n % 2)  ))

                let r = Math.pow(Math.cos(Math.PI / v.poly), n) * v.sizeMultiplier

                p.strokeWeight(v.lineWidth)
                p.stroke(p.color(c.c.b))
                p.fill(p.color(c.c.b))
                p.circle(0, 0, 2 * r)

                p.strokeWeight(1)
                p.stroke(p.color(c.c.p[Math.floor((n + 2) % 16)]))
                drawPoly(r, v.poly)

                p.pop()
            }

        }
    };

    CircleProjection.prototype.properties = {
        id: '29',
        name: 'pecs',
        inputs: {
            depth: {
                desc: 'depth',
                type: 'integer',
                min: 1,
                max: 40,
                value: 12
            },
            poly: {
                desc: 'angles',
                type: 'integer',
                min: 3,
                max: 27,
                value: 8
            },
            sizeMultiplier: {
                desc: 'size correction',
                type: 'float',
                step: 0.0125,
                min: 0,
                max: 600,
                value: 300
            },
            lineWidth: {
                desc: 'line-buf',
                type: 'float',
                step: 0.0125,
                min: 0,
                max: 330,
                value: 0
            },
            fill: {
                type: 'boolean',
            }
        },
        presets: [
        ]

    }

    return CircleProjection;
});
