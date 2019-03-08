/**
 * #56
 * 
 * FILTZ
 */
module.exports = function (d) {

    let grid = { x: 4, y: 3 };
    let size = { x: d.w / (grid.x + 1), y: d.h / (grid.y + 1), r: grid.y / grid.x }


    let g = d.append('g')
        .attr('fill-rule', 'evenodd')

    for (let x = 0; x < grid.x; x++) {
        for (let y = 0; y < grid.y; y++) {

            unit({ x, y }, size, grid, d, g)

        }
    }

    d.save('filtz #6')
}

function unit({ x, y }, size, grid, d, g) {


    let rects = d.lineD(d.d3.curveLinearClosed)(rect(size.x * size.r / 2, size.y * size.r / 2))

    let g2 = g.append('g')
        .attr('transform', d.m({ x: size.x * (x + 1), y: size.y * (y + 1) }));

    g2
        .append('path')
        .attr('d', rects)
        .attr('fill', d.c[4])

    circles = 2;



    // for (let ci = 0; ci < circles; ci++) {
        g2
            .append('circle')
            .attr('cx', size.x / (grid.x + 2) * (x + 1.5) - (size.x / 2))
            .attr('cy', size.y / (grid.y + 1) * (y + 1) - (size.y / 2))
            .attr('r', size.x / 20)
            .attr('fill', d.c[1])

        rects += d.circlePath(0, 0, size.x);
    // }

    return rects

}

function rect(x, y) {
    return [
        { x: -x, y: -y },
        { x: x, y: -y },
        { x: x, y: y },
        { x: -x, y: y }
    ]
}
