/**
 * DFS anim
 */
define(['frame', 'underscore', '../graph'], (c, _, Graph)=>{
    'use strict'

    let isPlaying = true;
    let DFS = function (p) {
        // Defaults
        p.properties = _.extend({}, DFS.prototype.properties)

        let z = 0
        let continuePromise, reset
        const DFS_COLOR = c.c.p[5]

        // Setup may be somewhere else... Also do not use c.
        p.setup = async function () {
            DFS.initDrawing();
            c.info('algo', 'dfs tri 1')
            DFS.reset()
        }

        DFS.step = async function step(){
            return new Promise((success, reject)=>{
                if (isPlaying){
                    setTimeout(()=> !p.stopTheRock ? success() : false, 50)
                }
                continuePromise = success
                reset = reject
            })
        }
        DFS.start = function() {
            isPlaying = true;
            if (continuePromise) continuePromise()
        }
        DFS.stop = function() {
            isPlaying = false;
        }
        DFS.reset = function() {
            DFS.stop()
            if (reset) reset()
            p.clear()
            isPlaying = true;
            let n = p.properties.inputs.n.value

            p.baseGraph = initTriGraph(n)
            p.staringPoint = Math.floor( n / 2 )
            p.path = []
            p.endPoints = []
            p.weirdPathElements = []
            z = 0
            DFS.initDrawing()

            // Draws the initial graph for debugging.
            drawGraphGrid(p.baseGraph, p)
            drawDot(p.baseGraph.points[p.staringPoint], DFS_COLOR)
            p.endPoints.push(p.staringPoint)
            dfs(p.baseGraph, p.staringPoint, p.staringPoint, [])
        }

        DFS.initDrawing = function(){
            p.createCanvas(c.x, c.y)
            p.bg = p.createGraphics(c.w, c.h)
            p.algoLayer = p.createGraphics(c.w, c.h);
            p.dotLayer = p.createGraphics(c.w, c.h);
        }

        DFS.redraw = function(){
            z = 0
            p.clear();
            DFS.initDrawing();
            // Draw starting point.
            // drawDot(p.baseGraph.points[0], p.color(0, 128, 0))
            drawGraphGrid(p.baseGraph, p)
            redrawGraph(p)
            p.image(p.algoLayer, 0, 0)
            p.image(p.dotLayer, 0, 0)
        }

        function redrawGraph(p){
            p.path.map((edges)=>drawEdge(p.baseGraph, edges, p, DFS_COLOR))
            p.endPoints.map((point)=>drawDot(p.baseGraph.points[point], DFS_COLOR))
        }

        async function dfs(baseGraph, startingPoint, pointBefore){
            baseGraph.points[startingPoint].visited = true
            let notVisitedNeighbors = []
            let angle = getAngle(baseGraph.points[pointBefore], baseGraph.points[startingPoint]);

            if (!baseGraph.getNotVisitedNeighbors(baseGraph.points[startingPoint]).length)
            {
                p.endPoints.push(startingPoint)
                drawDot(baseGraph.points[startingPoint], DFS_COLOR)
                return;
            }

            // order not visited neighbors left to right

            let n = 0
            while ((notVisitedNeighbors = baseGraph.getNotVisitedNeighbors(baseGraph.points[startingPoint])).length){
                let nextNode = Math.floor(Math.random() * notVisitedNeighbors.length)
                // Depending on the angle and the distribution, we go left or right.
                // Todo: add 180, order from left to right, then decide.

                p.path.push([startingPoint, notVisitedNeighbors[nextNode]])
                drawEdge(baseGraph, [startingPoint, notVisitedNeighbors[nextNode]], p, DFS_COLOR)
                // drawDot(baseGraph.points[startingPoint], p.color(128, 128, 0))
                // Draw it
                p.image(p.algoLayer, 0, 0)
                p.image(p.dotLayer, 0, 0)
                await DFS.step()
                await dfs(baseGraph, notVisitedNeighbors[nextNode], startingPoint)
            }
            p.image(p.algoLayer, 0, 0)
            p.image(p.dotLayer, 0, 0)
        }


        function drawDot(point, color){
            p.dotLayer.stroke(color)
            p.dotLayer.strokeWeight(p.properties.inputs.strokeWidth.value / 2)
            p.dotLayer.fill(c.c.b)
            p.dotLayer.circle(point.x, point.y,
                p.properties.inputs.strokeWidth.value * p.properties.inputs.dotSize.value)

            //     p.dotLayer.fill(p.color(200, 200, 200))
            // p.dotLayer.strokeWeight(0)
            // p.dotLayer.text(z++, point.x, point.y)
        }

        // Let's see the angle we were going
        function getAngle(fromPoint, toPoint){
            let rad = Math.atan2(toPoint.y - fromPoint.y, toPoint.x - fromPoint.x);
            // console.log('angle', toPoint.y - fromPoint.y, toPoint.x - fromPoint.x,  rad * 180 / Math.PI)
            return rad * 180 / Math.PI
        }

        /**
         * @param {Integer} n
         */
        function initTriGraph(n){
            let graph = new Graph(),
                xU = c.w / n,
                sqrt3per2 = Math.sqrt(3) / 2,
                baseY = n * (1-sqrt3per2) * xU / 2

            let pts = 0

            for(let y = 0; y < n; y++) {
                console.log(pts, n - y)
                for(let x = 0; x < n - y; x++){
                    graph.addPoint({x: (x + 0.5) * xU + (y * xU / 2), y: baseY + ((y + 0.5) * xU * sqrt3per2)})
                    pts++
                }
            }

            let lineIndexStaringPoint = 0
            for(let y = 0; y < n - 1; y++) {
                for(let x = 0; x < n - y - 1; x++){
                    graph.addEdge(lineIndexStaringPoint + x, lineIndexStaringPoint + x + 1) // x axis
                    graph.addEdge(lineIndexStaringPoint + x, lineIndexStaringPoint + n - y + x) // x axis
                    graph.addEdge(lineIndexStaringPoint + x + 1, lineIndexStaringPoint + n - y + x) // x axis
                }
                lineIndexStaringPoint += n - y
            }

            return graph
        }

        /**
         * Each point is an element of the matrix
         * @param {Graph} g
         */
        function drawGraphGrid(g, p){

            // Create a new layer
            let grid = p.bg

            // Nodes
            for(let i = 0; i < g.points.length; i++){
                grid.push()
                grid.translate(g.points[i].x, g.points[i].y)
                let color = p.color(c.c.p[3])
                // color.setAlpha(128)
                grid.fill(color)
                grid.circle(0, 0, 10)
                grid.pop()
            }

            // Edges
            let strokeColor = p.color(c.c.p[4])
            strokeColor.setAlpha(10)
            grid.stroke(strokeColor)
            grid.strokeWeight(3)
            let drawnEdges = {}
            for(let i = 0; i < g.points.length; i++){
                for(let edgeIndex = 0; edgeIndex < g.points[i].neighbors.length; edgeIndex++) {
                    let edge = g.points[i].neighbors[edgeIndex]
                    if (!drawnEdges[`${edgeIndex}-${i}`]){
                        grid.line(g.points[i].x, g.points[i].y, g.points[edge].x, g.points[edge].y)
                        drawnEdges[`${i}-${edgeIndex}`] = true
                    }
                }
            }
            p.bg.tint(1, 1)
            p.image(p.bg, 0, 0)
        }

        /**
         * @param {Array[2]} edge from, to index
         * @param {*} p
         */
        function drawEdge(graph, edge, p, color){
            p.algoLayer.strokeWeight(p.properties.inputs.strokeWidth.value)
            p.algoLayer.stroke(color || c.c.p[12])
            // p.algoLayer.strokeCap(p.PROJECT)
            p.algoLayer.line(
                graph.points[edge[0]].x, graph.points[edge[0]].y,
                graph.points[edge[1]].x, graph.points[edge[1]].y
            )
            p.algoLayer.fill(c.c.p[0])
        }
    };

    DFS.prototype.properties = {
        id: 'algo1-tri',
        name: 'dfs',
        reset: ()=>DFS.reset(),
        inputs: {
            n: {
                desc: 'n',
                type: 'integer',
                min: 1,
                max: 100,
                value: 25,
                onChange: ()=>DFS.reset()
            },
            strokeWidth: {
                desc: 'stroke width',
                type: 'integer',
                min: 1,
                max: 50,
                value: 8,
                onChange: ()=>DFS.redraw()
            },
            dotSize: {
                desc: 'dot size',
                type: 'float',
                min: 0,
                max: 3,
                step: 0.01,
                value: 2,
                onChange: ()=>DFS.redraw()
            },
            // bgOpacity: {
            //     desc: 'bg opacity',
            //     type: 'float',
            //     step: 0.01,
            //     min: 0,
            //     max: 1,
            //     value: 0.1,
            //     onChange: ()=>DFS.redraw()
            // },
            // turnOrStraight: {
            //     desc: 'turn likelyness',
            //     type: 'float',
            //     step: 0.0125,
            //     min: 0,
            //     max: 1,
            //     value: 0.3
            // },
            // leftOrRight: {
            //     desc: 'left or right?',
            //     type: 'float',
            //     min: 0,
            //     max: 1,
            //     value: 0.5
            // },
            speed: {
                desc: 'frame reder time',
                type: 'float',
                min: 0,
                max: 4000,
                value: 2000
            },
            start: {
                type: 'button',
                text: '►',
                action: ()=>DFS.start()
            },
            stop: {
                type: 'button',
                text: '■',
                action: ()=>DFS.stop()
            },
            reset: {
                type: 'button',
                text: '×',
                action: ()=>DFS.reset()
            }
        },
        presets: [
            {"name":"ver #014","values":{"n":22,"strokeWidth":10,"dotSize":2.14,"bgOpacity":0.1,"turnOrStraight":0.3,"leftOrRight":0.5,"speed":2000}}
        ]
    }

    return DFS;
});
