/**
 * #67
 *
 * DA Scratch
 *
 */
const random = require('random')
const seedrandom = require('seedrandom')
random.use(seedrandom('shapes1'))

module.exports = function (d) {

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')

    let chaos = []

    gridSize = 1;

    for (var i = 0; i < gridSize; i++) {
        chaos[i] = []
        for (var j = 0; j < gridSize; j++) {
            chaos[i][j] = linkEm4(i + 6);
        }
    }
    var o = 70

    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {

            g
                .append('path')
                .attr('class', d.mainc)
                .attr('d', d.lineD(d.d3.curveLinearClosed)(chaos[i][j]))
                .attr('transform', d.m(
                    grid(j, i, d.w, d.h, gridSize, gridSize, { x: o, y: o })
                ))
        }
    }

    d.save('seed #7')
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

    return chaos

}

function linkEm4(dotCount) {
    let vertical = linkEm2(dotCount);
    let horizontal = linkEm2(dotCount).map((p) => { return { x: p.y, y: p.x } });
    return scaleLine(vertical.concat(horizontal), 500)

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

function rect(x, y) {
    return [
        { x: -x, y: -y },
        { x: x, y: -y },
        { x: x, y: y },
        { x: -x, y: y }
    ]
}