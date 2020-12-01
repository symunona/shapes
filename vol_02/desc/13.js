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
        }

        let randoms = _.range(randomLength).map(()=>(Math.random() - 0.5) / 3)
        let colors = _.range(randomLength).map(()=>
            p.color(Math.random() * 255, Math.random() * 255, Math.random() * 255))

        p.draw = function draw () {
            let BACK = p.color(c.c.b)

            p.background(BACK)
            p.stroke(0)
            p.strokeWeight(0)

            let lines = p.properties.inputs.lines.value
            let lamps = p.properties.inputs.lamps.value
            let square = Math.pow(lines, 2)
            let yd = c.h / 3 * 2 / square

            let multi = 30

            // How many lines across?
            for (let li = 0; li < lines; li++) {
                p.push()

                p.translate(0, (c.h / 3 * 2)-(li * yd * li))

                p.rotate(randoms[li])

                let lineColorI = Math.floor((li) / lines / 3 * 16) % 16
                let lineColor = p.color(c.c.p[lineColorI])
                p.fill(lineColor)

                let x = ( lines - li ) * c.w / lines / 2
                let w = c.w - ( 2 * x )
                let ld = w / lamps;

                p.rect(x, 0, w, 3)

                for(let la = 0; la < lamps; la++){
                    let randomKey = ((li + la) * 16) % randomLength
                    let lampColorI = lineColorI + Math.floor( randoms[randomKey]) % c.c.p.length + 1
                    let offset = randoms[randomKey] * 20

                    p.fill(colors[(la + (li * la)) % randomLength])

                    p.circle(x + offset + (la * ld), Math.sqrt(li) * 4,  Math.sqrt(li) * 4)
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
                value: 15
            },
            lamps: {
                desc: 'lamps',
                type: 'integer',
                min: 1,
                max: 50,
                value: 15
            }
        }
    }


    return Fiesta;
});
