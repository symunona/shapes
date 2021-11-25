const LS_COLOR_KEY = 'ls_color_key'
const LS_TEX_KEY = 'ls_tex_key'
const KNOBS = [1, 1, 1, 11, 18, 19, 34, 42, 44, 69]
const SIZE = 640
const PAGE_SIZE = 9

const TEXTURES = 20
const TEX_COLOR_KEY = 15

let colors = window.generateDefaultColorGradient()
let colorDefs
let siteColorStyles

let currentPage = 0
let allShapes
let pages
let vaporBg

$.ajax({
    url: 'out/86.svg?' + Math.random(),
    dataType: 'text'
}).then((vaporBgRaw)=>{
    var part = $('<div>').html(vaporBgRaw)
    vaporBg = part.find('g')[0]
})

$(function () {
    'use strict'

    window.generateDefaultStylesheets()

    loadNecessary();

    $(window).on('hashchange', loadNecessary)

    function loadNecessary () {
        $('#images').html('')
        // If we have a hash set, load only that one.
        if (location.hash && location.hash.length > 1) {
            if (!isNaN(Number.parseInt(location.hash.substr(1)))){
                loadShape(Number.parseInt(location.hash.substr(1)))
            } else {
                let paramObject = {}
                let params = location.hash.substr(1).split('&').map((v)=>paramObject[v.split('=')[0]] = v.split('=')[1])
                if (!isNaN(Number.parseInt(paramObject.p))){
                    // Let's page
                    currentPage = parseInt(paramObject.p)
                    loadPage(currentPage).then(function(){
                        // When everything is loaded, scroll to the hash.
                        location.hash && location.hash.split('&').map((pair)=>{
                            if (pair.split('=')[0]==='s'){
                                let id = pair.split('=')[1]
                                document.getElementById(`shape-${id}`).scrollIntoView()
                            }
                        })
                    })
                }
            }
        } else {
            // Load all the shapes from the JSON
            loadPage(0).then(() => {
                var scrollTop = localStorage.getItem('scrll')
                if (scrollTop) {
                    $('body').scrollTop(Number.parseInt(scrollTop));
                }
            })
        }
    }

    randomizeLogo()

    // Restore position, since we are lazy loading.
    $(window).on('scroll', () => {
        localStorage.setItem('scrll', $(window).scrollTop())
    });
})

/**
 * Top left logo knobs vary.
 */
function randomizeLogo(){
    let knob = KNOBS[Math.floor(Math.random() * KNOBS.length)]
    $('#site-id').attr('src')
    $.ajax({url: 'out/' + knob + '.svg', dataType: 'text'}).then(function (data) {
        $('.logo').html('')
        $('.logo').append(data)
        $('.logo svg').attr('viewBox', '0 0 640 640')
    })
}

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

/**
 * If provided url, it removes all the custom SVG definitions
 * from the SVGs (#tex1) - then adds one def to
 * @param {String} [url]
 */
function addTexture (url) {
    $('.textures').hide()

    if (!url){
        url = localStorage.getItem(LS_TEX_KEY)
    } else {
        localStorage.setItem(LS_TEX_KEY, url)
        localStorage.setItem(LS_COLOR_KEY, TEX_COLOR_KEY)
    }

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


function applySvgPatternToOneSvg (node, pattern) {
    let s = Snap(node);
    let ptrn = s.ptrn(0, 0, SIZE, SIZE, 0, 0, SIZE, SIZE).attr({
        'id': 'tex1',
        'patternContentUnits': 'objectBoundingBox'
    })
    ptrn.append(pattern).toDefs()
}


function applyTextureToOneSvg (node, url) {
    let s = Snap(node);
    let imgtex = s.image(url, 0, 0, SIZE, SIZE)
    let ptrn = s.ptrn(0, 0, SIZE, SIZE, 0, 0, SIZE, SIZE).attr({
        'id': 'tex1',
        'patternContentUnits': 'objectBoundingBox'
    })
    ptrn.append(imgtex).toDefs()
}

function setColors (n) {
    n = getSetCurrentColorPalette(n)
    colors = getColors(n)

    // Specials!
    switch(n){
        case 4:
            colors = generateColorsVapor()
            let cssx = cssFromObject(generateDefaultSiteColors(colors))
            let svgCssObjectx = generateDefaultSvgStyle(colors);

            for (let selector in svgCssObjectx) {
                svgCssObjectx[selector]['fill-opacity'] = 0.6;
                svgCssObjectx[selector].stroke = '#aaa7';
            }
            applyStyle(cssx + '\n' + cssFromObject(svgCssObjectx))
            return

        // #WaporWaveBgTex
        case 5:
                colors = generateColorsVapor()
                let cssv = cssFromObject(generateDefaultSiteColors(colors))
                let svgCssObjectv = generateDefaultSvgStyle(colors);
                svgCssObjectv['.fore'] = {fill: 'url(#tex1)'}

                $('#site-styles').remove()
                $('#tex1').remove()
                applySvgPatternToOneSvg($('svg')[0], vaporBg)

                $('body').append($('<style>', {'id': 'site-styles'}).text(
                    cssv + '\n' + cssFromObject(svgCssObjectv)))
                return


        case 10:
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
        case TEX_COLOR_KEY:
            addTexture()
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

function loadPage (n) {
    if (!allShapes){
        return $.ajax('shapes.json?v=' + Math.random()).then((shapes) => {
            allShapes = shapes
            pages = Math.ceil(Object.keys(shapes).length / PAGE_SIZE)
            for(let p = 0; p < pages; p++){
                $('.pager').append($('<a>', {
                    href:`#p=${p}`,
                    id: `page-${p}`,
                    class: 'pager-link',
                    onclick: `showPage(${p})`}).html(p));
            }
            return showPage(n)
        })
    }
    return showPage(n)
}

function showPage (n){
    currentPage = n
    $('.pager-link').removeClass('active')
    $(`#page-${n}`).addClass('active')
    $('#images').html('')
    if (n === 0){ $('.prev-page').hide() } else { $('.prev-page').show() }
    if (n >= pages - 1){ $('.next-page').hide() } else { $('.next-page').show() }
    return $.when.apply(this,
        // Load all the shapes on the page
        Object.keys(allShapes).slice(n * PAGE_SIZE, (n+1)*PAGE_SIZE).map(loadShape))
        // ... and when all is loaded, apply the current color theme!
    .then(()=>{
        setColors()
    })
}

function nextPage(){ location.hash = `p=${currentPage + 1}` }
function prevPage(){ location.hash = `p=${currentPage - 1}` }

function loadShape (i) {
    let el = $('<a>', {href: `out/${i}.svg`, 'class': 'shape', id: `shape-${i}`});
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
            $(svgElement).attr('viewBox', '0 0 640 640')
            el.append(wrapper)
        })
}

