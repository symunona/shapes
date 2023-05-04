/**
 * start over eggs
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

        function drawCircle(eggyness, asymmetry, r){

            // Circle
            let x0 = -r, y0 = 0,
                x1 = r, y1 = 0,
                cx0 = -r, cy0 = r * eggyness,
                cx1 = r, cy1 = r * eggyness * asymmetry

            p.bezier(x0, y0, cx0, cy0, cx1, cy1, x1, y1)
            p.bezier(x1, y1, cx1, -cy1, cx0, -cy0, x0, y0)

        }

        p.draw = function draw () {
            // Variables
            let gridX = p.properties.inputs.gridX.value,
                gridY = p.properties.inputs.gridY.value,
                sizeMultiplier = p.properties.inputs.sizeMultiplier.value,
                eggyness = p.properties.inputs.eggyness.value,
                asymmetry = p.properties.inputs.asymmetry.value,
                limits = {min: 0, max: p.PI / 4},
                mouseX = CircleProjection.mouseX || p.mouseX,
                mouseY = CircleProjection.mouseY || p.mouseY,
                // TODO: Eval!
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

                    p.rotate(r1)

                    p.fill(p.color(c.c.p[(xs + 2 + ys) % 16]))

                    drawCircle(eggyness, asymmetry, size)

                    p.pop()
                }
            }

        }
    };

    CircleProjection.prototype.properties = {
        id: 'b3',
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
                max: 300,
                value: 100
            },
            eggyness: {
                desc: 'eggyness',
                type: 'float',
                min: 0,
                max: p5.PI / 4,
                value: 1.552,
                input: 'mouseX + mouseY'
            },
            asymmetry: {
                desc: 'asymmetry',
                type: 'float',
                min: 0.0001,
                max: 10,
                value: 1
            }
        },
        presets: [
            {"name":"ver #001","values":{"gridX":10,"gridY":1,"sizeMultiplier":145.7125,"eggyness":0.5,"asymmetry":8.8001}}
        ]

    }

    return CircleProjection;
});
