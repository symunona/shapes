/**
 * #84
 * New fill style gradient twist
 */
module.exports = function (d) {

    let gridX = 8; gridY = 8;
    let sizeX = d.w / (gridX + 2), sizeY = d.h / (gridY + 2)

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')

    const margin = 0.1

    for (let xs = 0; xs < gridX; xs++) {
        for (let ys = 0; ys < gridY; ys++) {
            g
                .append('path')
                .attr('d', unit({ x: sizeX / 2 + margin, y: sizeY / 2 + margin }, d))
                .attr('transform', d.m({ x: sizeX * (xs + 1.5), y: sizeY * (ys + 1.5) }))
                .attr('fill', `url(#stripes-5-${xs}-${ys})`)
        }
    }

    for (let xs = 0; xs < gridX; xs++) {
        for (let ys = 0; ys < gridY; ys++) {
            makePattern(d.defs, xs, ys, gridX, gridY, d)
        }
    }

    d.save('gradient #5')
}

function makePattern(defs, gx, gy, xMax, yMax, d) {
    let pattern = defs.append('pattern')
        .attr('id', `stripes-5-${gx}-${gy}`)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 8)
        .attr('height', 8)

    let l = 5
    let starts = [{x: 4, y: 4}]
    let angle = Math.PI / 2 / (xMax-1) * gx
    starts.map((s)=>{
        let points = [
            { x: s.x - (Math.sin(angle) * l), y: s.y - (Math.cos(angle) * l) },
            { x: s.x + (Math.sin(angle) * l), y: s.y + (Math.cos(angle) * l) }
        ]
        pattern
            .append('path')
            .attr('d', // 'M-1,1 l2,-20 M0,40 l4,-40 M3,5 l2,-2') //
                d.lineD(d.d3.curveLinear)(points))
            .attr('style', 'line-cap: butt; stroke: #333; stroke-width: ' + (gy * (3 / yMax)))
            .attr('class', 'fore')
    })
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