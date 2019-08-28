if (typeof module !== 'undefined') {
    module.exports.generateDefaultColorGradient = generateDefaultColorGradient
    module.exports.generateColors1 = generateColors1
    module.exports.generateCssFromColors = generateCssFromColors
    module.exports.cssFromObject = cssFromObject
    module.exports.createStylePropertyObjectFromColors = createStylePropertyObjectFromColors
    module.exports.generateDefaultSvgStyle = generateDefaultSvgStyle
}

/**
 * Default style: create monochrome scale of 16 steps.
 **/
function generateDefaultColorGradient() {
    let steps = 16
    let step = 256 / steps
    let colors = Array.apply(null, { length: steps }).map(Number.call, Number)
    colors = colors.map((c) => {
        let c16 = (step * c).toString(16)
        return '#' + c16 + c16 + c16
    })
    return colors;
}

/**
 * Creates a style object from a color array that with and adjustable property.
 * @param {Array} colors 
 * @param {String} property 
 * @param {String} selector
 */
function createStylePropertyObjectFromColors(colors, property, selector){
    let style = {}
    for (let i = 0; i<colors.length; i++){
        let propObject = {}
        propObject[property] = colors[i]
        style[`${selector}-${i}`] = propObject;
    }
    return style;
}


function generateColorsInv() {

    let steps = 16;
    let step = 256 / steps;
    let colors = Array.apply(null, { length: steps }).map(Number.call, Number)
    colors = colors.map((c) => {
        let c16 = (step * (steps - c)).toString(16)
        return '#' + c16 + c16 + c16
    })
    colors[0] = '#000'
    colors[1] = '#fff'

    return colors;
}

function generateColors1() {

    let steps = 16;
    let step = 256 / steps;
    let colors = Array.apply(null, { length: steps }).map(Number.call, Number)
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

function generateCssFromColors(colors) {
    // f for fill
    let colorFillClasses = colors.map((color, level) => `.f-${level} { fill: ${color} }`).join('\n')
    let defaultBackgroundColorIndex = 1,
        defaultForeColorIndex = 4

    colorFillClasses += `\n.bgc { fill: ${colors[defaultBackgroundColorIndex]}; background-color: ${colors[defaultBackgroundColorIndex]} }`
    colorFillClasses += `\n.fore { fill: ${colors[defaultForeColorIndex]} }`

    return colorFillClasses;
}

function generateDefaultSvgStyle(colors) {
    let colorFillClassesObject = createStylePropertyObjectFromColors(colors, 'fill', '.f')
    colorFillClassesObject['.bgc'] = { 'fill': colors[1] }
    colorFillClassesObject['.fore'] = { 'fill': colors[4] }
    return colorFillClassesObject
}

function generateDefaultSiteColors(colors){
    let siteBackgroundCssObject = createStylePropertyObjectFromColors(colors, 'background-color', '.f')
    siteBackgroundCssObject['.bgc'] = { 'background-color': colors[1] }
    siteBackgroundCssObject['.fore'] = { 'background-color': colors[4] }
    return siteBackgroundCssObject
}

function cssFromObject(styleObject) {
    return Object.keys(styleObject).map((selector) => {
        let propertiesObject = styleObject[selector]
        let propertiesString = Object.keys(propertiesObject).map((property) => `${property}: ${propertiesObject[property]}`)
        return `${selector} { ${propertiesString} }`
    }).join('\n')
}