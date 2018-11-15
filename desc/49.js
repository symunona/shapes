/**
 * #49
 */

module.exports = function (d) {

    let r = d.h / 3
    let o = r * Math.SQRT2
    let square = d.poly(4, r, { x: d.cx, y: d.cy }, Math.PI / 4)
    let ref = square[2]
    square.reverse()

    let g = d.append('g').attr('fill-rule', 'evenodd')


    let steps = 12
    let n = 4
    let simpleCubicCurve = []
    let normalizer = o / Math.pow(steps, n)
    let h = 1.04

    for (let i = 0; i < steps; i++) {        
        let y = Math.pow(i, n) * normalizer
        
        simpleCubicCurve.push(d.add(ref, { x: 0, y: y }))
        simpleCubicCurve.push(d.add(ref, { x: o, y: y }))
        simpleCubicCurve.push(d.add(ref, { x: o, y: y * h }))
        simpleCubicCurve.push(d.add(ref, { x: 0, y: y * h }))
    }

    g.append('path')
    .attr('d',
        d.lineD(d.d3.curveLinearClosed)(square) + 
        d.lineD(d.d3.curveLinear)(simpleCubicCurve)
        ) 
    .attr('fill', d.c[3])

    d.save()
}