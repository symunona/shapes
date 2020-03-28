/**
 * Movement
 */
define(['frame'], (c)=>{
    'use strict'
    let drawing = function (p) {
        let gridX = 4, gridY = 3;
        let sizeX = c.w / (gridX + 2), sizeY = c.h / (gridY + 2)

        let size = gridY / gridX * 1.1;
        let BACK = p.color(c.c.b)

        let limits = {min: 0, max: p.PI / 4}

        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(30)
            c.info(83, 'panels')
        }

        p.draw = function draw () {
            let r1 = p.map(p.mouseX + p.mouseY, 0, c.w, limits.min, limits.max);
            p.background(BACK)
            p.stroke(0)
            p.strokeWeight(0)
            for (let xs = 0; xs < gridX; xs++) {
                for (let ys = 0; ys < gridY; ys++) {
                    p.push()

                    p.translate(sizeX * (xs + 1.5), sizeY * (ys + 1.5))

                    // p.rotate(p.PI/2/2 + (p.frameCount / 200))
                    p.rotate(r1)

                    p.fill(p.color(c.c.p[(xs + 2 + ys) % 16]))
                    p.rect(-sizeX * size, -sizeX * size, sizeX * size * 2, sizeX * size * 2)
                    p.pop()
                }
            }
        }
    };

    return drawing;
});
