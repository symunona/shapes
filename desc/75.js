/**
 * #75
 * Moving Fractals
 */

module.exports = function (d) {

    let g = d.append('g')
        .attr('class', 'wrapper')

    let ratio = 4

    fractal(6, 5, Math.PI/5, g, { x: d.cx, y: d.cy }, d.w / 5)

    d.save('cifra')

    function fractal(lvl, repeats, phase, parent, center, r) {
        if (lvl <= 0) return;

        let node = parent.append('g')
        parent.append('circle')
        .attrs({
            cx: center.x,
            cy: center.y,
            r: r,
            'class': 'f-' + lvl
        })

        for (let i = 0; i < repeats; i++) {
            let cpos = d.radOffset((Math.PI * 2 / repeats * i) + phase, r * (ratio + 2) / ratio)
            let thisCenter = { x: center.x + cpos.x, y: center.y + cpos.y }
            fractal(lvl - 1, repeats, phase, node, thisCenter, r / ratio)

        }
    }

}

