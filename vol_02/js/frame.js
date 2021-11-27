/**
 * Every shape needs a frame, unify for the blame.
 */
define(['colors'], (colors) => {
    'use strict'
    const format = {
        h: 640,
        w: 640
    }

    let palette = colors.getColors(getSetCurrentColorPalette())

    const DEFAULT_COLOR_INDEX = 4
    const DEFAULT_BACKGROUND_COLOR_INDEX = 1

    let c = window._c = {
        x: format.w,
        y: format.h,
        h: format.h,
        w: format.w,
        cx: format.w / 2,
        cy: format.h / 2,
        c: { // colors
            p: palette,
            f: palette[DEFAULT_COLOR_INDEX],
            b: palette[DEFAULT_BACKGROUND_COLOR_INDEX]
        },
        poly: polygon,
        info,
        radPos,
        pickRandom,
        colorUtils: colors,
        DEFAULT_COLOR_INDEX,
        DEFAULT_BACKGROUND_COLOR_INDEX
    }

    function radPos (angle, r) {
        return {
            x: Math.cos(angle) * r,
            y: Math.sin(angle) * r
        }
    }

    function pickRandom (array) {
        return array[Math.floor(Math.random() * array.length)]
    }

    function info (n, title) {
        document.getElementById('shape-info').textContent = '_shape #' + n + ' ' + title
    }

    function polygon (p, x, y, radius, n) {
        let angle = p.TWO_PI / n;
        p.beginShape()
        // Always draw a dot.
        p.vertex(x + radius, y);
        for (let a = angle; a < p.TWO_PI; a += angle) {
            let sx = x + p.cos(a) * radius
            let sy = y + p.sin(a) * radius
            p.vertex(sx, sy);
        }
        p.endShape(p.CLOSE);
    }

    return c
})
