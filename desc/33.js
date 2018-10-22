/**
 * #33
 */

module.exports = function (d) {

    let r = d.h / 3
    let c = { x: d.cx, y: d.cy }

    let n = 13

    let sokszog = d.poly(n, r, c, Math.PI / 3)
    sokszog.reverse()
    let g = d.append('g').attr('fill-rule', 'evenodd')

    let cx = d.cx, cy = d.cy
    let center = { x: cx, y: cy }

    // pick one point
    // let a = -1 / 3 * Math.PI // -120deg
    let a = 0
    // let da = 2 / 3 * Math.PI
    // let ref = { x: cx + (Math.sin(a) * r), y: cy + (Math.cos(a) * r) }

    let groups = []

    var da = 2 * Math.PI / n
    let aad = da / 4

    for (let i = 0; i < n; i ++) {
        let aa = a + (da*i)
        let edge1 = { x: cx + (Math.sin(aa + aad) * r), y: cy + (Math.cos(aa + aad) * r) }
        let edge2 = { x: cx + (Math.sin(aa - aad) * r), y: cy + (Math.cos(aa - aad) * r) }
        let points = []
        points.push(edge1)
        points.push(edge2)
        points.push(d.linear(edge2, center, 0.5))
        points.push(d.linear(edge1, center, 0.5))
        groups.push(points)
    }


    g.selectAll('path.chevron').data(groups).enter().append('path')
        .attr('d',(g)=>d.lineD(d.d3.curveLinearClosed)(g))
        .attr('class','chevron')
        .attr('fill', d.c[3])

    d.save()
}