/**
 * #41
 */

module.exports = function (d) {

    let levels = 50
    let poly = frac(d, d.h / 3, 5, null, levels, Math.PI/5)

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')
        .attr('transform', d.m({ x: d.cx, y: d.cy }))

    g.append('path')
        .attr('d',
            d.lineD(d.d3.curveLinear)(poly))
        .attr('fill', d.c[3])

    d.save('')
}

function frac(d, size, sides, offset, levelsToGo, angleOffset) {
    let da = Math.PI * 2 / sides
    let ret = []
    let dr = size / levelsToGo / sides*2
    let n = levelsToGo * sides / 2

    angleOffset = angleOffset || 0
    if (!offset) offset = { x: 0, y: 0 }
    for (let i = 0; i < n; i++) ret.push({
        x: (Math.sin(da * i + angleOffset) * (size - (dr * i))) + offset.x,
        y: (Math.cos(da * i + angleOffset) * (size - (dr * i))) + offset.y
    })
    for (let i = 0; i < n; i++) ret.push({
        x: (Math.sin(-da * i + angleOffset) * ((dr * (i+1)))) + offset.x,
        y: (Math.cos(-da * i + angleOffset) * ((dr * (i+1)))) + offset.y
    })
    
    return ret
}