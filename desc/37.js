/**
 * #37
 */

module.exports = function (d) {

    let r = d.h / 8
    let c = { x: d.cx, y: d.cy }

    let n = 17

    let sokszog = d.poly(n, r, c, Math.PI / 3)
    sokszog.reverse()
    let g = d.append('g').attr('fill-rule', 'evenodd')

    let cx = d.cx, cy = d.cy
    let center = { x: cx, y: cy }

    // pick one point
    // let a = -1 / 3 * Math.PI // -120deg
    let a = Math.PI * 2 / n
    // let da = 2 / 3 * Math.PI
    // let ref = { x: cx + (Math.sin(a) * r), y: cy + (Math.cos(a) * r) }

    let groups = []

    let scale = 1
    let length = 0.1
    let da = 2 * Math.PI / n
    let aad = da / 4
    let rounds = 3

    for (let i = 0; i < n * rounds; i++) {
        let aa = a + (da * i)
        let edge1 = { x: cx + (Math.sin(aa + aad) * r), y: cy + (Math.cos(aa + aad) * r) }
        let edge2 = { x: cx + (Math.sin(aa - aad) * r), y: cy + (Math.cos(aa - aad) * r) }
        let points = []

        let r1 = scale / (n + 2) * (n - i - (i * length))
        let r2 = scale / (n + 2) * (n - i + (i * length))

        points.push(d.linear(edge1, center, r1))
        points.push(d.linear(edge2, center, r1))
        points.push(d.linear(edge2, center, r2))
        points.push(d.linear(edge1, center, r2))
        groups.push(points)
    }


    g.selectAll('path.chevron').data(groups).enter().append('path')
        .attr('d', (g) => d.lineD()(g))
        .attr('class', 'chevron')
        .attr('fill', d.c[3])

    d.save()
}