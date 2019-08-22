module.exports = function(dr){

    let steps = 16;
    let step = 256 / steps;
    let colors = Array.apply(null, { length: steps }).map(Number.call, Number)
    colors = colors.map((c) => {
        let c16 = (step * c).toString(16)
        let c8r = (step * c).toString(16)
        let c8g = (step * (colors.length - c -1)).toString(16)
        let c8b = (step * c).toString(16)
        return '#' + c8r + c8g + c8b;
    })
    colors[0] = '#000'
    colors[1] = '#fff'
    colors[2] = '#55c'
    colors[3] = '#5cc'
    colors[4] = '#5c5'
    dr.colors = colors;
    dr.c = colors;
    return dr
}