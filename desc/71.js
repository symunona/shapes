/**
 * #71
 * New fill style gradient.
 *
 * TODO
 */
module.exports = function (d) {

    let gridX = 8; gridY = 1;
    let sizeX = d.w / (gridX + 2), sizeY = d.h / (gridY + 2)

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')

    for (let xs = 0; xs < gridX; xs++) {
        for (let ys = 0; ys < gridY; ys++) {

            g
                .append('path')
                .attr('d', unit({ x: sizeX / 2, y: sizeY / 3 }, d))
                .attr('transform', d.m({ x: sizeX * (xs + 1.5), y: sizeY * (ys + 1.5) }))
                .attr('fill', 'url(#stripes-' + (xs + ys) + ')')

        }
    }

    for (let i = 0; i < gridX; i++) {
        makePattern(d.defs, i, gridX)
    }

    d.save('gradient #2')
}

function makePattern(defs, n, all) {
    defs.append('pattern')
        .attr('id', 'stripes-' + n)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 4)
        .attr('height', 4)
        .append('path')
        .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
        .attr('style', 'stroke-width: ' + ((n + 1) * (3 / all)))
        .attr('class', 'fore')
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