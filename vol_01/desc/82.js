/**
 * #82
 * New fill style gradient refinery
 */
module.exports = function (d) {

    let gridX = 8; gridY = 8;
    let sizeX = d.w / (gridX + 2), sizeY = d.h / (gridY + 2)

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')

    const margin = 0.1

    for (let xs = 0; xs < gridX; xs++) {
        for (let ys = 0; ys < gridY; ys++) {
            let tex = (xs + ys);
            g
                .append('path')
                .attr('d', unit({ x: sizeX / 2 + margin, y: sizeY / 2 + margin }, d))
                .attr('transform', d.m({ x: sizeX * (xs + 1.5), y: sizeY * (ys + 1.5) }))
                .attr('fill', 'url(#stripes' + tex + ')')
        }
    }

    for (let i = 0; i < gridX * gridY; i++) {
        makePattern(d.defs, i, gridX * 2 - 1, d)
    }

    d.save('gradient #3')
}

function makePattern(defs, n, all, d) {
    let pattern = defs.append('pattern')
        .attr('id', 'stripes' + n)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 4)
        .attr('height', 4)

    let v = {a: 6, b: 6}
    let starts = [{x: -2, y: 0}, {x: 0, y: -2}]
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