/**
 * Mic Mouse
 */
define(['frame', 'underscore', 'p5', 'p5-sound'], (c, _, P5)=>{
    'use strict'
    let Mic = function (p) {
        p.properties = _.extend({}, Mic.prototype.properties)

        let BACK = p.color(c.c.b)
        let mic, fft, peakDetect

        // start the Audio Input.
        let bg = p.color(c.c.b)

        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(60)

            mic = new P5.AudioIn()
            mic.start();

            fft = new P5.FFT();
            fft.setInput(mic);
            peakDetect = new P5.PeakDetect();
            peakDetect.onPeak(()=>{
                console.log('e')
            }, 0.1)

            p.colorMode(p.HSB, 100);

            p.background(BACK)
            c.info('m0', 'mic')
        }

        let ptr = 0, stroke = 1

        p.draw = function draw () {
            // Fade
            bg.setAlpha(Mic.prototype.properties.inputs.alpha.value * 255)
            p.strokeWeight(0)
            p.fill(bg)
            p.rect(0, 0, c.w, c.h)

            // Sound Spectrum
            let spectrum = fft.analyze();
            peakDetect.update(fft)
            let radius0 = Mic.prototype.properties.inputs.center.value * c.cx

            // Beat detection.
            if (peakDetect.isDetected){
                stroke = 10
                p.fill(c.c.p[Mic.prototype.properties.inputs.color.value])
                p.circle(c.cx, c.cy, radius0 - 4)
            } else {
                stroke *= 0.6
            }

            p.stroke(c.c.p[Mic.prototype.properties.inputs.color.value])
            p.strokeWeight(1)

            p.circle((ptr++ % c.w), c.cy - (mic.getLevel() * 1500), stroke + 1)
            p.fill('#0000')

            p.translate(c.cx, c.cy)

            p.stroke(c.c.f)
            p.beginShape();

            for (let i = 0; i < spectrum.length -1; i++) {
                let a = p.map(i, 0, spectrum.length, 0, p.TWO_PI)
                let pt = rad(a, spectrum[i] + radius0)
              p.vertex(pt.x, pt.y);
            }
            let pt0 = rad(0, spectrum[0] + radius0)
            p.vertex(pt0.x, pt0.y);
            p.endShape();
        }
    };

    function rad(a, d){
        return { x: Math.sin(a) * d, y: Math.cos(a) * d}
    }


    Mic.prototype.properties = {
        id: 'm0',
        name: 'mic input test',
        presets: [],
        inputs: {
            alpha: {
                desc: 'fade',
                type: 'float',
                min: 0,
                max: 1,
                value: 0.01,
                step: 0.001
            },
            center: {
                desc: 'center radius',
                type: 'float',
                min: 0,
                max: 1,
                value: 0.2,
                step: 0.01
            },
            color: {
                desc: 'color',
                type: 'integer',
                min: 0,
                max: 15,
                value: 8
            }
        }
    }

    return Mic;
});
