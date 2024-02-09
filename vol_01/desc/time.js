module.exports.time = function(d, gridSizeX, gridSizeY, offset){
    let g = d.append('g')

    const units = []
    const weights = []

    const all = gridSizeX * gridSizeY

    for (let y = 0; y < gridSizeY; y++) {
        units[y] = []
        weights[y] = []
        for (let x = 0; x < gridSizeX; x++) {
            const n = (y * gridSizeX) + x
            units[y][x] = n / all
            weights[y][x] = typeof(offset) === 'function' ? offset(n) :
                Math.round(((Math.cos((2 * Math.PI / all) * n + offset) / 2) + 0.5) * 11) + 4
        }
    }

    const stepX = d.w / (gridSizeX + 1)
    const stepY = d.h / (gridSizeY + 1)

    const r = d.w / (Math.max(gridSizeX, gridSizeY) * 3)

    for (let y = 0; y < gridSizeY; y++) {
        for (let x = 0; x < gridSizeX; x++) {

            const val = units[y][x] * 2 * Math.PI

            const arc = d.d3.arc()
                .innerRadius(0)
                .outerRadius(r)
                .startAngle(0)
                .endAngle(val)

            const tx = stepX * (x+1)
            const ty = stepY * (y+1)

            const color = weights[y][x]

            c = g.append('g')
                    .attr('transform', `translate(${tx}, ${ty})`)

            c.append('circle')
                .attr('r', r * 0.6666)
                .attr('class', `f-${color}`)

            c.append('path')
                .attr('d', arc)
                .attr('class', `f-${color-2}`)
                .attr('style', 'opacity: 0.9')
        }
    }
}
