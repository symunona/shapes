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
        .attr('fill', d.c[4])

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
            }
        }).text(function (t) {
            return d.label + '546 - ' + t;
        })
        .attr('fill', d.c[4])


    d.append('path')
        .attr("d", d.lineD(d.d3.curveLinearClosed)(d.poly(3, d.h / 4, { x: d.cx, y: d.cy })))
        .attr('fill', d.bg)

    d.save()

}

// try{
// const d = require('./frame')(0)
// module.exports(d);
// }
// catch(e){
//     console.error(e)
//     debugger;
// }
