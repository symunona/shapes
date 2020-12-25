/**
 * La Fiesta
 */
define(['frame', 'underscore'], (c, _)=>{
    'use strict'
    const randomLength = 50

    let Fiesta = function (p) {
        p.properties = _.extend({}, Fiesta.prototype.properties)

        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(30)
            c.info('la', 'fiesta')
            p.draw()
        }

        p.colorMode(p.HSB) // Hue Sat Bri
        let randoms = _.range(randomLength).map(()=>(Math.random() - 0.5))

        let offset = 0

        p.draw = function draw () {
            let BACK = p.color(c.c.b)

            p.background(BACK)
            p.stroke(0)
            p.strokeWeight(0)

            let lines = p.properties.inputs.lines.value
            let lamps = p.properties.inputs.lamps.value
            let angleVariance =  p.properties.inputs.angle.value;
            let lampSize = p.properties.inputs.lampSize.value
            let lightChange = p.properties.inputs.lightChange.value
            let lampSizeVariance = p.properties.inputs.lampSizeVariance.value
            let lampOffsetVariance = p.properties.inputs.lampOffsetVariance.value
            let colorRange = p.properties.inputs.colorRange.value
            let hue = p.properties.inputs.hue.value
            let streetWidth = p.properties.inputs.streetWidth.value
            

            let rangeY = (c.h / 3 * 2)

            offset += (p.deltaTime * 0.001);

            let integerOffset = Math.floor(offset);
            let normalizedOffset = offset % 1 / lines

            // How many lines across?
            for (let li = 0; li < lines; li++) {
                p.push()

                // 0 - 1 - a parabola shifted 1 right
                let yn = Math.pow(((((li)/lines) - normalizedOffset)) - 1, 4)
                let y = rangeY - (rangeY * yn) + (-1/9 * c.h)
                let w = (c.w * yn * streetWidth)
                let lampStep = w / lamps;

                let lineColorI = Math.floor((lines - li) / lines / 2 * 16) % 16
                
                let off = (lines - li) / lines * 128;

                let lineColor = p.color(0, 0, off / 2)

                p.fill(lineColor)

                p.translate(c.w / 2, y)
                p.rotate(randoms[(li + integerOffset) % randomLength] * angleVariance)
                p.rect(-w/2, 0, w, 3 * (lines - li) / lines)

                

                // Draw the lamps
                for(let la = 0; la < lamps; la++){
                    let randomKey = (la * 16 + li + integerOffset) % randomLength

                    let lampColorI = p.color((
                        (randoms[randomKey] + 0.5) * colorRange + hue + (Math.sin(offset) * colorRange  * lightChange)) % 1 * 255, 
                        off, off / 3 * 2)
                    let randomOffset = randoms[randomKey] * lampOffsetVariance

                    p.fill(lampColorI)

                    let randomLampSize = yn * (lampSize + (randoms[randomKey] * lampSizeVariance))

                    p.circle(-w/2 + ((la + 0.5 + randomOffset) * lampStep), randomLampSize, randomLampSize)
                }

                p.pop()
            }
        }
    };

    Fiesta.prototype.properties = {
        id: 'fiesta',
        name: 'fiesta',
        inputs: {
            lines: {
                desc: 'lines',
                type: 'integer',
                min: 1,
                max: 50,
                value: 32
            },
            lamps: {
                desc: 'lamps',
                type: 'integer',
                min: 1,
                max: 50,
                value: 11
            },
            angle: {
                desc: 'angle variance',
                type: 'float',
                min: 0.0001,
                max: 2,
                value: 0.33,
                step: 0.001
            },
            lampSize: {
                desc: 'lamp size',
                type: 'float',
                min: 0,
                max: 40,
                value: 20,
                step: 1
            },
            lampSizeVariance: {
                desc: 'lamp size variance',
                type: 'float',
                min: 0,
                max: 30,
                value: 1,
                step: 0.1
            },
            lampOffsetVariance: {
                desc: 'lamp offset variance',
                type: 'float',
                min: 0,
                max: 5,
                value: 0.7,
                step: 0.01
            },
            lightChange: {
                desc: 'lamp color variance sin',
                type: 'float',
                min: 0,
                max: 1,
                value: 0.2,
                step: 0.01
            },
            colorRange: {
                desc: 'color range',
                type: 'float',
                min: 0,
                max: 1,
                value: 0.2,
                step: 0.01
            },
            hue: {
                desc: 'hue offset',
                type: 'float',
                min: 0,
                max: 1,
                value: 0,
                step: 0.01
            },
            streetWidth: {
                desc: 'street width',
                type: 'float',
                min: 0,
                max: 3,
                value: 1.4,
                step: 0.01
            }
        }
    }


    return Fiesta;
});
