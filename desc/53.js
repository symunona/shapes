/**
 * #53
 * 
 * FILTZ
 */
module.exports = function (d) {

    let gridX = 4; gridY = 3;
    let sizeX = d.w / (gridX + 2), sizeY = d.h / (gridY + 2)

    let size = gridY/gridX;

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')

    for (let xs = 0; xs < gridX; xs++) {
        for (let ys = 0; ys < gridY; ys++) {

            g
                .append('path')
                .attr('d', unit([], sizeX * size, sizeY * size, d))
                .attr('transform', d.m({ x: sizeX * (xs + 1.5), y: sizeY * (ys + 1.5) }))
                .attr('class', 'f-'+(xs + 2 + ys))

        }
    }

    d.save('filtz #2')
}

function unit(cs, r, size, d) {

    let rect = d.lineD(d.d3.curveLinearClosed)(d.poly(4, size, null, Math.PI/3-0.03))

    return rect

}
