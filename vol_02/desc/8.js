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
            c.info('c4', 'poly angle')
        }

        p.draw = function draw () {
            // Variables
            let gridX = p.properties.inputs.gridX.value,
                gridY = p.properties.inputs.gridY.value,
                length = p.properties.inputs.length.value,
                angle = p.properties.inputs.angle.value,
                asymmetry = p.properties.inputs.asymmetry.value,
                brush = p.properties.inputs.brush.value,
                poly = p.properties.inputs.poly.value,
                dr = p.properties.inputs.dr.value

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
                        d = Math.sqrt((dx * dx) + (dy * dy))/ c.w / brush

                    p.translate(x, y)
                    p.rotate(angle + dy * dx * dr)

                    var color = 2 + Math.floor((xs + ys) / (gridX + gridY) * 14)
                    p.fill(c.c.p[color])
                    c.p = c.poly(p, 0, 0, length * d, poly)

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
                max: 150,
                value: 20
            },
            gridY: {
                desc: 'vertical items',
                type: 'integer',
                min: 1,
                max: 150,
                value: 20
            },
            dr: {
                desc: 'rotate scale',
                type: 'float',
                step: 0.00003,
                min: 0,
                max: 1,
                value: 0.0001
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
                value: 3
            }
        },
        presets: [
            {"name":"ver #001 - cloth","values":{"gridX":88,"gridY":64,"dr":0.0001,"angle":0,"length":50,"asymmetry":1.2,"brush":2.7,"poly":3}},
            {"name":"ver #004","values":{"gridX":20,"gridY":20,"sizeMultiplier":2,"angle":2.33375,"length":50,"asymmetry":0.7901,"brush":1.357,"poly":4}},
            {"name":"ver #002","values":{"gridX":88,"gridY":64,"dr":0.0001,"angle":0,"length":9,"asymmetry":1.0901,"brush":0.381,"poly":4}},
            {"name":"ver #003 - DNA","values":{"gridX":27,"gridY":83,"dr":0.4453125,"angle":2.110757564130642,"length":50,"asymmetry":1.2,"brush":0.390625,"poly":2}}
        ]

    }

    return PolyMovements;
});
