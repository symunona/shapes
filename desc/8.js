/**
 * #8
 */

module.exports = function (d) {

    let penta = d.poly(5, d.h / 3, null, Math.PI/3)

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')
        .attr('transform', d.m({ x: d.cx, y: d.cy }))

    let p = g.append('path')
        .attr('d',
            d.lineD(d.d3.curveLinearClosed)(penta))
        .attr('class', d.mainc)

    g.append('path')
        .attr('class', 'tri-rotate-8 ' + d.bgc)
        .attr('d',
            d.lineD(d.d3.curveLinearClosed)(penta))

    d.save('anim #1')
}