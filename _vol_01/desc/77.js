/**
 * #77
 * animated pants
 *
 */

const random = require('random')
const seedrandom = require('seedrandom')
random.use(seedrandom('shapes'))

module.exports = function (d) {

    let gridX = 21; gridY = 15;
    let sizeX = d.w / (gridX + 2), sizeY = d.h / (gridY + 2)

    let size = gridY / gridX;

    let g = d.append('g')
        .attr('id', 'shape-77')
        .attr('fill-rule', 'evenodd')
        .attr('gridX', gridX)
        .attr('gridY', gridY)

    for (let xs = 0; xs < gridX; xs++) {
        for (let ys = 0; ys < gridY; ys++) {
            let color = random.int(0, 10) < 8 ? random.int(0, 3) : random.int(0, 16)
            g
                .append('path')
                .attr('d', unit({ x: sizeX / 2, y: sizeY / 2, r: size }, d))
                .attr('transform', d.m({ x: sizeX * (xs + 1.5), y: sizeY * (ys + 1.5) }))
                .attr('class', 'sq-' + xs + '-' + ys + ' f-' + color)

        }
    }
    d.save('tiles')
}

function unit(size, d) {
    let rectangle = d.lineD(d.d3.curveLinearClosed)(rect(size.x, size.y))
    return rectangle
}

function rect(x, y) {
    return [
        { x: -x, y: -y },
        { x: x, y: -y },
        { x: x, y: y },
        { x: -x, y: y }
    ]
}