/**
 * circle angles
 */
 define(['frame', 'underscore', 'p5'], (c, _, p5)=>{
    'use strict'
    let CircleProjection = function (p) {
        // Defaults
        p.properties = _.extend({}, CircleProjection.prototype.properties)

        // Setup may be somewhere else... Also do not use c.
        p.setup = function () {
            // TODO: This is most probably not cool here...
            p.createCanvas(c.x, c.y)
            p.frameRate(30)
            c.info(3, 'panels')
        }

        function drawCircle(stripes, r){

            p.circle(0, 0, 2 * r)

            var stepY = 2 * r / stripes

            p.fill(p.color(c.c.b))

            for ( let i = 0; i < stripes; i++){
                p.triangle(-r * 2, 0, r, 2 * (r - ((i + 0.25) * stepY)), r, 2 * (r - ((i + 0.75) * stepY)))
            }

        }

        p.draw = function draw () {
            // Variables
            let gridX = p.properties.inputs.gridX.value,
                gridY = p.properties.inputs.gridY.value,
                sizeMultiplier = p.properties.inputs.sizeMultiplier.value,
                limits = {min: 0, max: p.PI / 4},
                mouseX = CircleProjection.mouseX || p.mouseX,
                mouseY = CircleProjection.mouseY || p.mouseY,
                r1 = p.map(mouseX + mouseY, 0, c.w, limits.min, limits.max)

            // Computeds
            const sizeMagic = 0.5
            let sizeX = c.w / (gridX + 2), sizeY = c.h / (gridY + 2)
            let size = 1 / (gridY + gridX) / sizeMagic * sizeMultiplier
            let BACK = p.color(c.c.b)

            p.background(BACK)
            p.stroke(0)
            p.strokeWeight(0)
            for (let xs = 0; xs < gridX; xs++) {
                for (let ys = 0; ys < gridY; ys++) {
                    p.push()

                    p.translate(sizeX * (xs + 1.5), sizeY * (ys + 1.5))

                    p.rotate(r1 + (Math.PI / 2 * (xs + ys)))

                    p.fill(p.color(c.c.p[(xs + 2 + ys) % 16]))

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
                max: 300,
                value: 140
            }
        },
        presets: [
        ]

    }

    return CircleProjection;
});
