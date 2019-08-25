/**
 * #71
 */
module.exports = function (d) {

    let gridX = 6; gridY = 2;
    let sizeX = d.w / (gridX + 2), sizeY = d.h / (gridY + 2)

    let size = gridY/gridX;

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')
    // .attr('transform', d.m({ x: d.cx, y: d.cy }))

    for (let xs = 0; xs < gridX; xs++) {
        for (let ys = 0; ys < gridY; ys++) {

            g
                .append('path')
                .attr('d', unit([], 0, {x: sizeX * size, y: sizeY * size, r: size*10}, d))
                .attr('transform', d.m({ x: sizeX * (xs + 1.5), y: sizeY * (ys + 1.5) }))
                .attr('fill', d.c[xs + 2 + ys])

        }
    }



    d.save('gradient #2')
}

function unit(cs, r, size, d) {

    // let rect = d.lineD(d.d3.curveLinearClosed)(d.poly(4, size, null, Math.PI/4))
    let rectangle = d.lineD(d.d3.curveLinearClosed)(rect(size.x * size.r / 2, size.y * size.r / 2))

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