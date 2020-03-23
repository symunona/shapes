/**
 * #69
 *
 * Round Scratch 
 *
 */
const random = require('random')
const seedrandom = require('seedrandom')
random.use(seedrandom('shapes'))

module.exports = function (d) {

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')

    let chaos = []

    gridSize = 1;

    for (var i = 0; i < gridSize; i++) {
        chaos[i] = []
        for (var j = 0; j < gridSize; j++) {
            chaos[i][j] = linkEm2(i + 46);
        }
    }
    var o = d.cy/2 + 160

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

    d.save('seed #9')
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

    for (let i = 0; i < dotCount; i += 1) {
        chaos.push(circleNormal(wall0[i]))
    }

    chaos = scaleLine(chaos, 270)

    return chaos
}

function circleNormal(n){
    return {
        x: Math.sin(n*2*Math.PI),
        y: Math.cos(n*2*Math.PI),
    }
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