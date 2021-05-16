/**
 * Barrel Blues
 */
define(['frame', 'underscore'], (c, _)=>{
    'use strict'
    let Barrel = function (p) {
        p.properties = _.extend({}, Barrel.prototype.properties)

        let BACK = p.color(c.c.b)

        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(10)
            c.info('b0', 'barrel')
        }

        p.draw = function draw () {
            p.background(BACK)
            p.stroke(c.c.f)
            p.noFill()


            let bodyRatioX = p.properties.inputs.fatx.value
            let bodyRatioY = p.properties.inputs.faty.value
            let rows = p.properties.inputs.rows.value
            let cols = p.properties.inputs.cols.value
            let thikness = p.properties.inputs.thikness.value
            let quadmult = p.properties.inputs.quadmult.value

            p.strokeWeight(thikness)

            const w = Number(c.w) / 3, h = Number(c.h) / 3
            let dx = w / cols, dy = h / rows

            // vertical lines
            // standard bezier
            for (let x = 0; x < cols; x++) {
                let xdiff = (dx * (x - (cols / 2) + 0.5))
                let x0 = c.cx + xdiff
                // Let's go parabolic
                let xn0 = ((x - (cols / 2) + 0.5) / cols)
                let xn0q = Math.pow(xn0, 2)
                let y00 = (h / 2) - Math.abs((xn0q) * quadmult)
                let y0 = c.cy - y00

                let ycp0 = y0 + (h / 2 * bodyRatioY)
                let xcp0 = c.cx + (xdiff * bodyRatioX)
                let y1 = c.cy + y00
                let ycp1 = y1 - (h / 2 * bodyRatioY)
                let x1 = x0
                let xcp1 = xcp0

                p.bezier(x0, y0, xcp0, ycp0, xcp1, ycp1, x1, y1)
            }
        }
    };


    Barrel.prototype.properties = {
        id: 'b0',
        name: 'barrel',
        inputs: {
            rows: {
                desc: 'rows',
                type: 'integer',
                min: 0,
                max: 100,
                value: 5
            },
            cols: {
                desc: 'cols',
                type: 'integer',
                min: 1,
                max: 100,
                value: 10
            },
            fatx: {
                desc: 'fatX',
                type: 'float',
                step: 0.1,
                min: 0,
                max: 10,
                value: 1.1
            }, faty: {
                desc: 'fatY',
                type: 'float',
                step: 0.1,
                min: 0,
                max: 10,
                value: 0.2
            },
            thikness: {
                desc: 'thikness',
                type: 'float',
                step: 0.1,
                min: 0,
                max: 10,
                value: 1
            },
            quadmult: {
                desc: 'quadmult',
                type: 'float',
                step: 1,
                min: -200,
                max: 200,
                value: 50
            }
        },
        presets: [
            {'name': 'ver #000', 'values': {'rows': 5, 'cols': 17, 'fatx': 2.3, 'faty': 3.4, 'thikness': 1}},
            {'name': 'ver #001', 'values': {'rows': 5, 'cols': 10, 'fatx': 3.8, 'faty': 0, 'thikness': 1, 'quadmult': 200}},
            {'name': 'ver #002', 'values': {'rows': 41, 'cols': 75, 'fatx': 3.3, 'faty': 7.4, 'thikness': 0.9, 'quadmult': 200}}
        ]
    }

    return Barrel;
});
