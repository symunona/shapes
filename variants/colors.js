if (typeof module !== 'undefined') {
    module.exports.generateColors1 = generateColors1
    module.exports.generateCssFromColors = generateCssFromColors
}

function generateColors1() {

    let steps = 16;
    let step = 256 / steps;
    let colors = Array.apply(null, { length: steps }).map(Number.call, Number)
    colors = colors.map((c) => {
        let c16 = (step * c).toString(16)
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

    colorFillClasses += `\n.bgc { fill: ${colors[defaultBackgroundColorIndex]}, bacgkround-color: ${colors[defaultBackgroundColorIndex]} }`
    colorFillClasses += `\n.fore { fill: ${colors[defaultForeColorIndex]} }`

    return colorFillClasses;
}