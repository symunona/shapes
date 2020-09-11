/**
 * DFS anim
 */
define(['frame', 'underscore', '../graph'], (c, _, Graph)=>{
    'use strict'
    let DFS = function (p) {
        // Defaults
        p.properties = _.extend({}, DFS.prototype.properties)

        let size = 10, size2 = size / 2

        // Setup may be somewhere else... Also do not use c.
        p.setup = async function () {
            p.createCanvas(c.x, c.y)
            c.info('algo', 'dfs rect')

            let gridX = p.properties.inputs.gridX.value,
                gridY = p.properties.inputs.gridY.value
            let graph = initRectGraph(gridX, gridY)
            p.graph = graph
            p.staringPoint = Math.floor( gridX / 2 )

            // Draws the initial graph for debugging.
            drawGraph(graph, p)
            dfs(graph, p.staringPoint)
        }

        // function restart(){
        //     p.stopTheRock = true
        //     p.createCanvas(c.x, c.y)
        // }

        async function step(){
            return new Promise((success)=>setTimeout(()=>!p.stopTheRock?success():false, 50))
        }

        async function dfs(g, startingPoint){
            g.points[startingPoint].visited = true
            let path = [], notVisitedNeighbors = []
            while ((notVisitedNeighbors = g.getNotVisitedNeighbors(g.points[startingPoint])).length){

                let nextNode = Math.floor(Math.random() * notVisitedNeighbors.length)

                path.push([startingPoint, notVisitedNeighbors[nextNode]])
                drawEdge(g, [startingPoint, notVisitedNeighbors[nextNode]], p)
                await step()
                path = path.concat(await dfs(g, notVisitedNeighbors[nextNode]))
            }
            return path
        }

        /**
         * @param {Integer} gridX
         * @param {Integer} gridY
         */
        function initRectGraph(gridX, gridY){
            let map = [], i = 0,
                graph = new Graph(),
                xU = c.w / gridX,
                yU = c.h / gridY

            for(let y=0; y<gridY; y++) {
                map[y] = []
                for(let x=0; x<gridX; x++){
                    graph.addPoint(map[y][x] = {x: (x + 0.5) * xU, y: (y + 0.5) * yU})
                }
            }
            // Create the net!
            for(let y=0; y<gridY; y++) {
                for(let x=0; x<gridX-1; x++){
                    graph.addEdge(y * gridX + x, y*gridX + x + 1) // x axis
                }
            }
            for(let y=0; y<gridY-1; y++) {
                for(let x=0; x<gridX; x++){
                    graph.addEdge(y * gridX + x, ((y + 1) * gridX) + x) // y axis
                }
            }
            return graph
        }

        /**
         * Each point is an element of the matrix
         * @param {Graph} g
         */
        function drawGraph(g, p){
            // Nodes
            for(let i = 0; i < g.points.length; i++){
                p.push()
                p.translate(g.points[i].x, g.points[i].y)
                p.fill(c.c.p[3])
                p.pop()
            }

            // Edges
            p.stroke(c.c.p[4])
            p.strokeWeight(3)
            let drawnEdges = {}
            for(let i = 0; i < g.points.length; i++){
                for(let edgeIndex = 0; edgeIndex < g.points[i].neighbors.length; edgeIndex++) {
                    let edge = g.points[i].neighbors[edgeIndex]
                    if (!drawnEdges[`${edgeIndex}-${i}`]){
                        p.line(g.points[i].x, g.points[i].y, g.points[edge].x, g.points[edge].y)
                        drawnEdges[`${i}-${edgeIndex}`] = true
                    }
                }
            }
        }

        /**
         * @param {Array[2]} edge from, to index
         * @param {*} p
         */
        function drawEdge(graph, edge, p){
            p.strokeWeight(size)
            p.stroke(c.c.p[12])
            p.line(
                graph.points[edge[0]].x, graph.points[edge[0]].y,
                graph.points[edge[1]].x, graph.points[edge[1]].y
            )
            p.fill(c.c.p[0])
        }
    };

    DFS.prototype.properties = {
        id: 'algo1',
        name: 'dfs',
        // buttons: {
        //     restart: DFS.restart
        // },
        inputs: {
            gridX: {
                desc: 'horizontal items',
                type: 'integer',
                min: 1,
                max: 100,
                value: 30
            },
            gridY: {
                desc: 'vertical items',
                type: 'integer',
                min: 1,
                max: 100,
                value: 30
            },
            turnOrStraight: {
                desc: 'turn likelyness',
                type: 'float',
                step: 0.0125,
                min: 0,
                max: 1,
                value: 0.3
            },
            leftOrRight: {
                desc: 'left or right?',
                type: 'float',
                min: 0,
                max: 1,
                value: 0.5
            },
            speed: {
                desc: 'frame reder time',
                type: 'float',
                min: 0,
                max: 4000,
                value: 2000
            },
        },
        presets: [
        ]

    }

    return DFS;
});
