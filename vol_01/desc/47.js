/**
 * #47
 */

module.exports = function (d) {

    let r = d.h / 3
    let o = r * Math.sqrt(3)
    let square = d.poly(3, r, { x: d.cx, y: d.cy }, Math.PI / 3)
    let ref = { x: square[1].x - o / 2, y: square[1].y }
    square.reverse()

    let g = d.append('g').attr('fill-rule', 'evenodd')


    let steps = 12
    let simpleCubicCurve = []
    let normalizer = o / steps / steps
    let h = 1.04

    for (let i = 0; i < steps-1; i++) {
        let y = i * i * normalizer

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
        .attr('class', d.mainc)

    d.save()
}