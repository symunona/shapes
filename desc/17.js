/**
 * #17
 */

module.exports = function (d) {

    let levels = 6

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')
        .attr('transform', d.m({ x: d.cx, y: d.cy }))

    for (let i = 0; i < levels; i++) {
        let poly = frac(d, d.h / 9, 5, { x: 0, y: 0 }, Math.PI, i)
        g.append('path')
            .attr('d', poly)
            .attr('fill', d.c[(levels*2) + 2 - (i*2)])
            .attr('stroke', 0)
            .attr('class', 'jsanim-17 step step-' + i)
            .attr('style', 'display: none;')
        g.select('.jsanim-17.step-3')
            .attr('style', 'display: block;')
        g.append('script')
    }

    d.save('fractal #11 anim #1')
}

function frac(d, size, sides, offset, angle, levelsToGo) {
    let poly = d.lineD(d.d3.curveLinearClosed)(d.poly(sides, size, offset, angle)) + 'Z '
    if (levelsToGo > 0) {
        let r = 0.9 * size //size / (sides-1)
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