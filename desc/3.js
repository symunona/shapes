/**
 * #3
 */

module.exports = function (d) {

    let triangle = d.poly(3, d.h / 3)
    triangle.reverse()

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')
        .attr('transform', d.m({ x: d.cx, y: d.cy }))

    let p = g.append('path')
        .attr('class', 'spin3 ' + d.mainc)
        .attr('d',
            d.lineD(d.d3.curveLinearClosed)(triangle) +
            d.circlePath(0, 0, d.h / 3))

    d.save('anim #2')
}