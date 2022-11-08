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
            c.info(9, 'panels')
        }

        function drawCircle(stripes, r){
            p.circle(0, 0, 2 * r)
            var stepY = 2 * r / stripes
            // Erase with back color
            p.fill(p.color(c.c.b))
            for ( let i = 0; i < stripes; i++){
                p.triangle(-r * 2, 0, r, 2 * (r - ((i + 0.25) * stepY)), r, 2 * (r - ((i + 0.75) * stepY)))
            }

        }

        p.draw = function draw () {
            let v = c.v(p),
                mouseX = CircleProjection.mouseX || p.mouseX,
                mouseY = CircleProjection.mouseY || p.mouseY,
                r1 = p.map(mouseX + mouseY, 0, c.w, 0, Math.PI)

            let sizeX = c.w / (v.gridX + 2), sizeY = c.h / (v.gridY + 2)
            let size = 1 / (v.gridY + v.gridX) * v.sizeMultiplier
            let BACK = p.color(c.c.b)

            p.background(BACK)
            p.stroke(0)
            p.strokeWeight(0)
            for (let xs = 0; xs < v.gridX; xs++) {
                for (let ys = 0; ys < v.gridY; ys++) {
                    p.push()

                    p.translate(sizeX * (xs + 1.5), sizeY * (ys + 1.5))
                    p.rotate(r1 + (Math.PI / 2 * ((xs + ys) * v.angle)))

                    p.fill(p.color(c.c.p[(xs + 2 + ys) % 16]))

                    // c.poly(p, 0, 0, sizeX * size * 2, 4)
                    drawCircle(9, size)

                    p.pop()
                }
            }

        }
    };

    CircleProjection.prototype.properties = {
        id: 'b5',
        name: 'panels',
        inputs: {
            gridX: {
                desc: 'horizontal items',
                type: 'integer',
                min: 1,
                max: 10,
                value: 5
            },
            gridY: {
                desc: 'vertical items',
                type: 'integer',
                min: 1,
                max: 10,
                value: 5
            },
            sizeMultiplier: {
                desc: 'size correction',
                type: 'float',
                step: 0.0125,
                min: 0,
                max: 280,
                value: 260
            },
            angle: {
                desc: 'offset',
                type: 'float',
                step: 0.00001,
                min: 0,
                max: Math.PI / 4,
                value: 0
            }
        },
        presets: [
        ]

    }

    return CircleProjection;
});
