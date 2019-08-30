/**
 * #74
 * Waves
 */

module.exports = function (d) {

    let gridY = 8;
    let sizeY = d.h / gridY

    let rep = 4
    let amp = d.h / rep / 4
    let freq = d.w / rep

    let g = d.append('g')
        .attr('mask', 'url(#circlemask)')

    let g2 = g.append('g')
        .attr('class', 'wave-container')

    for (let ys = 0; ys < gridY; ys++) {
        g2
            .append('path')
            .attr('d', wave(amp, freq, rep + 4, d))
            .attr('transform', d.m({
                x: 0,
                y: (sizeY * (ys + 0.5))
            }))
            .attr('class', 'f-' + (ys + 3))
    }
    let mask = d.append('mask')
        .attr('id', 'circlemask')
    mask.append('path')
        .attr('d', d.lineD(d.d3.curveLinear)(d.rect(d.cx, d.cy)))
        .attr('transform', d.m({
            x: d.cx,
            y: d.cy }))
        .attr('fill', 'black')
    mask.append('circle')
        .attr('cx', d.cx)
        .attr('cy', d.cy)
        .attr('r', d.h / 10 * 4)
        .attr('fill', 'white')

    d.save('waves')
}

function wave(amp, freq, rep, d) {
    let thisWave = wavePoints(amp, freq, rep)

    let closer = []
    closer.push({ x: (rep + 1) * freq, y: amp * 2 })
    closer.push({ x: 0, y: amp * 2 })

    return d.lineD(d.d3.curveCardinal)(thisWave) + ' L' + d.lineD(d.d3.curveLinear)(closer).substr(1)
}

function wavePoints(amp, freq, rep) {
    let points = []
    for (let i = 0; i < (rep * 2) + 1; i++) {
        points.push({ x: i * freq / 2, y: amp * (-1 * i % 2) })
    }
    return points
}

