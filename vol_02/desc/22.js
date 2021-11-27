/**
 * Cogs
 */
define(['frame', 'underscore', '../../js/vendor/seedrandom'], (c, _)=>{
    'use strict'
    let Cf = function (p) {
        Math.seedrandom(0);

        p.properties = _.extend({}, Cf.prototype.properties)

        let BACK = p.color(c.c.b)

        let mainTree;

        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(20)
            c.info('tri-v2', 'durham')

            p.background(BACK)
            p.noFill()

            p.draw()
        }


        p.draw = function draw () {
            p.background(BACK)
            p.noFill()
            p.strokeWeight(0)

            p.push()
            p.translate(c.cx, c.cy)

            let n = Cf.prototype.properties.inputs.n.value
            let l = 0, maxl = Cf.prototype.properties.inputs.levels.value

            while (l <= maxl){
                p.fill(c.c.p[l + 3])
                p.rotate(p.TWO_PI / n / 2)
                c.poly(p, 0, 0, c.cx / (Math.pow(2, l)), n)
                l++
            }
        }

        Cf.onChange = function () {
            p.draw()
        }
    };


    Cf.prototype.properties = {
        id: 'tri-v2',
        name: 'durham',
        inputs: {
            levels: {
                desc: 'levels',
                type: 'integer',
                min: 0,
                max: 8,
                value: 2,
                onChange: ()=>Cf.onChange()
            },
            n: {
                desc: 'n',
                type: 'integer',
                min: 2,
                max: 10,
                value: 3
            }
        },
        presets: [
        ]
    }

    return Cf;
});
