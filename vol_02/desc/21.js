/**
 * Cogs
 */
define(['frame', 'underscore', '../../js/vendor/seedrandom'], (c, _)=>{
    'use strict'
    let Cf = function (p) {
        Math.seedrandom(0);

        p.properties = _.extend({}, Cf.prototype.properties)

        let BACK = p.color(c.c.b)

        const MAX_COLLISIONS = 5

        let mainTree;

        p.setup = function () {
            p.createCanvas(c.x, c.y)
            p.frameRate(20)
            c.info('cg0', 'cog')

            p.background(BACK)
            p.noFill()

            mainTree = {index: 0, level: 0, a: 0, r: 0.3, x: 0, y: 0, children: []}
            mainTree = buildTree(mainTree, 2, 2, mainTree)
            p.draw()
        }


        function buildTree (currentNode, depth, branches, tree) {
            if (depth > 0) {
                for (let i = 0; i < branches; i++) {
                    const newNode = newCircle(currentNode, tree, depth, i)
                    if (!newNode) { continue; }
                    currentNode.children.push(newNode);
                    buildTree(newNode, depth - 1, branches, tree)
                }
            }
            return currentNode
        }

        function newCircle (node, tree, depth, index) {
            let props = getRandomAlignment(node, tree, index, depth)
            if (!props) { return false }
            drawCircle(_.extend(props, {level: depth, index}))
            return {
                a: props.a,
                r: props.r,
                x: props.x,
                y: props.y,
                level: depth,
                color: props.color,
                index: index,
                children: []
            }
        }

        // If it collides, reduce the size to which it collides with
        function getRandomAlignment (node, tree, index, depth) {
            // Pick a spot if there are no other children.
            let r = node.r * Math.random() / 2 + (node.r / 2);
            let a = Math.random() * p.TWO_PI
            let a0, a1;
            if (!node.children.length) {
                return getNodeCoordinates(node, a, r)
            }

            if (node.children.length === 1) {
                // Pick a spot outside of the range:
                let a = node.children[0].a
                let r = node.r * Math.random();
                // Delta a: the alpha that is occupied by the circle
                let da = Math.sinh(r / (node.r + r))
                a0 = a + da
                a1 = a + p.TWO_PI - da
            } else {
            // If there are other children, pick one node randomly, and place the circle right to it and between the next.
                let childCircles = _.sortBy(node.children, 'a')
                let rightFromThisCircle = c.pickRandom(childCircles)
                let index = childCircles.indexOf(rightFromThisCircle)
                let leftFromThisCircle = childCircles[(index + 1) % childCircles.length]
                let da0 = Math.sinh(rightFromThisCircle.r / (rightFromThisCircle.r + node.r))
                let da1 = Math.sinh(leftFromThisCircle.r / (leftFromThisCircle.r + node.r))
                a0 = rightFromThisCircle.a + da0;
                a1 = leftFromThisCircle.a - da1
                if (a1 < a0) { a1 += p.TWO_PI }
            }

            a = Math.random() * (a1 - a0) + a0

            let newNodePosition = getNodeCoordinates(node, a, r)
            let allNonCollidingCirclesSoFar = getAllFlatCircles(tree)

            // console.log('-------< finding new place for', depth + '-' + index)

            newNodePosition = getNewCirclePosition(node, allNonCollidingCirclesSoFar, newNodePosition, r, a, index, depth);
            if (!newNodePosition) {
                // console.log('----- > Max collisions reached, skipping')
                return
            }
            // console.log('----- > inserting', depth + '-' + index, r, a)
            return newNodePosition
        }

        function getNewCirclePosition (node, allNonCollidingCirclesSoFar, newNodePosition, r, a, index, depth) {
            // let altColor = `rgb(0, 150, ${index * 50})`
            let altColorGreen = `rgb(0, 200, ${index * 50})`

            let tries = 0
            // see if it collides
            for (let i = 0; i < allNonCollidingCirclesSoFar.length; i++) {
                // Does Collide with currently selected?
                const d = getDistanceToNode(newNodePosition, allNonCollidingCirclesSoFar[i])
                // console.log('distance between the two centers: ',
                //     p.dist(newNodePosition.x, newNodePosition.y,
                //         allNonCollidingCirclesSoFar[i].x, allNonCollidingCirclesSoFar[i].y))
                // console.log('r + r = ', newNodePosition.r + allNonCollidingCirclesSoFar[i].r)
                if (d < 0) {
                    // drawLine(newNodePosition, allNonCollidingCirclesSoFar[i], 'red')
                    // Reduce the R with
                    // console.log('collision', depth + '-' + index, 'to',
                    //     allNonCollidingCirclesSoFar[i].level + '-' + allNonCollidingCirclesSoFar[i].index)
                    // console.log('distance', d)
                    // console.log(`${newNodePosition.x}-${newNodePosition.y}`, newNodePosition.r)
                    // console.log(`${allNonCollidingCirclesSoFar[i].x}-${allNonCollidingCirclesSoFar[i].y}`, allNonCollidingCirclesSoFar[i].r)
                    r = Math.max(r + Math.max(d, -0.1), 0.0001)
                    newNodePosition = getNodeCoordinates(node, a, r)
                    newNodePosition.color = altColorGreen

                    // drawCircle(_.extend(newNodePosition, {level: depth, index: index}), altColor)
                    tries++
                    if (tries > MAX_COLLISIONS) { return false }

                    // Jajj.
                    i = -1
                }
            }
            return newNodePosition
        }

        function getDistanceToNode (node1, node2) {
            return p.dist(node1.x, node1.y, node2.x, node2.y) - ((node1.r + node2.r) / 2)
        }

        function getNodeCoordinates (node, a, r) {
            return {
                a, r,
                x: node.x + (Math.sin(a) * (r + node.r) / 2),
                y: node.y + (Math.cos(a) * (r + node.r) / 2)
            }
        }

        function getAllFlatCircles (node) {
            let circles = []
            for (let ci = 0; ci < node.children.length; ci++) {
                circles.push(node.children[ci])
                circles = circles.concat(getAllFlatCircles(node.children[ci]))
            }
            return circles
        }

        function drawTree (node, fi) {
            drawCircle(node, false, fi)
            for (let i = 0; i < node.children.length; i++) {
                let fic = node.r / node.children[i].r * -fi
                drawTree(node.children[i], fic)
            }
        }

        function drawCircle (node, color, fi) {
            var col = color || node.color || c.c.p[15 - (node.level * 2)]
            let x = c.cx + node.x * c.w
            let y = c.cy + node.y * c.h

            switch (Cf.prototype.properties.inputs.elements.value) {
                case 0:
                    p.textAlign(p.CENTER, p.CENTER)
                    p.text(`${node.level}-${node.index}`, x, y)
                    p.noFill()
                    p.strokeWeight(1)
                    p.stroke(col)
                    p.circle(x, y, node.r * c.w);
                    break;
                case 1:
                    p.fill(col)
                    p.circle(x, y, node.r * c.w);
                    break;
                case 2:
                    p.fill(col)
                    p.circle(x, y, node.r * c.w);
                    p.fill(c.c.b)
                    cog(x, y, node.r, 12, fi)
                    break;
                case 3:
                    p.fill(col)
                    cog(x, y, node.r, 12, fi)
                    break;
            }
        }

        function cog (x, y, r, n, a0) {
            const da = p.TWO_PI / n

            p.translate(x, y)
            p.beginShape();

            for (let i = 0; i < n; i++) {
                let r0 = r * 0.9
                let ca = a0 + (da * i)
                let x = Math.sin(ca) * r0 / 2;
                let y = Math.cos(ca) * r0 / 2;
                let xn = Math.sin(ca + (da / 2)) * r0 / 2;
                let yn = Math.cos(ca + (da / 2)) * r0 / 2;
                p.vertex(0, 0)
                p.vertex(x * c.w, y * c.w)
                p.vertex(xn * c.w, yn * c.w)
            }

            p.endShape(p.CLOSE)
            p.resetMatrix()
        }

        var fi = 0

        // function drawLine (node1, node2, color) {
        //     p.stroke(color || c.c.p[15])
        //     p.strokeWeight(1);
        //     p.line((node1.x + 0.5) * c.w, (node1.y + 0.5) * c.h, (node2.x + 0.5) * c.w, (node2.y + 0.5) * c.h)
        // }


        p.draw = function draw () {
            p.background(BACK)
            p.noFill()
            p.strokeWeight(0)
            fi += p.deltaTime / 1000
            drawTree(mainTree, fi)
        }

        Cf.onChange = function () {
            console.log('rebuilding tree')
            mainTree = {index: 0, level: 0, a: 0, r: Cf.prototype.properties.inputs.ratio.value, x: 0, y: 0, children: []}
            mainTree = buildTree(mainTree, Cf.prototype.properties.inputs.levels.value, Cf.prototype.properties.inputs.spawn.value, mainTree)
            p.draw()
        }
    };


    Cf.prototype.properties = {
        id: 'cf2',
        name: 'circle cogs',
        playPause: true,
        inputs: {
            levels: {
                desc: 'levels',
                type: 'integer',
                min: 0,
                max: 8,
                value: 2,
                onChange: ()=>Cf.onChange()
            },
            spawn: {
                desc: 'spawns',
                type: 'integer',
                min: 1,
                max: 8,
                value: 2,
                onChange: ()=>Cf.onChange()
            },
            ratio: {
                desc: 'ratio',
                type: 'float',
                step: 0.001,
                min: 0.001,
                max: 1,
                value: 0.3
            },
            elements: {
                desc: 'elements',
                type: 'integer',
                min: 0,
                max: 3,
                value: 1
            }
            // rc: {
            //     desc: 'rc',
            //     type: 'float',
            //     step: 0.01,
            //     min: 0.01,
            //     max: 10,
            //     value: 1
            // },
            // dist: {
            //     desc: 'dist',
            //     type: 'float',
            //     step: 0.1,
            //     min: -5,
            //     max: 5,
            //     value: 1
            // }


        },
        presets: [
            {'name': 'ver #000', 'values': {'levels': 6, 'spawn': 2, 'ratio': 0.3, 'elements': 2}}
        ]
    }

    return Cf;
});
