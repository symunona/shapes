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
            c.info('h5', 'hairs')
            c.genFrame();
        }
        let m
        c.genFrame = () => {
            let sizeX = p.properties.inputs.gridX.value,
                sizeY = p.properties.inputs.gridY.value,
                length = p.properties.inputs.length.value,
                angle = p.properties.inputs.angle.value,
                asymmetry = p.properties.inputs.asymmetry.value,
                fore = p.properties.inputs.fore.value

            m = gen(sizeX, sizeY, length, angle, asymmetry, fore)
        }

        p.draw = () => {
            // Variables
            const pad = p.properties.inputs.pad.value * c.w / 200;
            let sizeX = p.properties.inputs.gridX.value,
                sizeY = p.properties.inputs.gridY.value,
                dx = (c.w - (2 * pad)) / sizeX,
                dy = (c.h - (2 * pad)) / sizeY,
                brush = p.properties.inputs.brush.value,
                fore = p.properties.inputs.fore.value,
                back = p.properties.inputs.back.value

            p.background(c.c.p[back])
            p.stroke(c.c.p[fore])
            p.strokeWeight(brush)

            for(let y = 0; y < sizeY; y++){
                for(let x = 0; x < sizeX; x++){
                    const q = m[y][x]
                    p.stroke(c.c.p[q.color])
                    const px = pad + (dx * x), py = pad + (dy * y)
                    const distortion = p.dist(px, py, p.mouseX, p.mouseY) * 0.001
                    p.line(px, py, px + (Math.sin(q.angle + distortion) * q.len), py + (Math.cos(q.angle + distortion) * q.len))
                }
            }
        }
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
        id: 'h5',
        name: 'panels',
        onChange: ()=> c.genFrame(),
        inputs: {
            gridX: {
                desc: 'horizontal items',
                type: 'integer',
                min: 1,
                max: 100,
                value: 50
            },
            gridY: {
                desc: 'vertical items',
                type: 'integer',
                min: 1,
                max: 100,
                value: 50
            },
            angle: {
                desc: 'angle',
                type: 'float',
                min: 0,
                max: 2 * Math.PI,
                step: 0.000125,
                value: 1,
            },
            length: {
                desc: 'length',
                type: 'float',
                step: 1,
                min: 0,
                max: 500,
                value: 100
            },
            asymmetry: {
                desc: 'asymmetry',
                type: 'float',
                step: 0.01,
                min: 0.0001,
                max: 2,
                value: 1.2
            },
            brush: {
                desc: 'brush',
                type: 'float',
                step: 0.001,
                min: 0,
                max: 10,
                value: 1
            },
            fore: {
                desc: 'foreground color',
                type: 'integer',
                min: 0,
                max: 15,
                value: 15
            },
            pad: {
                desc: 'pad',
                type: 'integer',
                min: 0,
                max: 100,
                value: 60
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
            {"name":"ver #000 - hair","values":{"gridX":100,"gridY":100,"angle":1,"length":100,"asymmetry":1.2,"brush":0.469,"fore":15,"pad":64,"back":1}},
            {"name":"ver #001 - eww","values":{"gridX":47,"gridY":37,"angle":1,"length":100,"asymmetry":1.2,"brush":1.694,"fore":15,"pad":63,"back":1}},
            {"name":"ver #002 - short","values":{"gridX":100,"gridY":99,"angle":0.1795,"length":40,"asymmetry":1.1701,"brush":0.184,"fore":15,"pad":60,"back":1}}
        ]

    }

    return Stripes;
});
