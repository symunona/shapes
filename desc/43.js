/**
 * #43
 */

module.exports = function (d) {

    let r = d.h / 3
    let o = r * Math.sqrt(3) / 2
    let c = { x: d.cx, y: d.cy }

    let triangle = d.poly(3, r, c, Math.PI / 3)
    triangle.reverse()
    let g = d.append('g').attr('fill-rule', 'evenodd')

    let cx = d.cx, cy = d.cy

    let n = 13

    // pick one point
    let a = -1 / 3 * Math.PI // -120deg
    let da = 2 / 3 * Math.PI
    let ref = { x: cx + (Math.sin(a) * r), y: cy + (Math.cos(a) * r) }

    let from = { x: cx + (Math.sin(a + da) * r), y: cy + (Math.cos(a + da) * r) }
    let to = { x: cx + (Math.sin(a - da) * r), y: cy + (Math.cos(a - da) * r) }

    let points = [ref]

    for (let i = 0; i < n; i += 2) {
        points.push(d.linear(from, to, i / n))
        points.push(d.linear(from, to, (i + 1) / n))
        points.push(ref)

    }

    let error = 2

    let overlay = [
        d.add(ref, { x: -error, y: error }),
        d.add(ref, { x: o / 2, y: -3 / 4 * r - error }),
        d.add(ref, { x: o + error, y: error })
    ]

    let small = [
        ref,
        d.add(ref, { x: o / 4, y: -3 / 8 * r }),
        d.add(ref, { x: o / 2, y: 0 })
    ]

    g.append('path')
        .attr('d',
            // d.lineD(d.d3.curveLinearClosed)(triangle) + 
            d.lineD(d.d3.curveLinearClosed)(points))
        .attr('fill', d.c[3])

    g.append('path')
        .attr('d',
            // d.lineD(d.d3.curveLinearClosed)(triangle) + 
            d.lineD(d.d3.curveLinearClosed)(overlay))
        .attr('fill', d.bg)

    g.append('path')
        .attr('d',
            // d.lineD(d.d3.curveLinearClosed)(triangle) + 
            d.lineD(d.d3.curveLinearClosed)(small))
        .attr('fill', d.c[3])


    d.save()
}