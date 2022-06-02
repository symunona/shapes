/**
 * Still not a real tree.
 */
 define(['frame', 'underscore'], (c, _)=>{
    'use strict'
    let Tree = function (p) {
        p.properties = _.extend({}, Tree.prototype.properties)

        let BACK = p.color(c.c.b)

        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(10)
            c.info('tf2', 'trees')
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
            let alternateFreq = p.properties.inputs.alternateFreq.value
            let alternateAmp = p.properties.inputs.alternateAmp.value
            let rc0 = c.x / 6 * p.properties.inputs.rc.value
            let deltaAngle = Math.PI / spawn

            let angleOffset = Math.PI / spawn;
            let angleOffsetDyn = p.map(p.mouseY, 0, c.h, Math.PI, Math.PI * 2)

            p.strokeWeight(thickness)

            // Rotate the whole image
            p.push()
            p.translate(c.cx, c.cy + c.y / 6)
            drawUnit(0, rc0)
            p.pop()

            function drawUnit (level, r) {
                p.stroke(c.c.p[(color - level + 16) % 16])

                // The sizing ratio can alternate.
                let rChild = r * (level % alternateFreq ? 1 : ratio)

                p.line(0, 0, 0, -r)

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


    Tree.prototype.properties = {
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
            alternateFreq: {
                desc: 'alternate freq',
                type: 'float',
                step: 0.01,
                min: 0,
                max: 10,
                value: 1
            },
            alternateAmp: {
                desc: 'alternate amp',
                type: 'float',
                step: 0.01,
                min: 0,
                max: 5,
                value: 1
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
            },
            dist: {
                desc: 'dist',
                type: 'float',
                step: 0.1,
                min: -5,
                max: 5,
                value: 1
            }


        },
        presets: [
            {'name': 'ver #000', 'values': {'levels': 7, 'color': 9, 'spawn': 3, 'ratio': 1.1, 'thickness': 0.68, 'rc': 0.3, 'dist': 0.4}},
            {"name":"ver #001 - 3","values":{"levels":5,"color":10,"spawn":3,"ratio":0.5,"alternateFreq":1,"alternateAmp":0,"thickness":1,"rc":1.8,"dist":-2.6}},
            {"name":"ver #002 - hex","values":{"levels":7,"color":10,"spawn":2,"ratio":0.5,"alternateFreq":2,"alternateAmp":2.12,"thickness":1,"rc":1.3,"dist":1}}
        ]
    }

    return Tree;
});
