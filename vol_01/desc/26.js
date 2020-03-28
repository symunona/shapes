/**
 * #24
 */

module.exports = function (d) {

    let r = d.h / 3
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

    let points2 = []
    // rotate
    let t = from
    from = to
    to = ref
    ref = t

    let move = {x: d.h / 6, y: d.h/6}
    from = d.add(from, move)
    to = d.add(to, move)
    ref = d.add(ref, move)

    for (let i = 0; i < n; i += 2) {
        points2.push(d.linear(from, to, i / n))
        points2.push(d.linear(from, to, (i + 1) / n))
        points2.push(ref)
    }

    g.append('path')
    .attr('d',
        // d.lineD(d.d3.curveLinearClosed)(triangle) + 
        d.lineD(d.d3.curveLinearClosed)(points) + ' Z ' +
        d.lineD(d.d3.curveLinearClosed)(points2))
    .attr('class', d.mainc)

    d.save()
}