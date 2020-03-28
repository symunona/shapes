/**
 * #80
 *
 * Vasarely 3
 */

const random = require('random')
const seedrandom = require('seedrandom')
random.use(seedrandom('vasarel'))

module.exports = function (d) {

    let gridX = 5; gridY = 4;
    let sizeX = d.w / (gridX + 2), sizeY = d.h / (gridY + 2)

    let g = d.append('g')
        .attr('id', 'shape-77')
        .attr('fill-rule', 'evenodd')
        .attr('gridX', gridX)
        .attr('gridY', gridY)

    let r = sizeX / Math.sqrt(2), m = r / Math.sqrt(2), a = r / 3

    for (let xs = 0; xs < gridX; xs++) {
        for (let ys = 0; ys < gridY; ys++) {
            let color1 = rcolor();
            let color2 = rcolor();
            let color3 = rcolor();

            g
                .append('path')
                .attr('d', d.lineD(d.d3.curveLinearClosed)(tile1(r, m, a)))
                .attr('transform', d.m({ x: sizeX * (xs + 1.5), y: sizeY * (ys + 1.5) }))
                .attr('class', 'sq-' + xs + '-' + ys + ' f-' + color1)

            g
                .append('path')
                .attr('d', d.lineD(d.d3.curveLinearClosed)(tile2(r, m, a)))
                .attr('transform', d.m({ x: sizeX * (xs + 1.5), y: sizeY * (ys + 1.5) }))
                .attr('class', 'sq-' + xs + '-' + ys + ' f-' + color2)

            g
                .append('path')
                .attr('d', d.lineD(d.d3.curveLinearClosed)(tile3(r, m, a)))
                .attr('transform', d.m({ x: sizeX * (xs + 1.5), y: sizeY * (ys + 1.5) }))
                .attr('class', 'sq-' + xs + '-' + ys + ' f-' + color3)

        }
    }
    d.save('vasarely')
}


function rcolor(){
    return random.int(2, 8);
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

