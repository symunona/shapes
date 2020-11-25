/**
 * #83
 * New fill style gradient refinery 2
 */
module.exports = function (d) {

    let gridX = 8; gridY = 8;
    let sizeX = d.w / (gridX + 2), sizeY = d.h / (gridY + 2)

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')

    const margin = 0.1

    for (let xs = 0; xs < gridX; xs++) {
        for (let ys = 0; ys < gridY; ys++) {
            let tex = (xs + (ys * gridX));
            g
                .append('path')
                .attr('d', unit({ x: sizeX / 2 + margin, y: sizeY / 2 + margin }, d))
                .attr('transform', d.m({ x: sizeX * (xs + 1.5), y: sizeY * (ys + 1.5) }))
                .attr('fill', 'url(#stripes-4-' + tex + ')')
        }
    }

    for (let i = 0; i < gridX * gridY; i++) {
        makePattern(d.defs, i, gridX * gridY + 1, d)
    }

    d.save('gradient #4')
}

function makePattern(defs, n, all, d) {
    let pattern = defs.append('pattern')
        .attr('id', 'stripes-4-' + n)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 8)
        .attr('height', 8)

    let v = {a: 12, b: 12}
    let starts = [{x: -4, y: 0}, {x: 0, y: -4}]
    starts.map((s)=>pattern
    .append('path')
    .attr('d', // 'M-1,1 l2,-20 M0,40 l4,-40 M3,5 l2,-2') //
        d.lineD(d.d3.curveLinear)([
        {x: s.x, y: s.y},
        {x: s.x + v.a, y: s.y + v.b}
    ]))
    .attr('style', 'line-cap: butt; stroke: #333; stroke-width: ' + ((n + 1) * (3 / all)))
    .attr('class', 'fore'))
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