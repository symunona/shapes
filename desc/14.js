/**
 * #14
 */

module.exports = function (d) {

    let levels = 5
    let poly = frac(d, d.h / 3, 3, { x: 0, y: 0 }, Math.PI, levels)

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')
        .attr('transform', d.m({ x: d.cx, y: d.cy }))

    g.append('path')
        .attr('d', poly)
        .attr('class', d.mainc)

    d.save('fractal #7')
}

function frac(d, size, sides, offset, angle, levelsToGo) {
    let poly = d.lineD(d.d3.curveLinearClosed)(d.poly(sides, size, offset, angle)) + 'Z '
    if (levelsToGo > 0) {
        let r = size / (sides-1)
        for (let i = 0; i < sides; i++) {
            let a = (Math.PI * 2 / sides) * i
            poly += frac(d, r, sides, {
                x: offset.x + Math.sin(a) * r,
                y: offset.y + Math.cos(a) * r,
            }, a + Math.PI, levelsToGo - 1) + ' '
        }

    }
    return poly
}