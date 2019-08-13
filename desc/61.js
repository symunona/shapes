/**
 * #61
 *
 * Scratches
 *
 */

const random = require('random')
const seedrandom = require('seedrandom')
random.use(seedrandom('shapes'))


module.exports = function (d) {

    let size = d.cy / 3

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')

    let chaos = linkEm2();

    // g
    //     .append('path')
    //     .attr('fill', d.c[5])
    //     // .attr('d', unit([], 0, { x: 1, y: 1, r: size }, d))
    //     .attr('transform', d.m({ x: d.cx, y: d.cy }))

    g
        .append('path')
        .attr('fill', d.c[4])
        .attr('d', d.lineD(d.d3.curveLinearClosed)(chaos))
        .attr('transform', d.m({ x: d.cx - (size / 2), y: d.cy - (size / 2) }))

    d.save('seed #1')
}

/**
 * link 0-1 in order
 */
function linkEm2() {

    let dotCount = 10

    let chaos = []
    let wall0 = createWall(dotCount).sort();
    let wall1 = createWall(dotCount).sort();

    for (let i = 0; i < dotCount; i += 2) {
        // -\
        chaos.push({
            x: wall0[i],
            y: 0
        })
        chaos.push({
            x: wall1[i],
            y: 1
        })
        // _
        chaos.push({
            x: wall1[i + 1],
            y: 1
        })
        // /
        chaos.push({
            x: wall0[i + 1],
            y: 0
        })
    }

    chaos = scaleLine(chaos, 100)

    return chaos

}

function scaleLine(line, scale) {
    return line.map((p) => { return { x: p.x * scale, y: p.y * scale } })
}

function createWall(dotCount) {
    let wall = []
    for (let i = 0; i < dotCount; i++) {
        wall.push(random.float())
    }
    return wall;
}


function unit(cs, r, size, d) {

    let rectangle = d.lineD(d.d3.curveLinearClosed)(rect(size.x * size.r / 2, size.y * size.r / 2))

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