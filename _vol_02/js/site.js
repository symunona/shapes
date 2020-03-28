/**
 * I really thought of going light-weight, and here I am, using require again...
 */
requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'vendor/jquery.min',
        colors: '../../_vol_01/variants/colors'
    }
});
requirejs(['require', 'jquery', 'vendor/p5'], (require, $, P5)=>{
    'use strict'
    const FROM = 82
    const TO = 83
    const STARTUP = 83
    loadShape(STARTUP)

    for (let i = FROM; i <= TO; i++) {
        $('#list').append($('<li>').append($('<a>', {onclick: 'loadShape(' + i + ')', 'data-no': i}).append('_' + i)))
    }

    window.loadShape = loadShape

    let currentDrawing

    function loadShape (n) {
        require(['../desc/' + n], (drawing)=>{
            if (currentDrawing) {
                currentDrawing.remove()
            }
            $('#list a.active').removeClass('.active')
            $('[data-no=' + n + ']').addClass('.active')
            $('#shape-wrapper').show()
            currentDrawing = new P5(drawing, 'shape-main')
        })
    }
})
