/**
 * #1
 */

module.exports = function (d) {

    let triangle = d.poly(3, d.h / 3, { x: d.cx, y: d.cy })
    triangle.reverse()

    let g = d.append('g').attr('fill-rule', 'evenodd')
    
    var cx = d.cx, cy = d.cy, r = d.h / 3

    g.append('path')
        .attr('d',
            d.lineD(d.d3.curveLinearClosed)(triangle) +
            ` M ${cx - r}, ${cy} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`)
        .attr('fill', d.c[3])

    d.save()
}