/**
 * Cyclic fractals
 */
define(['frame', 'underscore'], (c, _)=>{
    'use strict'
    let Cf = function (p) {
        p.properties = _.extend({}, Cf.prototype.properties)

        let BACK = p.color(c.c.b)

        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(10)
            c.info('cf0', 'cycles')
        }

        p.draw = function draw () {
            p.background(BACK)
            p.stroke(c.c.f)
            p.noFill()

            let levels = p.properties.inputs.levels.value
            let spawn = p.properties.inputs.spawn.value
            let ratio = p.properties.inputs.ratio.value
            let thickness = p.properties.inputs.thickness.value
            let dist = p.properties.inputs.dist.value
            let rc0 = c.x / 6 * p.properties.inputs.rc.value
            let deltaAngle = Math.PI * 2 / spawn

            let angleOffset = Math.PI / spawn;
            let angleOffsetStatic = p.map(p.mouseX, 0, c.w, 0, 2 * Math.PI)
            let angleOffsetDyn = p.map(p.mouseY, 0, c.h, 0, 2 * Math.PI)

            p.strokeWeight(thickness)

            // Rotate the whole image
            p.push()
            p.translate(c.cx, c.cy)
            p.rotate(angleOffsetStatic - angleOffsetDyn)
            drawUnit(0, 0, 0, rc0)
            p.pop()

            function drawUnit (level, cx, cy, r) {
                p.stroke(c.c.p[10 - level])
                p.circle(cx, cy, 2 * r)
                let rChild = r * ratio
                let childCenterDist = (r + rChild) * dist
                if (level < levels) {
                    for (let s = 0; s < spawn; s++) {
                        let angleOffset2 = angleOffset + angleOffsetDyn;
                        if (level % 2) { angleOffset2 = angleOffset2 * 2 }
                        drawUnit(level + 1,
                            cx + Math.cos(((deltaAngle) * s) + angleOffset2) * childCenterDist,
                            cy + Math.sin(((deltaAngle) * s) + angleOffset2) * childCenterDist,
                            rChild
                        )
                    }
                }
            }
        }
    };


    Cf.prototype.properties = {
        id: 'cf0',
        name: 'circle fractal 1',
        inputs: {
            levels: {
                desc: 'levels',
                type: 'integer',
                min: 0,
                max: 8,
                value: 2
            },
            spawn: {
                desc: 'spawns',
                type: 'integer',
                min: 1,
                max: 8,
                value: 2
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
                step: 0.01,
                min: 0.01,
                max: 10,
                value: 1
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
            {'name': 'ver #000 trin', 'values': {'levels': 4, 'spawn': 3, 'ratio': -0.5, 'thickness': 1, 'rc': 2.75}},
            {'name': 'ver #004', 'values': {'levels': 4, 'spawn': 3, 'ratio': -0.5, 'thickness': 1, 'rc': 0.94, 'dist': 3}},
            {'name': 'ver #001 penta kale', 'values': {'levels': 5, 'spawn': 5, 'ratio': 0.5, 'thickness': 1, 'rc': 0.9}},
            {'name': 'ver #002 stargate', 'values': {'levels': 3, 'spawn': 3, 'ratio': -2.66, 'thickness': 0.79, 'rc': 0.9, 'dist': -0.9}}
        ]
    }

    return Cf;
});
