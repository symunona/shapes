/**
 * #9
 */

module.exports = function (d) {

    let levels = 10
    let poly = frac(d, d.h/3, 3, {}, levels)

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')
        .attr('transform', d.m({ x: d.cx, y: d.cy }))

    g.append('path')        
        .attr('d',
            d.lineD(d.d3.curveLinearClosed)(poly))
        .attr('fill', d.c[3])

    d.save('_shape #4 fractal #1')
}

function frac(d, size, sides, offset, levelsToGo){
    let poly = d.poly(sides, size)
    if (levelsToGo > 0){
        poly = poly.concat(frac(d, size/sides*(sides-1), sides, offset, levelsToGo-1))        
    }
    return poly
}