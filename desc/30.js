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

    // d.base.attr('fill', 'black')

    d.append('circle')
        .attrs({
            cx: d.cx,
            cy: d.cy,
            r: d.h / 3,
            width: d.h / 3,
            height: d.w / 3,
            filter: 'url(#fractal)'
        })

    d.save('filter #1')
}

function rgbat(n, v, a) {
    cols = [0, 0, 0, a || 0.6]
    cols[n] = v || 255;
    cols = cols.join(', ')
    return `rgba(${cols})`
}
