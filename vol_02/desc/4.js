/**
 * Circles and ripples
 */
define(['frame', 'underscore'], (c, _)=>{
    'use strict'
    let PolyMovements = function (p) {
        // Defaults
        p.properties = _.extend({}, PolyMovements.prototype.properties)

        // Setup may be somewhere else... Also do not use c.
        p.setup = function () {
            // TODO: This is most probably not cool here...
            p.createCanvas(c.x, c.y)
            p.frameRate(30)
            c.info('b4', 'quadratic circles')
        }

        p.draw = function draw () {
            // Variables
            let gridX = p.properties.inputs.gridX.value,
                gridY = p.properties.inputs.gridY.value,
                sizeMultiplier = p.properties.inputs.sizeMultiplier.value,
                n = p.properties.inputs.n.value,
                m = p.properties.inputs.m.value,
                scalePlace = p.properties.inputs.scalePlace.value,
                scaleSizeDrop = p.properties.inputs.scaleSizeDrop.value,
                positionRadius = p.properties.inputs.positionRadius.value,
                spiral = p.properties.inputs.spiral.value,
                limits = {min: 0, max: p.PI},
                r1 = p.map(p.mouseX + p.mouseY, 0, c.w, limits.min, limits.max)

            // Computeds
            const sizeMagic = 0.5
            let sizeX = c.w / (gridX + 2), sizeY = c.h / (gridY + 2)
            let size = 1 / (gridY + gridX) / sizeMagic * sizeMultiplier
            let BACK = p.color(c.c.b)
            let deltaAngle = Math.PI / m * 2

            p.background(BACK)
            p.stroke(0)
            p.strokeWeight(0)
            for (let xs = 0; xs < gridX; xs++) {
                for (let ys = 0; ys < gridY; ys++) {
                    p.push()

                    p.translate(sizeX * (xs + 1.5), sizeY * (ys + 1.5))

                    p.rotate(r1)

                    // Draw n groups
                    for (let j = 0; j < m; j++) {
                        // Draw m circles

                        let angle = deltaAngle * j
                        let groupStartPos = c.radPos(angle, positionRadius)
                        for (let i = 0; i < n; i++) {
                            let angleCorrected = angle + (deltaAngle / n * i * spiral)
                            let center = c.radPos((angleCorrected), i * scalePlace)

                            p.fill(p.color(c.c.p[(i) % 16]))

                            p.circle(
                                center.x + groupStartPos.x,
                                center.y + groupStartPos.y,
                                size * 2 * Math.pow(scaleSizeDrop, i))
                            // console.log(center.x, center.y, size * 2 * (i * scaleSizeDrop + 1))
                        }
                    }
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
                max: 10,
                value: 1
            },
            gridY: {
                desc: 'vertical items',
                type: 'integer',
                min: 1,
                max: 10,
                value: 1
            },
            sizeMultiplier: {
                desc: 'size correction',
                type: 'float',
                step: 0.0125,
                min: 0,
                max: 50,
                value: 30
            },
            // angle: {
            //     desc: 'angle of each item',
            //     type: 'float',
            //     min: 0,
            //     max: p5.PI / 4,
            //     value: 1.34,
            //     input: 'p.mouseX + p.mouseY'
            // },
            m: {
                desc: 'm - circles in group',
                type: 'integer',
                min: 1,
                max: 16,
                value: 3
            },

            n: {
                desc: 'n - groups in branch',
                type: 'integer',
                min: 3,
                max: 16,
                value: 10
            },

            positionRadius: {
                desc: 'initial pos rad',
                type: 'float',
                min: -100,
                max: 100,
                value: 50
            },

            scaleSizeDrop: {
                desc: 'scale speed',
                type: 'float',
                min: -1,
                max: 1,
                value: 0.8
            },

            scalePlace: {
                desc: 'divergence',
                type: 'float',
                min: -100,
                max: 100,
                value: 15
            },

            spiral: {
                desc: 'angular disposition',
                type: 'float',
                min: -2,
                max: 2,
                value: 0,
                step: 0.001
            }
        },
        presets: [
            {'name': 'ver #001', 'values': {'gridX': 1, 'gridY': 1, 'sizeMultiplier': 30, 'angle': 1.34, 'm': 16, 'n': 16, 'positionRadius': 40.2, 'scaleSizeDrop': 0.8, 'scalePlace': 9.7, 'spiral': 0}},
            {'name': 'ver #002', 'values': {'gridX': 1, 'gridY': 1, 'sizeMultiplier': 19.5, 'angle': 1.34, 'm': 10, 'n': 9, 'positionRadius': 81.2, 'scaleSizeDrop': 1.1, 'scalePlace': 16.7, 'spiral': 0}},
            {'name': 'ver #003', 'values': {'gridX': 1, 'gridY': 1, 'sizeMultiplier': 36.8, 'm': 5, 'n': 16, 'positionRadius': 67.2, 'scaleSizeDrop': 0.8, 'scalePlace': 8.5, 'spiral': 0.475}},
            {"name":"ver #003 b","values":{"gridX":3,"gridY":3,"sizeMultiplier":15.7125,"m":16,"n":10,"positionRadius":50,"scaleSizeDrop":0.8,"scalePlace":15,"spiral":0}},
            {"name":"ver #004","values":{"gridX":4,"gridY":5,"sizeMultiplier":13.8125,"m":10,"n":9,"positionRadius":-75.2,"scaleSizeDrop":1,"scalePlace":16.7,"spiral":0}}

        ]

    }

    return PolyMovements;
});
