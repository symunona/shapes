/**
 * #57
 * 
 * FILTZ
 */
module.exports = function (d) {

    let grid = { x: 5, y: 3 };
    let size = { x: d.w / (grid.x + 1), y: d.h / (grid.y + 1), r: grid.y / grid.x }


    let g = d.append('g')
        .attr('fill-rule', 'evenodd')

    for (let x = 0; x < grid.x; x++) {
        for (let y = 0; y < grid.y; y++) {

            unit({ x, y }, size, grid, d, g)

        }
    }

    d.save('filtz #7')
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

    let step = {
        x: (size.x / (grid.x + 2)),
        y: (size.y / (grid.y + 2))
    }

    let offset = {
        x: -(size.x / 2) + (step.x / 2),
        y: -(size.y / 2) + (step.y / 2)
    }

    let partY = offset.y + ((step.y * (y + 1)) / 2)
    let partX = offset.x + (step.x * (x + 1))

    g2
        .append('circle')
        .attr('cx', partX)
        .attr('cy', partY)
        .attr('r', size.x / 12)
        .attr('fill', d.c[1])

    let partY2 = -offset.y - ((step.y * (y + 1)) / 2)
    let partX2 = -offset.x - (step.x * (x + 1))

    g2
        .append('circle')
        .attr('cx', partX2)
        .attr('cy', partY2)
        .attr('r', size.x / 20)
        .attr('fill', d.c[3])



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
