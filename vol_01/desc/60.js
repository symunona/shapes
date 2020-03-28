/**
 * #60
 *
 * Ascii fun
 */
module.exports = function (d) {

    let gridX = 6; gridY = 2;

    let size = gridY/gridX;

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')

    var characters = '█▓▒░'

    g
        .append('text')
        .attr('class', d.mainc)
        .attr('font-size', 150)
        .attr('text-anchor', 'middle')
        .text(characters)
        .attr('transform', d.m({ x: d.cx, y: d.cy}))

    d.save('ascii #1')
}