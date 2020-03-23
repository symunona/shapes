/**
 * #44
 */

module.exports = function (d) {

    let square = d.poly(4, d.h / 3, { x: d.cx, y: d.cy })
    square.reverse()

    let g = d.append('g').attr('fill-rule', 'evenodd')
    
    var cx = d.cx, cy = d.cy, r = d.h / 3

    g.append('path')
        .attr('d',
            d.lineD(d.d3.curveLinearClosed)(square) +
            d.circlePath(cx, cy, r))
        .attr('class', d.mainc)

    d.save()
}