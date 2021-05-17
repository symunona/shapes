/**
 * Still not a real tree.
 */
define(['frame', 'underscore'], (c, _)=>{
    'use strict'
    let AlmosTree2 = function (p) {
        p.properties = _.extend({}, AlmosTree2.prototype.properties)

        let BACK = p.color(c.c.b)

        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(10)
            c.info('tf1', 'trees')
        }

        p.draw = function draw () {
            p.background(BACK)
            p.stroke(c.c.f)
            p.noFill()

            let levels = p.properties.inputs.levels.value
            let spawn = p.properties.inputs.spawn.value
            let ratio = p.properties.inputs.ratio.value
            let thickness = p.properties.inputs.thickness.value
            let color = p.properties.inputs.color.value
            let rc0 = c.x / 6 * p.properties.inputs.rc.value
            let deltaAngle = Math.PI * 2 / spawn

            let angleOffset = Math.PI / spawn;
            let angleOffsetDyn = p.map(p.mouseY, 0, c.h, 0, 2 * Math.PI)

            p.strokeWeight(thickness)

            // Rotate the whole image
            p.push()
            p.translate(c.cx, c.cy + c.y / 6)
            drawUnit(0, rc0)
            p.pop()

            function drawUnit (level, r) {
                p.stroke(c.c.p[(color - level + 16) % 16])

                let rChild = r * ratio

                p.line(0, 0, 0, r)

                if (level < levels) {
                    for (let s = 0; s < spawn; s++) {
                        let angleOffset2 = angleOffset + angleOffsetDyn;
                        p.push()
                        p.translate(0, -r)
                        p.rotate(((deltaAngle) * s) + angleOffset2)

                        drawUnit(
                            level + 1,
                            rChild
                        )
                        p.pop()
                    }
                }
            }
        }
    };


    AlmosTree2.prototype.properties = {
        id: 'cf0',
        name: 'circle fractal 1',
        inputs: {
            levels: {
                desc: 'levels',
                type: 'integer',
                min: 0,
                max: 8,
                value: 5
            },
            color: {
                desc: 'color',
                type: 'integer',
                min: 0,
                max: 15,
                value: 10
            },
            spawn: {
                desc: 'spawns',
                type: 'integer',
                min: 1,
                max: 8,
                value: 3
            },
            ratio: {
                desc: 'ratio',
                type: 'float',
                step: 0.01,
                min: -3,
                max: 3,
                value: 0.5
            },
            thickness: {
                desc: 'thickness',
                type: 'float',
                step: 0.01,
                min: 0.01,
                max: 10,
                value: 1
            },
            rc: {
                desc: 'rc',
                type: 'float',
                step: 0.1,
                min: 0.1,
                max: 5,
                value: 1.5
            }
        },
        presets: [
        ]
    }

    return AlmosTree2;
});
