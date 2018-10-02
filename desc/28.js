/**
 * #28
 */

module.exports = function (d) {

    let n = 3    
    let r = d.h / 5
    for (let i = 0; i < n; i++) {
        let a = Math.PI * 2 / 3 * i        
        let triangle = d.poly(3, r, null, a)
        let offset = d.radOffset(a, r)
        offset = d.add(offset, d.center)
        triangle.reverse()

        let g = d.append('g')
            // .attr('fill-rule', 'evenodd')
            .attr('transform', d.m({ x: offset.x, y: offset.y }))

        g.append('path')
            .attr('class', 'spin28')
            .attr('d',
                d.lineD(d.d3.curveLinearClosed)(triangle))
            .attr('fill', rgbat(i))
         
    }

    d.save()
}

function rgbat(n, v, a){    
    cols = [0, 0, 0, a || 0.5]
    cols[n] = v || 255;
    cols = cols.join(', ')
    return `rgba(${cols})`
}
