/**
 * Movements of poly
 */
define(['frame', 'underscore'], (c, _)=>{
    'use strict'
    let PolyMovements = function (p) {
        // Defaults
        p.properties = _.extend({}, PolyMovements.prototype.properties)

        // Setup may be somewhere else... Also do not use c.
        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(30)
            c.info('c3', 'poly rules')
        }

        p.draw = function draw () {
            // Variables
            let gridX = p.properties.inputs.gridX.value,
                gridY = p.properties.inputs.gridY.value,
                length = p.properties.inputs.length.value,
                angle = p.properties.inputs.angle.value,
                asymmetry = p.properties.inputs.asymmetry.value,
                brush = p.properties.inputs.brush.value,
                poly = p.properties.inputs.poly.value

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

                    var color = 2 + Math.floor((xs + ys) / (gridX + gridY) * 14)
                    p.fill(c.c.p[color])
                    // p.line(-length * n, -length * n, length * n , length* n)
                    c.p = c.poly(p, 0, 0, length * n, poly)

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
                max: 100,
                value: 40
            },
            gridY: {
                desc: 'vertical items',
                type: 'integer',
                min: 1,
                max: 100,
                value: 40
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
            poly: {
                desc: 'polygons',
                type: 'integer',
                min: 2,
                max: 9,
                value: 4
            }
        },
        presets: [
            {"name":"ver #004","values":{"gridX":20,"gridY":20,"angle":2.33375,"length":50,"asymmetry":0.7901,"brush":1.357,"poly":4}}
        ]

    }

    return PolyMovements;
});
