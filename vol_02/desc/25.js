/**
 * color random hair
 */
 define(['frame', 'underscore', '../../js/vendor/seedrandom'], (c, _)=>{
    'use strict'
    let Stripes = function (p) {
        // Defaults
        p.properties = _.extend({}, Stripes.prototype.properties)

        // Setup may be somewhere else... Also do not use c.
        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(30)
            c.info('h4', 'hair')
            c.genFrame();
        }
        let m

        c.genFrame = _.debounce(() => {
            // Variables
            const pad = 20;
            let sizeX = p.properties.inputs.gridX.value,
                sizeY = p.properties.inputs.gridY.value,
                dx = (c.w - (2 * pad)) / sizeX,
                dy = (c.h - (2 * pad)) / sizeY,
                length = p.properties.inputs.length.value,
                angle = p.properties.inputs.angle.value,
                asymmetry = p.properties.inputs.asymmetry.value,
                brush = p.properties.inputs.brush.value,
                fore = p.properties.inputs.fore.value,
                back = p.properties.inputs.back.value

            m = gen(sizeX, sizeY, length, angle, asymmetry, 16)

            p.background(c.c.p[back])
            p.stroke(c.c.p[fore])
            p.strokeWeight(brush)

            for(let y = 0; y < sizeY; y++){
                for(let x = 0; x < sizeX; x++){
                    const q = m[y][x]
                    p.stroke(c.c.p[q.color])
                    const px = pad + dx * x, py = pad + dy * y
                    p.line(px, py, px + (Math.sin(q.angle) * q.len), py + (Math.cos(q.angle) * q.len))
                }
            }
        }, 500)
    };

    function gen(sizeX, sizeY, len, narrow, angleOffset, colors){
        const m = []
        for(let y = 0; y < sizeY; y++){
            m.push([])
            for(let x = 0; x < sizeX; x++){
                m[y].push({
                    len: Math.random() * len,
                    angle: (Math.random() * Math.PI * 2 * narrow) + angleOffset,
                    color: Math.floor(Math.random() * colors)
                })
            }
        }
        return m
    }


    Stripes.prototype.properties = {
        id: 'h4',
        name: 'panels',
        onChange: ()=> c.genFrame(),
        inputs: {
            gridX: {
                desc: 'horizontal items',
                type: 'integer',
                min: 1,
                max: 100,
                value: 60
            },
            gridY: {
                desc: 'vertical items',
                type: 'integer',
                min: 1,
                max: 100,
                value: 60
            },
            angle: {
                desc: 'angle',
                type: 'float',
                min: 0,
                max: 2 * Math.PI,
                step: 0.000125,
                value: 2 * Math.PI,
            },
            length: {
                desc: 'length',
                type: 'float',
                step: 1,
                min: 0,
                max: 50,
                value: 600
            },
            asymmetry: {
                desc: 'asymmetry',
                type: 'float',
                step: 0.01,
                min: 0,
                max: Math.PI / 2,
                value: 1.2
            },
            brush: {
                desc: 'brush',
                type: 'float',
                step: 0.001,
                min: 0,
                max: 10,
                value: 0.1
            },
            fore: {
                desc: 'foreground color',
                type: 'integer',
                min: 0,
                max: 15,
                value: 15
            },
            back: {
                desc: 'background color',
                type: 'integer',
                min: 0,
                max: 15,
                value: 1
            }
        },
        presets: [
            {"name":"ver #000 - Amel","values":{"gridX":60,"gridY":60,"angle":0.08975,"length":600,"asymmetry":1.1301,"brush":0.1,"fore":15,"back":1}},
            {"name":"ver #001 - morse","values":{"gridX":78,"gridY":60,"angle":0,"length":5.46875,"asymmetry":1.5585244804918115,"brush":6.171875,"fore":0,"back":1}},
            {"name":"ver #002","values":{"gridX":64,"gridY":99,"angle":0,"length":7.421875,"asymmetry":1.5585244804918115,"brush":0.46875,"fore":0,"back":1}},
            {"name":"ver #003 - wall tex","values":{"gridX":99,"gridY":99,"angle":0.39269908169872414,"length":600,"asymmetry":0.1349903093339364,"brush":0.078125,"fore":0,"back":1}}
        ]

    }

    return Stripes;
});
