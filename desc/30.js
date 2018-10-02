/**
 * #30
 */

module.exports = function (d) {

    d.defs
        .append('filter')
        .attrs({
            id: 'fractal',
            filterUnits: 'objectBoundingBox',
            x: '0%',
            y: '0%',
            width: '100%',
            height: '100%',
        })
        .append('feTurbulence')
        .attrs({
            type: 'turbulence',
            baseFrequency: '0.05',
            numOctaves: '8'
        })

    d.base.attr('fill', 'none')

    d.append('circle')
        .attrs({
            cx: d.cx,
            cy: d.cy,
            r: d.h / 3,
            width: d.h / 3,
            height: d.w / 3,
            filter: 'url(#fractal)'
        })

    // let n = 3    
    // let r = d.h / 5
    // for (let i = 0; i < n; i++) {
    //     let a = (Math.PI * 2 / 3 * i)
    //     let triangle = d.poly(3, r, null, a)
    //     let offset = d.radOffset(a, r/3*2)
    //     offset = d.add(offset, d.center)
    //     triangle.reverse()

    //     let g = d.append('g')
    //         // .attr('fill-rule', 'evenodd')
    //         .attr('transform', d.m({ x: offset.x, y: offset.y }))

    //     g.append('path')
    //         .attr('class', 'spin29')
    //         .attr('d',
    //             d.lineD(d.d3.curveLinearClosed)(triangle))
    //         // .attr('fill', rgbat(i))
    //         .attr('filter', 'url(#fractal)')

    // }

    d.save('filter #1')
}

function rgbat(n, v, a) {
    cols = [0, 0, 0, a || 0.6]
    cols[n] = v || 255;
    cols = cols.join(', ')
    return `rgba(${cols})`
}
