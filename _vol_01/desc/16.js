/**
 * #16
 */

module.exports = function (d) {

    let levels = 8    
    let poly = frac(d, d.h / 3, { x: 0, y: 0 }, Math.PI/2, levels)

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')
        .attr('transform', d.m({ x: d.cx, y: d.cy }))

    g.append('path')
        .attr('d', poly)
        .attr('class', d.mainc)

    d.save('fractal #10')
}

function frac(d, size, offset, angle, levelsToGo) {
    let poly = d.circlePath(offset.x, offset.y, size) + 'Z '
    if (levelsToGo > 0) {
        let r = size / 2
        
        poly += frac(d, r, {
            x: offset.x + Math.sin(angle) * r,
            y: offset.y + Math.cos(angle) * r,
        }, angle, levelsToGo - 1) + ' '
    

    }
    return poly
}