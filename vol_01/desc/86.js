/**
 * #86
 * Squared gradient
 */
module.exports = function (d) {

    let gridX = 8; gridY = 8;
    let sizeX = d.w / (gridX + 2), sizeY = d.h / (gridY + 2)

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')

    const margin = 0.1

    for (let xs = 0; xs < gridX; xs++) {
        for (let ys = 0; ys < gridY; ys++) {
            g
                .append('path')
                .attr('d', unit({ x: sizeX / 2 + margin, y: sizeY / 2 + margin }, d))
                .attr('transform', d.m({ x: sizeX * (xs + 1.5), y: sizeY * (ys + 1.5) }))
                .attr('class', 'f-'+ (Math.min((xs + ys + 2), 15) ))
        }
    }

    d.save('gradient #7')
}

function unit(size, d) {
    let rectangle = d.lineD(d.d3.curveLinearClosed)(rect(size.x, size.y))
    return rectangle
}

function rect(x, y) {
    return [
        { x: -x, y: -y },
        { x: x, y: -y },
        { x: x, y: y },
        { x: -x, y: y }
    ]
}