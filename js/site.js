$(function () {

    // If we have a hash set, load only that one.
    if (location.hash && location.hash.length > 1) {
        loadShape(Number.parseInt(location.hash.substr(1)))
    } else {
        // Load all the shapes from the JSON
        loadAll();
    }


})

function loadAll() {
    $('#images').html('')
    return $.ajax('shapes.json?v=' + Math.random()).then((shapes) => {
        return $.when.apply(this, shapes.map(loadShape))
    })
}

function loadShape(e, i) {
    let el = $('<a>', { href: `out/${i}.svg`, 'class': 'shape' });
    // el.append($('<img>', { src: `out/${i}.svg` }))
    $('#images').append(el);
    return $.ajax({
        url: `out/${i}.svg?v=` + Math.random(),
        dataType: 'text'
    })
        .then(function (svg) {
            el.append(svg)
        })
}

