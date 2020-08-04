/**
 * Sails
 */
define(['frame', 'underscore'], (c, _)=>{
    'use strict'
    let Sails  =  function (p) {

        p.properties = _.extend({}, Sails.prototype.properties)

        let BACK = p.color(c.c.b)

        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(30)
            c.info('s0', 'sails')
        }

        p.draw = function draw () {
            p.background(BACK)
            p.stroke(0)
            p.strokeWeight(0)
            p.fill(c.c.f)
            let bodyRatio = p.properties.inputs.body.value
            let padding = p.properties.inputs.padding.value
            let diffPadding = p.properties.inputs.diffPadding.value

            let arboc =  { x: p.mouseX, y: 0 }
            let front =  { x: 0, y: p.mouseY }
            let back =   { x: c.w , y: p.mouseY }
            let bottom = { x1: c.w / bodyRatio, x2: c.w * (bodyRatio - 1) / bodyRatio, y: c.h }

            //     x
            //    /|\
            //   g | f
            //  /__|__\
            //  ___|___
            //  \__b__/
            //  x1    x2


            let gTop = {
                x: arboc.x - padding,
                y: arboc.y,
            }
            let gFront = {
                x: gTop.x,
                y: back.y - padding
            }
            let gBack = {
                x: 0,
                y: gFront.y
            }


            let fTop = {
                x: arboc.x + padding,
                y: arboc.y + (p.mouseX / c.w * diffPadding),
            }
            let fFront = {
                x: c.w,
                y: gFront.y
            }
            let fBack = {
                x: fTop.x,
                y: fFront.y
            }

            // Sails
            let g = [
                gTop.x, gTop.y,
                gFront.x, gFront.y,
                gBack.x, gBack.y
            ]

            let f = [
                fTop.x, fTop.y,
                fFront.x, fFront.y,
                fBack.x, fBack.y
            ]

            // Body
            let b = [
                front.x, front.y + padding,
                back.x, back.y + padding,
                bottom.x2, bottom.y,
                bottom.x1, bottom.y
            ]

            p.triangle.apply(p, g)
            p.triangle.apply(p, f)
            p.quad.apply(p, b)
        }
    };


    Sails.prototype.properties = {
        id: 'b3',
        name: 'panels',
        inputs: {
            padding: {
                desc: 'padding',
                type: 'float',
                step: 0.1,
                min: 0,
                max: 100,
                value: 5
            },
            diffPadding: {
                desc: 'sail diff',
                type: 'float',
                step: 0.1,
                min: 0,
                max: 400,
                value: 200
            },
            body: {
                desc: 'body-ratio',
                type: 'float',
                step: 0.1,
                min: 2,
                max: 10,
                value: 4
            }
        },
        presets: [
            {"name":"ver #000","values":{"padding":14.8,"diffPadding":287.6,"body":2.8}},
            {"name":"ver #001","values":{"padding":7,"diffPadding":144.8,"body":2.8}}
        ]
    }

    return Sails;
});
