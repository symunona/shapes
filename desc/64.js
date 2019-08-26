/**
 * #64
 *
 * Multiple Scratches 4
 *
 */
const random = require('random')
const seedrandom = require('seedrandom')
random.use(seedrandom('shapes'))

module.exports = function (d) {

    let size = d.cy / 4

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')


    let chaos = []

    gridSize = 5;

    for (var i = 0; i < gridSize; i++) {
        chaos[i] = []
        for (var j = 0; j < gridSize; j++) {
            chaos[i][j] = linkEm2(i + 4);

        }
    }

    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {

            g
                .append('path')
                .attr('class', d.mainc)
                .attr('d', d.lineD(d.d3.curveLinearClosed)(chaos[i][j]))
                .attr('transform', d.m(
                    grid(j, i, d.w, d.h, gridSize, gridSize, { x: 10, y: 10 })
                ))
        }
    }

    d.save('seed #4')
}

function grid(x, y, w, h, wc, hc, o) {
    return {
        x: o.x + (w / wc * x),
        y: o.y + (h / hc * y)
    }
}



/**
 * link 0-1 in order
 */
function linkEm2(dotCount) {

    dotCount = dotCount || 5

    let chaos = []
    let wall0 = createWall(dotCount);
    let wall1 = createWall(dotCount);

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