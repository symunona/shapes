/**
 * Movements of poly
 */
define(['frame', 'underscore','../js/gridder'], (c, _, Gridder)=>{
    'use strict'
    let FirstGrid = function (p) {
        p.properties = _.extend({}, FirstGrid.prototype.properties)
        // Setup may be somewhere else... Also do not use c.
        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(30)
            c.info('d0', 'gridder')
        }

        let squareDrawer = new Gridder.Square()

        p.draw = function draw () {
            let BACK = p.color(c.c.b)

            p.background(BACK)
            p.stroke(c.c.f)
            p.strokeWeight(0)

            squareDrawer.draw(p, {w: c.w, h: c.h, spacing: 50}, (p, xi, yi, x, y)=>{
                // console.log(c.c.p[x+y/2 % 16])
                p.fill(c.c.p[15-( xi + yi ) % 16])
                p.circle(0, 0, 2*(xi + yi))
            })

        }
    };

    FirstGrid.prototype.properties = {
        id: 'grid-01',
        name: 'grid-01',
        inputs: []
    }

    return FirstGrid;
});
