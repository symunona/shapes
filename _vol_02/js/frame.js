/**
 * Every shape needs a frame, unify for the blame.
 */
define(['colors'], (colors)=>{
    'use strict'
    const format = {
        h: 640,
        w: 640
    }

    const palette = colors.generateDefaultColorGradient()
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
        info: info
    }

    function info (n, title) {
        document.getElementById('shape-info').textContent = '_shape #' + n + ' ' + title
    }
    return c
})
