/**
 * #19
 */

module.exports = function (d) {

    let levels = 3
    let poly = frac(d, d.h / 3, { x: 0, y: 0 }, Math.PI/2, levels)

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')
        .attr('transform', d.m({ x: d.cx, y: d.cy }))

    g.append('path')
        .attr('d', poly)
        .attr('fill', d.c[3])

    d.save('fractal #13')
}

let multi = 2

function frac(d, size, offset, angle, levelsToGo) {

    let poly = d.lineD(d.d3.curveLinearClosed)(d.poly(4, size, offset, angle)) + ' '
    if (levelsToGo > 0) {
        let r = size / multi / 2
        for (let xs = 0; xs < multi; xs++) {
            for (let ys = 0; ys < multi; ys++) {
                
                let x = size / multi * (xs-(multi/2)+0.5),
                    y = size / multi * (ys-(multi/2)+0.5)
                poly += frac(d, r, {
                    x: offset.x + x,
                    y: offset.y + y,
                }, angle + Math.PI/4, levelsToGo - 1) + ' '        

            }
        }
        


    }
    return poly
}