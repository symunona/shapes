/**
 * #4
 */

module.exports = function (d) {

    let triangle = d.poly(3, d.h / 3, null, Math.PI/3)
    triangle.reverse()

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')
        .attr('transform', d.m({ x: d.cx, y: d.cy }))

    let p = g.append('path')
        .attr('d',
            d.lineD(d.d3.curveLinearClosed)(triangle))
        .attr('class', d.mainc)

    g.append('path')
        .attr('d',
            d.lineD(d.d3.curveLinearClosed)(triangle))
        .attr('class', d.bgc)
        .attr('transform', 'rotate(60, 0 0)')


    d.save()
}