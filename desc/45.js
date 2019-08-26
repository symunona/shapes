/**
 * #45
 */

module.exports = function (d) {

    let square = d.poly(4, d.h / 3, { x: d.cx, y: d.cy }, Math.PI/4)
    square.reverse()

    let g = d.append('g').attr('fill-rule', 'evenodd')
    
    g.append('path')
        .attr('d',
            d.lineD(d.d3.curveLinearClosed)(square))
        .attr('class', d.mainc)

    d.save()
}