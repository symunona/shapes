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
                length = p.properties.inputs.length.value,
                angle = p.properties.inputs.angle.value,
                asymmetry = p.properties.inputs.asymmetry.value,
                brush = p.properties.inputs.brush.value

            // Computeds
            let sizeX = c.w / (gridX + 2), sizeY = c.h / (gridY + 2)
            let BACK = p.color(c.c.b)

            p.background(BACK)
            p.stroke(c.c.f)
            p.strokeWeight(1)
            for (let xs = 0; xs < gridX; xs++) {
                for (let ys = 0; ys < gridY; ys++) {
                    p.push()
                    let x = sizeX * (xs + 1.5), y = sizeY * (ys + 1.5),
                        dy = Math.abs((y - p.mouseY) / 2) / asymmetry, dx = Math.abs((x - p.mouseX) / 2) * asymmetry,
                        n = Math.sqrt((dx * dx) + (dy * dy))/ c.w / brush

                    p.translate(x, y)
                    p.rotate(angle)

                    p.line(-length * n, -length * n, length * n , length* n)

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
                value: 40
            },
            gridY: {
                desc: 'vertical items',
                type: 'integer',
                min: 1,
                max: 1000,
                value: 40
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
                max: 2 * Math.PI,
                step: 0.000125,
                value: 0,
            },
            length: {
                desc: 'length',
                type: 'float',
                step: 1,
                min: 0,
                max: 50,
                value: 50
            },
            asymmetry: {
                desc: 'asymmetry',
                type: 'float',
                step: 0.01,
                min: 0.0001,
                max: 2,
                value: 1.2
            },
            brush: {
                desc: 'brush',
                type: 'float',
                step: 0.001,
                min: 0,
                max: 10,
                value: 2.7
            },
        },
        presets: [
            {"name":"ver #000","values":{"gridX":10,"gridY":10,"sizeMultiplier":2,"angle":0,"length":27}},
            {"name":"ver #001 - more lines","values":{"gridX":40,"gridY":40,"sizeMultiplier":2,"angle":0,"length":7}},
            {"name":"ver #002 - many lines","values":{"gridX":40,"gridY":40,"sizeMultiplier":2,"angle":0,"length":25,"asymmetry":0.94}},
            {"name":"ver #003","values":{"gridX":40,"gridY":40,"sizeMultiplier":2,"angle":0,"length":50,"asymmetry":1.1201,"brush":2.762}},
        ]

    }

    return PolyMovements;
});
