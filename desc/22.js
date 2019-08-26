/**
 * #20
 */

module.exports = function (d) {

    let levels = 2
    let poly = frac(d, d.h / 1.5, { x: 0, y: 0 }, Math.PI/4, levels)

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')
        .attr('transform', d.m({ x: d.cx, y: d.cy }))

    g.append('path')
        .attr('d', poly)
        .attr('class', d.mainc)

    d.save('fractal #16')
}

let multi = 4

function frac(d, size, offset, angle, levelsToGo) {

    let poly = ''    
    if (levelsToGo > 0) {
        let r = size / multi *0.8
        for (let xs = 0; xs < multi; xs++) {
            for (let ys = 0; ys < multi; ys++) {
                
                let x = size / multi * (xs-(multi/2)+0.5),
                    y = size / multi * (ys-(multi/2)+0.5)
                poly += frac(d, r, {
                    x: offset.x + x,
                    y: offset.y + y,
                }, angle, levelsToGo - 1) + ' Z '        

            }
        }
        return poly
    }
    else {
        return d.lineD(d.d3.curveLinearClosed)(d.poly(4, size, offset, angle)) + ' Z '        
    }    
}