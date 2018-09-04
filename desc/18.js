/**
 * #18
 */

module.exports = function (d) {

    let levels = 35    
    let poly = frac(d, d.h / 3, { x: 0, y: 0 }, Math.PI/2, levels)

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')
        .attr('transform', d.m({ x: d.cx, y: d.cy }))

    g.append('path')
        .attr('d', poly)
        .attr('fill', d.c[3])

    d.save('fractal #12')
}

function frac(d, size, offset, angle, levelsToGo) {
    let poly = d.circlePath(offset.x, offset.y, size) + 'Z '
    if (levelsToGo > 0) {
        let r = size * 0.9
        
        poly += frac(d, r, {
            x: offset.x + Math.sin(angle) * (size-r),
            y: offset.y + Math.cos(angle) * (size-r),
        }, angle, levelsToGo - 1) + ' '
    

    }
    return poly
}