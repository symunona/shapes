/**
 * #72
 *
 * SCH Tribute
 */

const random = require('random')
const seedrandom = require('seedrandom')
random.use(seedrandom('sch'))



function getRandomColor(letters) {
    letters = letters || '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(random.float() * letters.length)];
    }
    return color;
}


module.exports = function (d) {

    let gridX = 8; gridY = 16;
    let sizeX = d.w / (gridX + 2) / 2, sizeY = d.h / (gridY + 2)
    let offset = {
        x: d.w / 5,
        y: 0
    }

    let offset2 = {
        x: d.w / 4 * 3,
        y: 0
    }
    let size = 1.8;

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')

    for (let xs = 0; xs < gridX; xs++) {
        for (let ys = 0; ys < gridY; ys++) {
            g
                .append('path')
                .attr('d', unit({ x: 1, y: 1, r: size * 10 }, d))
                .attr('transform', d.m({
                    x: offset.x + (sizeX * (xs + 1.5) + (xs % 2 ? 0 : sizeX / 8)),
                    y: offset.y + (sizeY * (ys + 1.5))
                }))
                .attr('fill', d.c[Math.floor(xs/2) + 2 + ys])
                .attr('class', 'window window-' + ys + '-' + Math.floor(xs / 2))
        }
    }
    xs = 0
    for (let ys = 0; ys < gridY; ys++) {
        g
            .append('path')
            .attr('d', unit({ x: 0.5, y: 1, r: size * 10 }, d))
            .attr('transform', d.m({
                x: offset2.x,
                y: offset2.y + (sizeY * (ys + 1.5))
            }))
            .attr('fill', getRandomColor('89ABCDEF'))
            .attr('id', 'floor-' + ys)
    }

    d.save('sch tribute')
}

function unit(size, d) {

    let rectangle = d.lineD(d.d3.curveLinearClosed)(d.rect(size.x * size.r / 2, size.y * size.r / 2))
    return rectangle

}
