/**
 * #78
 *
 * Vasarely
 */

const random = require('random')
const seedrandom = require('seedrandom')
random.use(seedrandom('shapes'))

module.exports = function (d) {

    let gridX = 1; gridY = 1;
    let sizeX = d.w / (gridX + 2), sizeY = d.h / (gridY + 2)

    let g = d.append('g')
        .attr('id', 'shape-77')
        .attr('fill-rule', 'evenodd')
        .attr('gridX', gridX)
        .attr('gridY', gridY)

    let r = 50, m = r / Math.sqrt(2), a = r / 3

    for (let xs = 0; xs < gridX; xs++) {
        for (let ys = 0; ys < gridY; ys++) {
            let color = random.int(4, 6);

            g
                .append('path')
                .attr('d', d.lineD(d.d3.curveLinearClosed)(tile1(r, m, a)))
                .attr('transform', d.m({ x: sizeX * (xs + 1.5), y: sizeY * (ys + 1.5) }))
                .attr('class', 'sq-' + xs + '-' + ys + ' f-' + color)

            color = random.int(4, 6)
            g
                .append('path')
                .attr('d', d.lineD(d.d3.curveLinearClosed)(tile2(r, m, a)))
                .attr('transform', d.m({ x: sizeX * (xs + 1.5), y: sizeY * (ys + 1.5) }))
                .attr('class', 'sq-' + xs + '-' + ys + ' f-' + color)

            color = random.int(4, 6)
            g
                .append('path')
                .attr('d', d.lineD(d.d3.curveLinearClosed)(tile3(r, m, a)))
                .attr('transform', d.m({ x: sizeX * (xs + 1.5), y: sizeY * (ys + 1.5) }))
                .attr('class', 'sq-' + xs + '-' + ys + ' f-' + color)

        }
    }
    d.save('vasarely')
}

function tile1(r, m, a) {
    return [
        { x: 0, y: 0 },
        { x: 0, y: -r },
        { x: -m, y: -r + a },
        { x: -m, y: a }
    ]
}

function tile2(r, m, a) {
    return [
        { x: 0, y: 0 },
        { x: -m, y: a },
        { x: 0, y: 2 * a },
        { x: m, y: a }
    ]
}

function tile3(r, m, a) {
    return [
        { x: 0, y: 0 },
        { x: m, y: a },
        { x: m, y: a - r },
        { x: 0, y: -r }
    ]
}

