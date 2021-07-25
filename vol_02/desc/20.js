/**
 * Still not a real tree.
 */
define(['frame', 'underscore'], (c, _)=>{
    'use strict'
    let Ring = function (p) {
        p.properties = _.extend({}, Ring.prototype.properties)

        p.setup = function () {
            p.createCanvas(c.x, c.y)
            // p.frameRate(60)
            c.info('psy', 'ring')
            // p.blendMode(p.ADD)
            p.colorMode(p.HSB, 255);
        }

        let t = 0
        let width = 100
        let height = 50

        p.draw = function draw () {
            // p.background(BACK)
            let col = p.color(t * 10 % 255, 150, 250)
            p.fill(col)
            p.noStroke()
            let x = Math.sin(t) * width, y = Math.cos(t) * height
            p.circle(c.cx + x, c.cy + y, 15)
            t += 0.07
        }
    };

    Ring.prototype.properties = {
        id: 'psy-1'
    }


    return Ring;
});
