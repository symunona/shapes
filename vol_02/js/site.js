/**
 * I really thought of going light-weight, and here I am, using require again...
 */
requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'vendor/jquery.min',
        colors: '../../vol_01/variants/colors',
        underscore: 'vendor/underscore-min',
        p5: 'vendor/p5',
        'p5-sound': '../../js/vendor/p5.sound'
    },
    shim: {
        'p5-sound': { deps: ['p5'] }
    }
});
requirejs(['require', 'jquery', 'p5', './midi', 'frame'], (require, $, P5, midi, c)=>{
    'use strict'
    const FROM = 1
    const TO = 23
    const STARTUP = 11

    // Hach!
    window.p5 = P5

    if (location.hash) {
        var startup = parseInt(location.hash.substr(1));
        if (location.hash.indexOf('s') > -1){
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
            $('#list a').removeClass('active')
            $('[data-no=' + n + ']').addClass('active')
            $('#shape-wrapper').show()
            currentDrawing = new P5(drawing, 'shape-main')
            currentDrawing.no = n

            // User can store their presets in their localStorage
            try{
                let lastPreset = restorePresets(currentDrawing)
            }
            catch(e){
                // naaah.
            }

            // These are the sliders and buttons on the side.
            renderControls(currentDrawing)
            midi(midiUpdate.bind(this, currentDrawing))

            // Now load the last preset
            // if (lastPreset) loadPreset(currentDrawing, lastPreset)
        })
    }


    const midiRange = 128

    function midiUpdate(drawing, channel, value){
        if (drawing &&
            drawing.properties &&
            drawing.properties.inputs &&
            Object.keys(drawing.properties.inputs).length) {

            if(channel < Object.keys(drawing.properties.inputs).length) {
                // See max and min values of the prop
                const key = Object.keys(drawing.properties.inputs)[channel]
                const prop = drawing.properties.inputs[key]
                const range = prop.max - prop.min
                const delta = range / midiRange

                prop.value = prop.min + (delta * value)
                if (prop.type === 'integer') prop.value = Math.round(prop.value)

                $(`#${key} input`).val(prop.value)
                if (prop.onChange){ prop.onChange(prop.value) }
            }
            if(channel >= Object.keys(drawing.properties.inputs).length) {
                if (channel === Object.keys(drawing.properties.inputs).length){
                    const deltaX = window._c.w / midiRange
                    drawing.mouseX = value * deltaX
                } else {
                    const deltaY = window._c.h / midiRange
                    drawing.mouseY = value * deltaY
                }
            }
        }
    }

    $('#toggler').click(toggleControls)

    // Space toggles the controls.
    $('body').on('keydown', (evt)=>{
        if (evt.keyCode === 32) {toggleControls()}
        if (evt.keyCode === 13) {
            // Can not really save an SVG,
            if (currentDrawing.algoLayer){
                currentDrawing.save(currentDrawing.no + '.svg')
            }
            currentDrawing.save(currentDrawing.no + '.png')
        }
    })

    function toggleControls(){
        $('body').toggleClass('clean')
        $('#toggler').text($('#toggler').text() === 'H'?'S':'H')
    }

    function unload () {
        if (currentDrawing) {
            if (currentDrawing.stop) { currentDrawing.stop() }
            currentDrawing.remove()
        }
        $('#list a.active').removeClass('active')
    }

    function renderControls (drawing) {
        let $ctrlList = $('#ctrl ul').html('')
        if (!drawing.properties) { $('#ctrl').hide(); return }

        $('#ctrl').show()
        $('#ctrl > span.head').text('ctrl - ' + drawing.properties.id)
        if (drawing && drawing.properties && drawing.properties.inputs) {
            Object.keys(drawing.properties.inputs).map((key)=>{
                let props = drawing.properties.inputs[key]
                let desc = `${props.desc} (${props.min} - (${props.default}) - ${props.max})`

                let $ctrl = $('<li>', {title: desc})
                if (['float', 'number', 'integer'].indexOf(props.type)>-1){
                    $ctrl.append(createInput(props, key))
                } else {
                    $ctrl.append(createButton(props, drawing, key))
                }

                $ctrlList.append($ctrl)
            })
            if (drawing.properties.playPause){
                let playPause = createButton({
                        type: 'button',
                        text: '■',
                        class: 'play-pause',
                        action: ()=>{
                            if (drawing.isPlaying !== false){
                                drawing.noLoop()
                                playPause.find('button').html('►')
                            } else {
                                drawing.loop()
                                drawing.draw()
                                playPause.find('button').text('■')
                            }
                            drawing.isPlaying = !drawing.isPlaying
                        }
                }, drawing)
                $('#ctrl > span.head').append(playPause)
            }
        }
        // Presets
        $('#ctrl').append(renderPresets(drawing))
    }

    function restorePresets(drawing){
        let lastListOfPresets = localStorage.getItem('shape-list-' + drawing.properties.id)
        drawing.properties.presets = lastListOfPresets?JSON.parse(lastListOfPresets):drawing.properties.presets
        let lastPresetValue = localStorage.getItem('shape-' + drawing.properties.id)
        return lastPresetValue ? JSON.parse(lastPresetValue) : false
    }

    function renderPresets (drawing) {
        $('.presets').remove()
        let $el = $('<div>', {class: 'presets'}), $savePresetButton = $('<a>').text('save')
        $savePresetButton.on('click', savePreset.bind(this, drawing))
        $el.append($savePresetButton);

        if (!drawing.properties.presets) { return; }
        $el.append(drawing.properties.presets.map((p)=>{
            let $p = $('<a>').text(p.name)
            $p.on('click', loadPreset.bind(this, drawing, p, true))
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
        localStorage.setItem('shape-' + drawing.properties.id, JSON.stringify(data))
        // localStorage.setItem('shape-list-' + drawing.properties.id, JSON.stringify(drawing.properties.presets))
        return data;
    }

    function loadPreset (drawing, p, saveIt) {
        Object.keys(p.values).map((key)=>{
            if (drawing.properties.inputs[key]) {
                drawing.properties.inputs[key].value = p.values[key]
            }
        })

        // When loading a preset, change the default to this.
        if (saveIt) { localStorage.setItem('shape-' + drawing.properties.id, JSON.stringify(p)) }
        if (drawing.properties?.reset){ drawing.properties?.reset() }
    }


    function createInput (prop, id) {
        let $el = $('<div>', {title: `${prop.min} - (${prop.type}) - ${prop.max}`, id});
        $el.append($('<div>').text(prop.desc))
        let $numeric = $('<input>', {
            class: 'num',
            type: 'number',
            value: prop.value,
            min: prop.min,
            max: prop.max,
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
            if (prop.onChange){ prop.onChange(val) }
        }
    }


    function createButton (prop) {
        let $el = $('<div>', {title: prop.desc || '', 'class': 'ctrl-button ' + (prop.class || '')})
        let $button = $('<button>').html(prop.text)
        $button.on('click', ()=>prop.action())
        $el.append($button)
        return $el
    }

    function setProperty (key, value) {
        currentDrawing.properties.inputs[key] = value
    }

    window.setColors = function setColors(n){
        c.colorUtils.getSetCurrentColorPalette(n)
        let palette = c.colorUtils.getColors(c.colorUtils.getSetCurrentColorPalette())
        // colors
        c.c = {
            p: palette,
            f: palette[c.DEFAULT_COLOR_INDEX],
            b: palette[c.DEFAULT_BACKGROUND_COLOR_INDEX]
        }
        let css = cssFromObject(generateDefaultSiteColors(palette))
        let svgCssObject = generateDefaultSvgStyle(palette);
        let svgCss = cssFromObject(svgCssObject)
        applyStyle(css + '\n' + svgCss)
    }

    function applyStyle (css) {
        $('#site-styles').remove()
        $('body').append($('<style>', {'id': 'site-styles'}).text(css))
    }

    window.setColors()

})
