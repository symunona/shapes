/**
 * I really thought of going light-weight, and here I am, using require again...
 */
requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'vendor/jquery.min',
        colors: '../../vol_01/variants/colors',
        underscore: 'vendor/underscore-min',
        p5: 'vendor/p5'
    }
});
requirejs(['require', 'jquery', 'p5'], (require, $, P5)=>{
    'use strict'
    const FROM = 1
    const TO = 10
    const STARTUP = 10

    if (location.hash) {
        var startup = parseInt(location.hash.substr(1));
        if (location.hash.substr(1, 1) === 's'){
            toggleControls()
        }
        if (startup >= FROM && startup <= TO) {
            loadShape(startup);
        } else {
            loadShape(STARTUP)
        }
    } else {
        loadShape(STARTUP)
    }


    for (let i = FROM; i <= TO; i++) {
        $('#list').append($('<li>').append($('<a>', {onclick: 'loadShape(' + i + ')', 'data-no': i}).append('_' + i)))
    }

    window.loadShape = loadShape
    window.unload = unload

    let currentDrawing

    function loadShape (n) {
        require(['../desc/' + n], (drawing)=>{
            unload()
            $('[data-no=' + n + ']').addClass('.active')
            $('#shape-wrapper').show()
            currentDrawing = new P5(drawing, 'shape-main')
            renderControls(currentDrawing)
            // Add the default to the presets.
        })
    }

    $('#toggler').click(toggleControls)

    function toggleControls(){
        $('body').toggleClass('clean')
        $('#toggler').text($('#toggler').text() === 'H'?'S':'H')
    }

    function unload () {
        if (currentDrawing) {
            currentDrawing.remove()
        }
        $('#list a.active').removeClass('.active')
    }

    function renderControls (drawing) {
        let $ctrlList = $('#ctrl ul').html('')
        if (!drawing.properties) { $('#ctrl').hide(); return }

        $('#ctrl').show()
        $('#ctrl > span.head').text('ctrl - ' + drawing.properties.id)
        Object.keys(drawing.properties.inputs).map((key)=>{
            let props = drawing.properties.inputs[key]
            let desc = `${props.desc} (${props.min} - (${props.default}) - ${props.max})`


            let $ctrl = $('<li>', {title: desc})
            $ctrl.append(createInput(props))
            $ctrlList.append($ctrl)
        })
        // Presets
        $('#ctrl').append(renderPresets(drawing))
    }

    function renderPresets (drawing) {
        $('.presets').remove()
        let $el = $('<div>', {class: 'presets'}), $savePresetButton = $('<a>').text('save')
        $savePresetButton.on('click', savePreset.bind(this, drawing))
        $el.append($savePresetButton);

        if (!drawing.properties.presets) { return; }
        $el.append(drawing.properties.presets.map((p)=>{
            let $p = $('<a>').text(p.name)
            $p.on('click', loadPreset.bind(this, drawing, p))
            return $p;
        }))
        $('#shape-wrapper').click(savePreset.bind(this, drawing))
        return $el;
    }

    function savePreset (drawing) {
        let data = {
            name: 'ver #' + String(drawing.properties.presets.length).padStart(3, '0'),
            values: {}
        }

        Object.keys(drawing.properties.inputs).map((key)=>
            data.values[key] = drawing.properties.inputs[key].value)

        drawing.properties.presets.push(data);

        $('#ctrl').append(renderPresets(drawing))

        console.log(JSON.stringify(data))
        try {
            navigator.clipboard.writeText(JSON.stringify(data, null, 2))
        } catch (me) { /* if you can */ }
        return data;
    }

    function loadPreset (drawing, p) {
        Object.keys(p.values).map((key)=>{
            if (drawing.properties.inputs[key]) {
                drawing.properties.inputs[key].value = p.values[key]
            }
        })
    }


    function createInput (prop) {
        let $el = $('<div>', {title: `${prop.min} - (${prop.type}) - ${prop.max}`});
        $el.append($('<div>').text(prop.desc))
        let $numeric = $('<input>', {
            class: 'num',
            type: 'number',
            value: prop.value,
            min: prop.min,
            max: prop.max
        })
        let $slider = $('<input>', {
            type: 'range',
            min: prop.min,
            max: prop.max,
            // Default stepping of float is 0.1, default stepping of int is 1
            step: prop.step || (prop.type === 'float' ? 0.1 : 1),
            value: prop.value
        })
        $el.append($slider, $numeric);
        $slider.on('input', onChange)
        $numeric.on('change', onChange)
        return $el

        function onChange (event) {
            let val = $(this).val();
            switch (prop.type) {
                case 'integer': val = parseInt(val);break
                case 'float': val = parseFloat(val);break
            }
            $numeric.val(val)
            $slider.val(val)
            prop.value = val;
        }
    }

    function setProperty (key, value) {
        currentDrawing.properties.inputs[key] = value
    }
})
