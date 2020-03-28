/**
 * #0
 */

module.exports = function (d) {

    d.append('circle')
        .attrs({
            cx: d.cx,
            cy: d.cy,
            r: d.h / 3,

        })
        .attr('cy', d.cy)
        .attr('r', d.h / 6)
        .attr('class', d.mainc)

    let fonts = [
        'Freemono',
        'Sans Serif',
        'Prestige Elite',
        'Ethiopia Jiret',
        'Arial',
        'Verdana',
        'Helvetica',
        'Trebuchet MS',
        'Courier',
        'Courier New'
    ]

    let intro = 'This is for dealing with time.'
    d.append('text').attrs({x: d.w - 1, y: 11, 'text-anchor': 'end'}).text(intro)


    d.selectAll('text.style')
        .data(fonts)
        .enter()
        .append('text')
        .attrs({
            x: 10,
            y: function (e) {
                return (fonts.indexOf(e) + 1) * d.h / (fonts.length + 1)
            },
            style: function (e) {
                return 'font-family: ' + e;
            },
            'class': 'style'
        }).text(function (t) {
            return d.label + Math.floor(Math.random()*1000) + ' - ' + t;
        })
        .attr('class', d.mainc)


    d.append('path')
        .attr('d', d.lineD(d.d3.curveLinearClosed)(d.poly(3, d.h / 4, { x: d.cx, y: d.cy })))
        .attr('class', d.bgc)


    gradient1(d)
    gradient2(d)

    d.save()

}

function gradient1(d){
    let gridX = 1; gridY = 16;
    let sizeX = d.w / (gridX + 2), sizeY = d.h / (gridY + 2)
    let offset = {
        x: d.w / 10 * 4,
        y: 0
    }

    let size = gridX/gridY*5.5;

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')

    for (let xs = 0; xs < gridX; xs++) {
        for (let ys = 0; ys < gridY; ys++) {

            g
                .append('path')
                .attr('d', unit({x: sizeX * size/4, y: sizeY * size, r: size*10}, d))
                .attr('transform', d.m({
                    x: offset.x + (sizeX * (xs + 1.5)),
                    y: offset.y + (sizeY * (ys + 1.5)) }))
                .attr('class', 'f-'+ (xs + ys))

        }
    }

}


function gradient2(d){
    let gridX = 1; gridY = 16;
    let sizeX = d.w / (gridX + 2), sizeY = d.h / (gridY + 2)
    let offset = {
        x: d.w / 20 * 5,
        y: 0
    }

    let size = gridX/gridY*4;

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')

    for (let xs = 0; xs < gridX; xs++) {
        for (let ys = 0; ys < gridY; ys++) {

            g
                .append('path')
                .attr('d', unit({x: sizeX * size/3, y: sizeY * size, r: size*10}, d))
                .attr('transform', d.m({
                    x: offset.x + (sizeX * (xs + 1.5)),
                    y: offset.y + (sizeY * (ys + 1.5)) }))
                .attr('class', 'f-'+ (xs + ys))
            g.append('text').text(xs+ys)

        }
    }
}



function unit(size, d) {

    let rectangle = d.lineD(d.d3.curveLinearClosed)(d.  rect(size.x * size.r / 2, size.y * size.r / 2))
    return rectangle
}