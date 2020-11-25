/**
 * #85
 * New fill style gradient twist 3
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
                .attr('fill', `url(#stripes-6-${xs}-${ys})`)
        }
    }

    for (let xs = 0; xs < gridX; xs++) {
        for (let ys = 0; ys < gridY; ys++) {
            makePattern(d.defs, xs, ys, gridX, gridY, d)
        }
    }

    d.save('gradient #6')
}

function makePattern(defs, gx, gy, xMax, yMax, d) {
    let blockSize = {x: 8, y: 8}
    let pattern = defs.append('pattern')
        .attr('id', `stripes-6-${gx}-${gy}`)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', blockSize.x)
        .attr('height', blockSize.y)

    let l = 7
    let cp = { x: 4, y: 4}
    let angle = (Math.PI / 4) / (xMax-1) * gx + (Math.PI/4)
    let dl = l / yMax * gy

    if (!dl) return

    // let starts = [
    //     { x: cp.x - (Math.sin(angleCp) * d2), y: cp.y - (Math.cos(angleCp) * d2) },
    //     { x: cp.x + (Math.sin(angleCp) * d2), y: cp.y + (Math.cos(angleCp) * d2) }
    // ]
    let points = []
    let allSides = false
    for( let i = 0; i < 4; i++){
        let x = cp.x - (Math.sin(angle + (Math.PI/2 * i)) * dl)
        let y = cp.y - (Math.cos(angle+ (Math.PI/2 * i)) * dl)
        if (x < 0 || y < 0) allSides = true
        points.push({ x, y })
    }

    drawSquare(d, pattern, points);

    if (allSides){
        for( let i = 0; i < 4; i++){
            let px = Math.sin(Math.PI/2 * i) * blockSize.x
            let py = Math.cos(Math.PI/2 * i) * blockSize.y
            drawSquare(d, pattern, points.map((p)=>{ return {x: p.x + px, y: p.y + py}}));
        }
    }
}

function drawSquare(d, pattern, points){
    pattern
        .append('path')
        .attr('d', // 'M-1,1 l2,-20 M0,40 l4,-40 M3,5 l2,-2') //
            d.lineD(d.d3.curveLinear)(points))
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