/**
 * inka wall generator
 */
 define(['frame', 'underscore', 'p5', '../../js/vendor/seedrandom'], (c, _, p5)=>{
    'use strict'

    let InkaWall = function (p) {
        // Defaults
        p.properties = _.extend({}, InkaWall.prototype.properties)

        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(10)
            c.info(9, 'inka')
        }

        function random(min, max) {
            return Math.random() * (max - min) + min;
        }

        function drawInkaWall() {
            Math.seedrandom(0);
            const height = c.h * 0.9;
            const width = c.w * 0.9;

            const range = p.properties.inputs.edges.value;
            const sizeX = p.properties.inputs.gridXs.value;
            const sizeY = p.properties.inputs.gridYs.value;

            let stones = [];

            let y = 0;
            while (y < height) {
                let x = 0;
                let rowMaxHeight = 0;

                while (x < width) {
                    let stoneW = random(50, 50 + sizeX);
                    let stoneH = random(40, 40 + sizeY);
                    stones.push({ x, y, w: stoneW, h: stoneH, range });

                    x += stoneW; // no subtraction
                    rowMaxHeight = Math.max(rowMaxHeight, stoneH);
                }

                y += rowMaxHeight / 3 * 2; // no subtraction
            }

            stones.sort(() => Math.random() - 0.5);

            for (let stone of stones) {
                drawCurvedStone(stone.x, stone.y, stone.w, stone.h, stone.range);
            }
        }

        function drawCurvedStone(x, y, w, h, range) {
            const color = c.c.p[Math.floor(random(4, 9))]

            p.fill(color);

            // limit range to avoid overflowing bounds
            const r = Math.min(range, w * 0.2, h * 0.2);

            p.beginShape();
            p.curveVertex(x + random(-r, r), y + random(-r, r));
            p.curveVertex(x + w * 0.5 + random(-r, r), y + random(-r, r));
            p.curveVertex(x + w + random(-r, r), y + random(-r, r));
            p.curveVertex(x + w + random(-r, r), y + h + random(-r, r));
            p.curveVertex(x + w * 0.5 + random(-r, r), y + h + random(-r, r));
            p.curveVertex(x + random(-r, r), y + h + random(-r, r));
            p.curveVertex(x + random(-r, r), y + random(-r, r));
            p.endShape(p.CLOSE);
        }


        p.draw = function draw () {

            // p.circle(c.cx, c.cy, c.w * 0.9)
            p.stroke(0.01)
            p.strokeWeight(0.1)
            drawInkaWall()

            // p.background(p.BACK)
            // p.stroke(0)
            // p.strokeWeight(0)

        }
    };

    InkaWall.prototype.properties = {
        id: 'i1',
        name: 'inka',
        inputs: {
            gridX: {
                desc: 'horizontal items',
                type: 'integer',
                min: 1,
                max: 10,
                value: 5
            },
            gridY: {
                desc: 'vertical items',
                type: 'integer',
                min: 1,
                max: 10,
                value: 5
            },
            gridXs: {
                desc: 'sizeX',
                type: 'integer',
                min: 0,
                max: 90,
                value: 50
            },
            gridYs: {
                desc: 'sizeY',
                type: 'integer',
                min: 0,
                max: 60,
                value: 40
            },
            sizeMultiplier: {
                desc: 'size correction',
                type: 'float',
                step: 0.0125,
                min: 0,
                max: 280,
                value: 260
            },
            edges: {
                desc: 'edges',
                type: 'integer',
                min: 0,
                max: 20,
                value: 10
            },
            angle: {
                desc: 'offset',
                type: 'float',
                step: 0.00001,
                min: 0,
                max: Math.PI / 4,
                value: 0
            }
        },
        presets: [
        ]

    }

    return InkaWall;
});
