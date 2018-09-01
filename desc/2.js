/**
 * #2
 */

module.exports = function (d) {

    let triangle = d.poly(3, d.h / 3)
    triangle.reverse()

    let g = d.append('g')
        .attr('fill-rule', 'evenodd')
        .attr('transform', d.m({ x: d.cx, y: d.cy }))

    g.append('defs').append('style')
        .text(
        '.spin{ animation: spin 2s cubic-bezier(0.49, 0.18, 0, 0.99) infinite; } \n' +
        '@keyframes spin { 100% { transform:rotate(120deg); } }');

    // .append('animateTransform')
    // .attrs({
    //     attributeName:"transform",
    //     begin:"0s",
    //     dur:"2s",
    //     type:"translate",
    //     from:"0 0",
    //     to:"40 0", 
    //     repeatCount:"4",
    //     fill:"freeze",
    //     calcMode:"spline",
    //     keySplines:"0.4 0 0.2 1; 0.4 0 0.2 1",
    //     values:"0;30;0"
    // })



    let cx = 0 //d.cx
        , cy = 0 //d.cy 
        , r = d.h / 3


    let p = g.append('path')
        .attr('class', 'spin')
        .attr('d',
            d.lineD(d.d3.curveLinearClosed)(triangle) +
            ` M ${cx - r}, ${cy} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`)
        .attr('fill', d.c[3])


    d.save('_shape #1 anim #1')
}