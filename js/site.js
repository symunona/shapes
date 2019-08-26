const LS_COLOR_KEY = 'ls_color_key'
let colorDefs = ''

$(function () {

    var presetColors = localStorage.getItem(LS_COLOR_KEY);
    if (presetColors) {
        if (presetColors == '1'){
            colorDefs = '\n.fore{ fill: red}';
        }
        else{
            colorDefs = generateCssFromColors(generateColors1())
        }

    }

    loadNecessary();

    $(window).on('hashchange', loadNecessary)

    function loadNecessary() {
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
    // Restore position, since we are lazy loading.
    $(window).on('scroll', () => {
        localStorage.setItem('scrll', $(window).scrollTop())
    });

})


function setColors(n) {
    localStorage.setItem(LS_COLOR_KEY, n)
}

function loadAll() {
    return $.ajax('shapes.json?v=' + Math.random()).then((shapes) => {
        return $.when.apply(this, Object.keys(shapes).map(loadShape))
    })
}

function loadShape(i) {
    let el = $('<a>', { href: `out/${i}.svg`, 'class': 'shape' });
    $('#images').append(el);
    return $.ajax({
        url: `out/${i}.svg?v=` + Math.random(),
        dataType: 'text'
    })
        .then(function (svg) {
            let wrapper = $('<div>', { 'class': 'svg-wrapper bgc' })
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
            wrapper.append($('<div>', { 'class': 'label' }).text(
                svgElement.attr('label')
            ))
            el.append(wrapper)
        })
}

