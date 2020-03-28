const LS_COLOR_KEY = 'ls_color_key'
const KNOBS = [1, 1, 1, 11, 18, 19, 34, 42, 44, 69];
const SIZE = 640;

const TEXTURES = 20

let colors = window.generateDefaultColorGradient()
let colorDefs
let siteColorStyles

$(function () {
    'use strict'
    var presetColors = localStorage.getItem(LS_COLOR_KEY);
    if (presetColors) {

    }

    window.generateDefaultStylesheets()

    loadNecessary();

    $(window).on('hashchange', loadNecessary)

    function loadNecessary () {
        $('#images').html('')
        // If we have a hash set, load only that one.
        if (location.hash && location.hash.length > 1) {
            loadShape(Number.parseInt(location.hash.substr(1)))
        } else {
            // Load all the shapes from the JSON
            loadAll().then(() => {
                var scrollTop = localStorage.getItem('scrll')
                if (scrollTop) {
                    $('body').scrollTop(Number.parseInt(scrollTop));
                }
            })
        }
    }

    let knob = KNOBS[Math.floor(Math.random() * KNOBS.length)]
    $('#site-id').attr('src')
    $.ajax({url: 'out/' + knob + '.svg', dataType: 'text'}).then(function (data) {
        $('.logo').html('')
        $('.logo').append(data)
        $('.logo svg').attr('viewBox', '0 0 640 640')
    })

    // Restore position, since we are lazy loading.
    $(window).on('scroll', () => {
        localStorage.setItem('scrll', $(window).scrollTop())
    });
})

function showTextures () {
    // Load if has not loaded yet
    if (!$('.textures').html()) {
        for (let i = 0; i < TEXTURES; i++) {
            let tex = $('<img>', {'class': 'texture', src: `img/${i}.jpg`, onclick: `addTexture('img/${i}.jpg')`})
            $('.textures').append(tex)
        }
    }
    $('.textures').show()
}


function generateDefaultStylesheets () {
    let css = cssFromObject(generateDefaultSiteColors(colors))
    let svgCss = cssFromObject(generateDefaultSvgStyle(colors))
    $('body').append($('<style>', {'id': 'site-styles'}).text(css + '\n' + svgCss))
}

function addTex1 () {
    addTexture('img/5.jpg')
}

function addTexture (url) {
    $('.textures').hide()

    let css = cssFromObject(generateDefaultSiteColors(colors))
    let svgCssObject = generateDefaultSvgStyle(colors);
    svgCssObject['.fore'] = {fill: 'url(#tex1)'}
    let svgCss = cssFromObject(svgCssObject)
    $('#site-styles').remove()
    $('#tex1').remove()

    let svg = $('svg').get(1)

    applyTextureToOneSvg(svg, url)

    $('body').append($('<style>', {'id': 'site-styles'}).text(css + '\n' + svgCss))
}

function applyTextureToOneSvg (node, url) {
    let s = Snap(node);
    let imgtex = s.image(url, 0, 0, SIZE, SIZE)
    let ptrn = s.ptrn(0, 0, SIZE, SIZE, 0, 0, SIZE, SIZE).attr({
        'id': 'tex1',
        'patternContentUnits': 'objectBoundingBox'
    }
    )
    ptrn.append(imgtex).toDefs()
}

function setColors (n) {
    // localStorage.setItem(LS_COLOR_KEY, n)
    if (n === 0) {
        colors = generateDefaultColorGradient()
    } else if (n === 1) {
        colors = generateColorsInv()
    } else if (n === 2) {
        colors = generateColors1()
    } else if (n === 3) {
        colors = generateDefaultColorGradient()

        let css = cssFromObject(generateDefaultSiteColors(colors))
        let svgCssObject = generateDefaultSvgStyle(colors);
        for (let selector in svgCssObject) {
            svgCssObject[selector]['fill-opacity'] = 0.3;
            svgCssObject[selector].stroke = 'green';
        }
        let svgCss = cssFromObject(svgCssObject)
        applyStyle(css + '\n' + svgCss)
        return
    }

    let css = cssFromObject(generateDefaultSiteColors(colors))
    let svgCssObject = generateDefaultSvgStyle(colors);
    let svgCss = cssFromObject(svgCssObject)
    applyStyle(css + '\n' + svgCss)
}

function applyStyle (css) {
    $('#site-styles').remove()
    $('body').append($('<style>', {'id': 'site-styles'}).text(css))
}

function loadAll () {
    return $.ajax('shapes.json?v=' + Math.random()).then((shapes) => {
        return $.when.apply(this, Object.keys(shapes).map(loadShape))
    })
}

function loadShape (i) {
    let el = $('<a>', {href: `out/${i}.svg`, 'class': 'shape'});
    $('#images').append(el);
    return $.ajax({
        url: `out/${i}.svg?v=` + Math.random(),
        dataType: 'text'
    })
        .then(function (svg) {
            let wrapper = $('<div>', {'class': 'svg-wrapper bgc'})
            wrapper.append(svg)
            let svgElement = $(wrapper.children().get(0))
            let defs = svgElement.children('defs');
            if (colorDefs) {
                let styles = defs.children('style')
                styles.append(colorDefs)
            }
            // Label
            wrapper.css({
                width: svgElement.attr('width'),
                height: svgElement.attr('height')
            })
            wrapper.append($('<div>', {'class': 'label'}).text(
                svgElement.attr('label')
            ))
            el.append(wrapper)
        })
}

