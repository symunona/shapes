/**
 * Movements of poly
 */
define(['frame', 'underscore', 'p5'], (c, _, p5)=>{
    'use strict'
    let PolyMovements = function (p) {
        // Defaults
        p.properties = _.extend({}, PolyMovements.prototype.properties)

        // Setup may be somewhere else... Also do not use c.
        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(30)
            c.info(85, 'waves')
        }

        p.draw = function draw () {
            // Variables
            let gridX = p.properties.inputs.gridX.value,
                gridY = p.properties.inputs.gridY.value,
                sizeMultiplier = p.properties.inputs.sizeMultiplier.value,
                length = p.properties.inputs.length.value,
                limits = {min: 0, max: p.PI / 4},
                // TODO: Eval!
                r1 = p.map((p.mouseX + p.mouseY) * 2 , 0, c.w, limits.min, limits.max)

            // Computeds
            const sizeMagic = 0.5
            let sizeX = c.w / (gridX + 2), sizeY = c.h / (gridY + 2)
            let size = 1 / (gridY + gridX) / sizeMagic * sizeMultiplier
            let BACK = p.color(c.c.b)

            p.background(BACK)
            p.stroke(c.c.p[5])
            p.strokeWeight(1)
            for (let xs = 0; xs < gridX; xs++) {
                for (let ys = 0; ys < gridY; ys++) {
                    p.push()

                    p.translate(sizeX * (xs + 1.5), sizeY * (ys + 1.5))
                    p.rotate(r1)
                    p.line(-length, -length, length, length)

                    p.pop()
                }
            }
        }
    };


    PolyMovements.prototype.properties = {
        id: 'b3',
        name: 'panels',
        inputs: {
            gridX: {
                desc: 'horizontal items',
                type: 'integer',
                min: 1,
                max: 1000,
                value: 10
            },
            gridY: {
                desc: 'vertical items',
                type: 'integer',
                min: 1,
                max: 1000,
                value: 10
            },
            sizeMultiplier: {
                desc: 'size correction',
                type: 'float',
                step: 0.0125,
                min: 0,
                max: 10,
                value: 2
            },
            angle: {
                desc: 'angle',
                type: 'float',
                min: 0,
                max: p5.PI / 4,
                value: 1.34,
                input: 'p.mouseX + p.mouseY'
            },
            length: {
                desc: 'length',
                type: 'float',
                step: 0.0125,
                min: 0,
                max: 50,
                value: 10
            },
        },
        presets: [

        ]

    }

    return PolyMovements;
});
