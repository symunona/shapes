/**
 * This is the beginning of my little minimal art project, to create cool looking shapes and stuff.
 * Part of ™P
 *
 * This file reads the contents of the desc dir, interates and requires each file in the folder
 * runs them, feeding with a bunch of helper functions in it's first property, including
 * the save method, that has to be called to generate & save the svg to the default output.
 */
const D3Node = require('d3-node'),
    fs = require('fs'),
    _ = require('underscore')
require('d3-selection-multi')

// We use this to generate default styles.
const colorUtil = require('./variants/colors.js')

// Default height and width of the generated SVG.
const w = 640, h = 640

// This tag will be used in every shape. By default we save it in the svg root's `label` property.
let labelRoot = "_shape #"

let dr

// Default color gradient object.
let colors = colorUtil.generateDefaultColorGradient()

// Generate default style object.
let colorFillClasses = colorUtil.generateDefaultSvgStyle(colors)

let output = {}

// If an argument is present, only compile that file.
// Note: in that case, we do not update `shapes.json`
if (process.argv.length > 2) {
    let numberToCompile = process.argv[2]
    require('./desc/' + numberToCompile)(init(numberToCompile))
} else {
    // Let's find all the .js files in desc dir.
    let files = fs.readdirSync('./desc/')
    files = files.filter((fn) => fn.substr(-3) === '.js')
    files = files.map((fn) => Number(fn.substr(0, fn.length - 3)))
    files = files.sort((a, b) => a > b ? 1 : a < b ? -1 : 0)
    files = files.map((fn) => String(fn) + '.js')

    for (let i = 0; i < files.length; i++) {
        let no = files[i].substr(0, files[i].length - 3)
        try {
            // This is the drawing generator.
            let drawingFunction = require('./desc/' + no)
            // Default values used.
            let d = init(no)
            drawingFunction(d)
            // d.label can be updated by the drawing function.
            output[no] = { label: d.label }
        }
        catch (e) {
            console.error('Error compuling ', i)
            console.error(e)
        }
    }
    // Export the drawings with their labels written in shapes.json
    // This is how the site knows which drawings are available.
    fs.writeFileSync('shapes.json', JSON.stringify(output))
}

/**
 * Generates a collection of helper functions that will be passed to the
 * drawert functions.
 * It creates the roote SVG, using D3's D3Node.
 * @param {Number} no
 * @returns {Object} with the helpers and the root of an SVG file.
 */
function init(no) {
    d = new D3Node()
    dr = d.createSVG(w, h)
    dr.save = save.bind(this, no, d)
    dr.w = dr.width = w
    dr.h = dr.height = h
    dr.cx = dr.centerx = w / 2
    dr.cy = dr.centery = h / 2
    dr.center = { x: dr.cx, y: dr.cy }
    dr.poly = poly
    dr.lineD = lineD
    dr.d3 = D3Node.d3
    dr.c = dr.colors = colors
    dr.m = dr.move = move
    dr.rect = rect

    dr.label = labelRoot
    dr.circlePath = circlePath
    dr.linear = linear
    dr.distance = distance
    dr.radOffset = radOffset
    dr.mark = mark.bind(this, dr)
    dr.add = vectorAdd
    dr.attr('viewport-fill', '#000')

    let defs = dr.append('defs')
    dr.defs = defs

    // If there are special settings, load them and add them to the SVG here.
    loadCss(no, defs)
    loadJs(no, defs)

    // Use these classes for defaults.
    dr.bgc = 'bgc'
    dr.mainc = 'fore'

    return dr
}

/**
 * Adds a vector to another vector. Uses x, y properties.
 * @param {Object} p
 * @param {Object} o
 * @returns {Object}
 */
function vectorAdd(p, o) {
    return { x: p.x + o.x, y: p.y + o.y }
}

/**
 * @param {Object} a
 * @param {Object} b
 * @returns {Number} distance between two points.
 */
function distance(a, b) {
    return Math.sqrt((
        (a.x - b.x) * (a.x - b.x)) +
        ((a.y - b.y) * (a.y - b.y)))
}

/**
 * Get an actual position from a normalized one.
 * @param {Point} from
 * @param {Point} to
 * @param {Number} n
 */
function linear(from, to, n) {
    return {
        x: from.x + ((to.x - from.x) * n),
        y: from.y + ((to.y - from.y) * n)
    }
}

