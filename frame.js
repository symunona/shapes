/**
 * This is the beginning of my little minimal art project, to create cool looking shapes and stuff.
 * Part of ™P
 */
const D3Node = require('d3-node'),
    fs = require('fs'),
    _ = require('underscore')
require('d3-selection-multi')

// const d = new D3Node()      // initializes D3 with container element

const screenSize = 640

const w = 640, h = 640
let label = "_shape #"



let dr;

let steps = 16;
let step = 256 / steps;
let colors = Array.apply(null, { length: steps }).map(Number.call, Number)
colors = colors.map((c) => {
    let c16 = (step * c).toString(16)
    return '#' + c16 + c16 + c16;
})

let output = []
if (process.argv.length > 2) {
    require('./desc/' + process.argv[2])(init(process.argv[2]))
} else {
    let files = fs.readdirSync('./desc/')
    // Hahh!
    files = files.filter((fn) => fn.substr(-3) === '.js')
    files = files.map((fn) => Number(fn.substr(0, fn.length - 3)))
    files = files.sort((a, b) => a > b ? 1 : a < b ? -1 : 0)
    files = files.map((fn) => String(fn) + '.js')

    for (let i = 0; i < files.length; i++) {
        let no = files[i].substr(0, files[i].length - 3)
        try {
            require('./desc/' + no)(init(no))
            output.push(no)
        }
        catch (e) {
            console.error(e)
        }
    }
    fs.writeFileSync('shapes.json', JSON.stringify(output));
}


function init(no, _label) {
    d = new D3Node()
    dr = d.createSVG(w, h)
    dr.save = save.bind(this, no, d);
    dr.w = w
    dr.h = h
    dr.cx = w / 2
    dr.cy = h / 2
    dr.center = {x: dr.cx, y: dr.cy}
    dr.poly = poly
    dr.lineD = lineD
    dr.d3 = D3Node.d3
    dr.c = colors
    dr.m = m
    dr.bg = colors[1]
    dr.label = label
    dr.circlePath = circlePath
    dr.linear = linear
    dr.distance = distance
    dr.radOffset = radOffset
    dr.mark = mark.bind(this, dr)
    dr.add = add
    dr.attr('viewport-fill', '#000')

    let defs = dr.append('defs')
    dr.defs = defs

    loadCss(no, defs)
    loadJs(no, defs)

    dr.base = dr.append('rect')
        .attrs({ x: 0, y: 0, width: w, height: h, fill: dr.bg, stroke: colors[7] })

    return dr
}

function add(p, o) {
    return { x: p.x + o.x, y: p.y + o.y }
}

function distance(a, b) {
    return Math.sqrt((
        (a.x - b.x) * (a.x - b.x)) +
        ((a.y - b.y) * (a.y - b.y)))
}

function linear(from, to, n) {
    return {
        x: from.x + ((to.x - from.x) * n),
        y: from.y + ((to.y - from.y) * n)
    }
}

function radOffset(a, r) {
    return {
        x: Math.sin(a) * r,
        y: Math.cos(a) * r
    }
}

function poly(n, r, offset, angleOffset) {
    let da = Math.PI * 2 / n
    let ret = []
    angleOffset = angleOffset || 0
    if (!offset) offset = { x: 0, y: 0 }
    for (let i = 0; i < n; i++) ret.push({
        x: (Math.sin(da * i + angleOffset) * r) + offset.x,
        y: (Math.cos(da * i + angleOffset) * r) + offset.y
    })
    return ret
}

function mark(d, p, color) {
    d.append('circle')
        .attrs({
            fill: color || 'red',
            cx: p.x,
            cy: p.y,
            r: 3
        })
}

function save(imageIndex, d, _label) {

    dr.append('text')
        .attrs({ x: dr.cx, y: h - 8, 'text-anchor': "middle", fill: colors[6] })
        .text(_label ? label + imageIndex + ' ' + _label : label + imageIndex)

    fs.writeFileSync('out/' + imageIndex + '.svg', d.svgString())
}

function m(offset) {
    return `translate(${offset.x},${offset.y})`
}

function svg() {
    return d = d3.select('body')
        .append("svg")
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight)
}

function reset() {
    d3.select("svg").remove();
    return svg()
}

function circlePath(cx, cy, r) {
    return ` M ${cx - r}, ${cy} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`
}

function loadCss(no, defs) {
    let css = ''
    try {
        css = fs.readFileSync(`desc/junk/${no}.css`, 'utf8')
    } catch (e) { }
    defs.append('style')
        .attr('type', 'text/css')
        .text('text{ font-family: Freemono, Sans, Arial; fill: #555} \n' + css)
}

function loadJs(no, defs) {
    let js = ''
    try {
        js = fs.readFileSync(`desc/junk/${no}.js`, 'utf8')
    } catch (e) { }
    if (js) {
        defs.append('script')
            .attr('type', 'text/javascript')
            // .attr('xlink:href', `desc/junk/${no}.js`)
            .text(`<![CDATA[\n${js}\n]]>`)
    }

}

function lineD(c) {
    return D3Node.d3.line()
        .x(function (d) { return d.x; })
        .y(function (d) { return d.y; })
        .curve(c || D3Node.d3.curveCardinalClosed);

}
