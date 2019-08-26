/**
 * #48
 */

module.exports = function (d) {

    let r = d.h / 3
    let o = r * Math.sqrt(3)
    let square = d.poly(3, r, { x: d.cx, y: d.cy }, Math.PI / 3)
    let ref = { x: square[1].x - o / 2, y: square[1].y }
    square.reverse()

    let g = d.append('g').attr('fill-rule', 'evenodd')


    let steps = 23
    let n = 3
    let simpleCubicCurve = []
    let normalizer = o / Math.pow(steps, n)

    let h = 1.05

    let ny = Math.pow(steps, n) * normalizer - (3 / 2 * r)

    for (let i = 0; i < steps; i++) {
        let y = Math.pow(i, n) * normalizer

        simpleCubicCurve.push(d.add(ref, { x: 0, y: y - ny }))
        simpleCubicCurve.push(d.add(ref, { x: o, y: y - ny }))
        simpleCubicCurve.push(d.add(ref, { x: o, y: y * h - ny }))
        simpleCubicCurve.push(d.add(ref, { x: 0, y: y * h - ny }))
    }

    g.append('path')
        .attr('d',
            d.lineD(d.d3.curveLinearClosed)(square)
        )
        .attr('class', d.mainc)

    g.append('path')
        .attr('d', d.lineD(d.d3.curveLinear)(simpleCubicCurve))
        .attr('class', d.bgc)

    d.save()
}