/**
 * Radial offset calculator.
 * @param {Number} a - radian angle
 * @param {Number} r - distance
 * @returns {Object} x,y point that is at `a` angle from [0,0] and `d` far away.
 */
function radOffset(a, r) {
    return {
        x: Math.sin(a) * r,
        y: Math.cos(a) * r
    }
}

/**
 * Generates an `n` sided `r` sized polygon, with an offset and an angle.
 * @param {Number} n sides of the polygon
 * @param {Number} r radian of the polygon's points
 * @param {Object} offset x, y vector where the polygon goes.
 * @param {Number} angleOffset radian angle in which the points should be rotated.
 */
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

/**
 * Adds a 'marker' circle to the drawing and a certain point
 * @param {Object} d consts and helper functions
 * @param {Object} p x,y vector where the marker should go.
 * @param {String} color defaults to 'red'
 */
function mark(d, p, color) {
    d.append('circle')
        .attrs({
            fill: color || 'red',
            cx: p.x,
            cy: p.y,
            r: 3
        })
}

/**
 * Saves the actual SVG.
 * Should be called from every drawing function.
 * @param {Number} imageIndex the image's number to be saved
 * @param {Object} d consts and helper functions.
 * @param {String} [_label] if there is a special modification to it.
 */
function save(imageIndex, d, _label) {

    label = dr.label = _label ? labelRoot + imageIndex + ' ' + _label : labelRoot + imageIndex

    dr.attr('label', label)

    let filename = 'out/' + imageIndex + '.svg'
    fs.writeFileSync(filename, d.svgString())
}

/**
 * Creates a CSS translate property value from hte numbers to move a
 * certain object that it's applied to.
 *
 * i.e.: this will move the element's center point to the middle of the image.
 *  element.attr('transform', d.m({ x: d.cx, y: d.cy }))
 *
 * @param {Object} offset x,y
 * @returns {String} CSS Attribute type.
 */
function move(offset) {
    return `translate(${offset.x},${offset.y})`
}

/**
 * Creates a circle using path descriptors.
 *
 * i.e.: this will create a circle in the middle of the
 *       screen with a height/3 radian.
 * g.append('path')
        .attr('class', d.mainc)
        .attr('d', d.circlePath(d.cx, d.cy, d.h / 3))
 *
 * @param {Number} cx center x
 * @param {Number} cy center y
 * @param {Number} r radian
 * @returns {String}
 */
function circlePath(cx, cy, r) {
    return ` M ${cx - r}, ${cy} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`
}

/**
 * Looks for an external css class to append to the image.
 * If found, then it's appended to it.
 * Any ways, default colors are appended to the image.
 * @param {Number} no number of the drwaing.
 * @param {Node} defs node object to append the style class to.
 */
function loadCss(no, defs) {
    let css = ''
    try {
        css = fs.readFileSync(`desc/junk/${no}.css`, 'utf8')
    } catch (e) { }

    // Populate default color classes.
    css += '\n' + colorUtil.cssFromObject(colorFillClasses)

    // Add default font face
    css += 'text{ font-family: Freemono, Sans, Arial; } \n'

    defs.append('style')
        .attr('type', 'text/css')
        .text(css)
}

/**
 * SVG's might have inline JS code in an external file.
 * Let's embed that into it.
 * @param {Number} no
 * @param {Node} defs
 */
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

/**
 * Create a line object factory that maps to the x and y property of an array of objects.
 * Different c values can be:
 *      - d.d3.curveLinear
 *      - d.d3.curveLinearClosed
 *      - d.d3.curveCardinal
 *      - d.d3.curveCardinalClosed
 *      - d.d3.curveBasis
 *      - d.d3.curveBasisClosed
 * etc, @see d3 specs
 * i.e.: [{x: 0, y:1}, {x: 0, y:1}]
 * @param {String} [c] the type of the curve. an be.
 * @returns {Function} that takes the points as arguments.
 */
function lineD(c) {
    return D3Node.d3.line()
        .x(function (d) { return d.x })
        .y(function (d) { return d.y })
        .curve(c || D3Node.d3.curveCardinalClosed)
}

/**
 * Creates an array of points of a rectangle, with a center point of [0,0].
 *
 * Use with lineD to create a path.
 * @param {Number} x
 * @param {Number} y
 * @returns {Array} of points
 */
function rect(x, y) {
    return [
        { x: -x, y: -y },
        { x: x, y: -y },
        { x: x, y: y },
        { x: -x, y: y }
    ]
}

