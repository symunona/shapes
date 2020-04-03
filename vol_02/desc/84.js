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
            // TODO: This is most probably not cool here...
            p.createCanvas(c.x, c.y)
            p.frameRate(30)
            c.info(83, 'panels')
        }

        p.draw = function draw () {
            // Variables
            let gridX = p.properties.inputs.gridX.value,
                gridY = p.properties.inputs.gridY.value,
                sizeMultiplier = p.properties.inputs.sizeMultiplier.value,
                poly = p.properties.inputs.poly.value,
                limits = {min: 0, max: p.PI / 4},
                // TODO: Eval!
                r1 = p.map(p.mouseX + p.mouseY, 0, c.w, limits.min, limits.max)

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

                    p.rotate(r1)

                    p.fill(p.color(c.c.p[(xs + 2 + ys) % 16]))
                    c.poly(p, 0, 0, sizeX * size * 2, poly)
                    p.pop()
                }
            }
        }
    };

    PolyMovements.prototype.properties = {
        id: 84,
        name: 'panels',
        inputs: {
            gridX: {
                desc: 'horizontal items',
                type: 'integer',
                min: 1,
                max: 10,
                value: 4
            },
            gridY: {
                desc: 'vertical items',
                type: 'integer',
                min: 1,
                max: 10,
                value: 3
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
                desc: 'angle of each item',
                type: 'float',
                min: 0,
                max: p5.PI / 4,
                value: 1.34,
                input: 'p.mouseX + p.mouseY'
            },
            poly: {
                desc: 'polygons',
                type: 'integer',
                min: 3,
                max: 10,
                value: 4
            }
        },
        presets: [
            {
                'name': 'ver #000',
                'values': {
                    'gridX': 4,
                    'gridY': 3,
                    'sizeMultiplier': 2,
                    'angle': 1.34,
                    'poly': 4
                }
            },
            {
                'name': 'ver #001',
                'values': {
                    'gridX': 6,
                    'gridY': 9,
                    'sizeMultiplier': 1.9625,
                    'angle': 1.34,
                    'poly': 4
                }
            },
            {
                'name': 'ver #002',
                'values': {
                    'gridX': 8,
                    'gridY': 8,
                    'sizeMultiplier': 5.9625,
                    'angle': 79.4,
                    'poly': 3
                }
            }
        ]

    }

    return PolyMovements;
});
