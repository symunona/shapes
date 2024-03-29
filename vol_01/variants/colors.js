/**
 * A collection of helper functions to generate different color gradients for the images.
 *
 * "Style object" specification:
 * {
 *      'selector1' : {
 *          'attribute-1': value,
 *          'fill': value2,
 *          'background-color': value3,
 *          ...
 *      }
 *      '.selector2 div': { ... }
 * }
 */

(function (root, factory) {
    'use strict'
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(module);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root);
    }
}(typeof self !== 'undefined' ? self : this, function (object) {
    'use strict'
    if (!object) { object = window; }

    // Support module loading.
    let exp = {
        generateDefaultColorGradient: generateDefaultColorGradient,
        generateColors1: generateColors1,
        generateColorsVapor: generateColorsVapor,
        generateColorsInv: generateColorsInv,
        cssFromObject: cssFromObject,
        createStylePropertyObjectFromColors: createStylePropertyObjectFromColors,
        generateDefaultSvgStyle: generateDefaultSvgStyle,
        generateDefaultSiteColors: generateDefaultSiteColors,
        getColors: getColors,
        getSetCurrentColorPalette: getSetCurrentColorPalette,
        LS_COLOR_KEY: 'ls_color_key',
        LS_TEX_KEY: 'ls_tex_key'

    }
    Object.keys(exp).map((key)=>object[key] = exp[key]);
    return exp

    /**
     * Default style: create monochrome scale of 16 steps.
     * @returns {Array} of coors.
     **/
    function generateDefaultColorGradient () {
        let steps = 16
        let step = 256 / steps
        let colors = Array.apply(null, {length: steps}).map(Number.call, Number)
        colors = colors.map((c) => {
            let c16 = (step * c).toString(16)
            return '#' + c16 + c16 + c16
        })
        return colors;
    }

    /**
     * Creates a style object from a color array.
     * @param {Array} colors
     * @param {String} property
     * @param {String} selector
     * @returns {Object} style object
     */
    function createStylePropertyObjectFromColors (colors, property, selector) {
        let style = {}
        for (let i = 0; i < colors.length; i++) {
            let propObject = {}
            propObject[property] = colors[i]
            style[`${selector}-${i}`] = propObject;
        }
        return style;
    }

    /**
     * Generates inverse color gradient to default.
     * @returns {Array} of colors.
     */
    function generateColorsInv () {
        let steps = 16;
        let step = 256 / steps;
        let colors = Array.apply(null, {length: steps}).map(Number.call, Number)
        colors = colors.map((c) => {
            let c16 = (step * (steps - c)).toString(16)
            return '#' + c16 + c16 + c16
        })
        colors[0] = '#000'
        colors[1] = '#fff'

        return colors;
    }


    /**
     * Custom color mapping 1.
     * @returns {Array} of colors.
     */
    function generateColors1 () {
        let steps = 16;
        let step = 256 / steps;
        let colors = Array.apply(null, {length: steps}).map(Number.call, Number)
        colors = colors.map((c) => {
            let c8r = (step * c).toString(16)
            let c8g = (step * (colors.length - c - 1)).toString(16)
            let c8b = (step * c).toString(16)
            return '#' + c8r + c8g + c8b;
        })
        colors[0] = '#000'
        colors[1] = '#fff'
        colors[2] = '#55c'
        colors[3] = '#5cc'
        colors[4] = '#5c5'
        return colors;
    }


    /**
     * Waves.
     * @returns {Array} of colors.
     */
     function generateColorsVapor () {
        let steps = 16;
        let step = 256 / steps;
        let colors = Array.apply(null, {length: steps}).map(Number.call, Number)
        colors = colors.map((c) => {
            let c8b = Math.floor(step * (16 - (c/2) -1)).toString(16)
            let c8g = '00'
            let c8r = Math.floor((step * ((c / 3 * 2) + 3))).toString(16)
            return '#' + c8r + c8g + c8b
        })
        colors[1] = '#202'
        return colors;
    }


    /**
     * Creates the default style object extending it with .fore and .bgc selectors.
     * svg uses the fill attribute to give the paths color.
     * @param {Array} colors
     * @returns {Object} style object
     */
    function generateDefaultSvgStyle (colors) {
        let colorFillClassesObject = createStylePropertyObjectFromColors(colors, 'fill', '.f')
        colorFillClassesObject['.bgc'] = {'fill': colors[1]}
        colorFillClassesObject['.fore'] = {'fill': colors[4], 'stroke-color': colors[4], 'sroke-width': 0}
        return colorFillClassesObject
    }

    /**
     * Creates the default site classes .fore and .bgc selectors.
     * Html uses the background-color property for filling areas.
     * @param {Array} colors
     * @returns {Object} style object
     */
    function generateDefaultSiteColors (colors) {
        let siteBackgroundCssObject = createStylePropertyObjectFromColors(colors, 'background-color', '.f')
        siteBackgroundCssObject['.bgc'] = {'background-color': colors[1]}
        siteBackgroundCssObject['.fore'] = {'background-color': colors[4], 'stroke-color': colors[4], 'sroke-width': 0}
        return siteBackgroundCssObject
    }

    /**
     * Converts the style object to a CSS string.
     * @param {Object} styleObject
     * @returns {String} css string
     */
    function cssFromObject (styleObject) {
        return Object.keys(styleObject).map((selector) => {
            let propertiesObject = styleObject[selector]
            let propertiesString = Object.keys(propertiesObject).map((property) => `${property}: ${propertiesObject[property]}; `).join('')
            return `${selector} { ${propertiesString} }`
        }).join('\n')
    }

    function getSetCurrentColorPalette(n){
        if (n === undefined){
            var storedColor = localStorage.getItem(exp.LS_COLOR_KEY)
            if (storedColor !== undefined){
                n = parseInt(storedColor)
            }
        } else {
            localStorage.setItem(exp.LS_COLOR_KEY, n)
        }
        return n
    }

    function getColors(n){
        let colors
        switch(n){
            case 1:
                colors = generateColorsInv()
                break;
            case 2:
                colors = generateColors1();
                break;
            case 3:
            case 4:
                colors = generateColorsVapor()
                break
                default:
                    colors = generateDefaultColorGradient()
                break;
        }
        return colors
    }



}));

