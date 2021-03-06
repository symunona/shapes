/**
 * #73
 * Waves
 */

module.exports = function (d) {

    let gridY = 6;
    let sizeY = d.h / (gridY + 4)

    let rep = 4
    let amp = d.h / rep / 4
    let freq = d.w / rep

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')

    for (let ys = 0; ys < gridY; ys++) {
        g
            .append('path')
            .attr('d', wave(amp, freq, rep, d))
            .attr('transform', d.m({
                x: 0,
                y: (sizeY * (ys + 1.5))
            }))
            .attr('class', 'f-' + (ys + 3))
    }

    d.save('waves')
}

function wave(amp, freq, rep, d) {
    let thisWave = wavePoints(amp, freq, rep)

    let closer = []
    closer.push({ x: 0, y: amp * 2 })

    return d.lineD(d.d3.curveCardinal)(thisWave) + ' L' + d.lineD(d.d3.curveLinear)(closer).substr(1)
}

function wavePoints(amp, freq, rep) {
    let points = []
    for (let i = 0; i < (rep * 2) - 1; i++) {
        points.push({ x: i * freq / 2, y: amp * (-1 * i % 2) })
    }
    points.push({ x: (rep - 0.5) * freq, y: amp * 2 })
    return points
}

