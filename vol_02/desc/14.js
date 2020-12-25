// AoC 24

define(['frame', 'underscore'], (c, _)=>{
    'use strict'

    const testInput = [{"e":-3,"se":2},{"e":1,"se":-3},{"e":-3,"se":3},{"e":2,"se":-2},{"e":1,"se":-2},{"e":-1,"se":0},{"e":1,"se":-3},{"e":-2,"se":0},{"e":0,"se":-1},{"e":-2,"se":1},{"e":0,"se":-2},{"e":0,"se":-2},{"e":3,"se":-3},{"e":-1,"se":0},{"e":0,"se":2},{"e":0,"se":0},{"e":1,"se":-2},{"e":2,"se":-2},{"e":2,"se":0},{"e":-1,"se":-1}]
    const realInput = [{"e":12,"se":-2},{"e":-4,"se":6},{"e":-15,"se":11},{"e":-11,"se":17},{"e":-12,"se":16},{"e":2,"se":-10},{"e":-16,"se":0},{"e":-3,"se":-4},{"e":-3,"se":15},{"e":-5,"se":0},{"e":-4,"se":-11},{"e":-14,"se":0},{"e":-1,"se":2},{"e":9,"se":6},{"e":-6,"se":10},{"e":-6,"se":8},{"e":3,"se":-9},{"e":15,"se":-1},{"e":17,"se":-17},{"e":-3,"se":-3},{"e":1,"se":-11},{"e":-12,"se":5},{"e":-8,"se":17},{"e":-14,"se":8},{"e":-12,"se":-5},{"e":-6,"se":3},{"e":-1,"se":16},{"e":-4,"se":13},{"e":-13,"se":14},{"e":-7,"se":-1},{"e":-14,"se":2},{"e":7,"se":-16},{"e":-6,"se":1},{"e":-4,"se":8},{"e":7,"se":-17},{"e":11,"se":-1},{"e":17,"se":-14},{"e":0,"se":7},{"e":-8,"se":0},{"e":17,"se":0},{"e":-4,"se":-2},{"e":-7,"se":9},{"e":2,"se":1},{"e":-5,"se":15},{"e":-7,"se":-8},{"e":-10,"se":4},{"e":-9,"se":17},{"e":-5,"se":16},{"e":0,"se":1},{"e":-7,"se":12},{"e":-17,"se":12},{"e":2,"se":-8},{"e":-5,"se":17},{"e":-2,"se":-15},{"e":7,"se":2},{"e":6,"se":7},{"e":-8,"se":9},{"e":3,"se":4},{"e":11,"se":-12},{"e":-2,"se":16},{"e":7,"se":-10},{"e":2,"se":3},{"e":-11,"se":14},{"e":13,"se":-8},{"e":5,"se":12},{"e":-14,"se":-2},{"e":-14,"se":15},{"e":-1,"se":13},{"e":-12,"se":11},{"e":0,"se":-11},{"e":3,"se":13},{"e":5,"se":5},{"e":-1,"se":15},{"e":-1,"se":-7},{"e":12,"se":-7},{"e":-3,"se":-5},{"e":-1,"se":-10},{"e":-13,"se":17},{"e":17,"se":-14},{"e":-11,"se":-2},{"e":9,"se":-12},{"e":-3,"se":-2},{"e":-2,"se":-6},{"e":-5,"se":6},{"e":0,"se":-10},{"e":2,"se":2},{"e":-3,"se":5},{"e":-17,"se":1},{"e":12,"se":-14},{"e":7,"se":-12},{"e":7,"se":-15},{"e":-2,"se":-13},{"e":-12,"se":13},{"e":-3,"se":16},{"e":5,"se":11},{"e":-8,"se":7},{"e":5,"se":-2},{"e":1,"se":-1},{"e":-4,"se":1},{"e":2,"se":9},{"e":14,"se":-16},{"e":4,"se":4},{"e":11,"se":2},{"e":10,"se":4},{"e":9,"se":-9},{"e":1,"se":-15},{"e":-9,"se":8},{"e":8,"se":7},{"e":-1,"se":-1},{"e":-10,"se":15},{"e":10,"se":-13},{"e":-1,"se":-15},{"e":0,"se":8},{"e":-3,"se":14},{"e":5,"se":9},{"e":-16,"se":17},{"e":-9,"se":3},{"e":-2,"se":6},{"e":11,"se":-5},{"e":-9,"se":-7},{"e":1,"se":-4},{"e":7,"se":10},{"e":-13,"se":13},{"e":-10,"se":5},{"e":-6,"se":-9},{"e":-10,"se":17},{"e":9,"se":-13},{"e":-16,"se":6},{"e":4,"se":1},{"e":-1,"se":5},{"e":-16,"se":-1},{"e":-9,"se":2},{"e":-12,"se":9},{"e":15,"se":-1},{"e":6,"se":6},{"e":17,"se":-1},{"e":-2,"se":0},{"e":8,"se":-5},{"e":6,"se":-8},{"e":15,"se":-8},{"e":-3,"se":6},{"e":12,"se":-13},{"e":5,"se":10},{"e":10,"se":-4},{"e":-10,"se":12},{"e":0,"se":11},{"e":-10,"se":14},{"e":-9,"se":0},{"e":4,"se":0},{"e":-2,"se":10},{"e":-8,"se":10},{"e":3,"se":6},{"e":-11,"se":6},{"e":14,"se":-4},{"e":-10,"se":-6},{"e":-9,"se":16},{"e":5,"se":6},{"e":-15,"se":-2},{"e":5,"se":-6},{"e":-11,"se":0},{"e":4,"se":-12},{"e":4,"se":-4},{"e":13,"se":-10},{"e":1,"se":11},{"e":-14,"se":8},{"e":8,"se":-16},{"e":17,"se":-7},{"e":-5,"se":13},{"e":15,"se":-15},{"e":-14,"se":14},{"e":-1,"se":-12},{"e":-11,"se":15},{"e":-1,"se":-3},{"e":-6,"se":0},{"e":3,"se":-13},{"e":7,"se":-9},{"e":1,"se":12},{"e":4,"se":-1},{"e":-2,"se":-12},{"e":3,"se":-6},{"e":-6,"se":12},{"e":15,"se":-14},{"e":1,"se":-14},{"e":12,"se":-10},{"e":-7,"se":-7},{"e":14,"se":0},{"e":2,"se":5},{"e":5,"se":-8},{"e":-3,"se":-10},{"e":7,"se":3},{"e":-5,"se":5},{"e":-13,"se":-4},{"e":-8,"se":-4},{"e":-4,"se":5},{"e":-5,"se":-12},{"e":5,"se":-7},{"e":-8,"se":-7},{"e":5,"se":-8},{"e":14,"se":-9},{"e":15,"se":-16},{"e":-9,"se":-3},{"e":14,"se":-3},{"e":6,"se":5},{"e":11,"se":-7},{"e":10,"se":-9},{"e":8,"se":-2},{"e":-3,"se":-2},{"e":-5,"se":-9},{"e":10,"se":-14},{"e":-14,"se":1},{"e":11,"se":4},{"e":1,"se":-14},{"e":-8,"se":5},{"e":6,"se":-7},{"e":-9,"se":-2},{"e":-3,"se":0},{"e":13,"se":-14},{"e":-7,"se":17},{"e":-4,"se":-12},{"e":13,"se":-4},{"e":-14,"se":-1},{"e":1,"se":8},{"e":-2,"se":11},{"e":-14,"se":12},{"e":3,"se":4},{"e":-9,"se":4},{"e":2,"se":-13},{"e":-7,"se":-3},{"e":-7,"se":14},{"e":17,"se":-8},{"e":9,"se":-3},{"e":-15,"se":12},{"e":-11,"se":16},{"e":-4,"se":-4},{"e":-5,"se":-1},{"e":5,"se":-1},{"e":0,"se":-5},{"e":14,"se":-8},{"e":-10,"se":16},{"e":11,"se":-2},{"e":-1,"se":11},{"e":6,"se":-10},{"e":-17,"se":2},{"e":3,"se":13},{"e":13,"se":-11},{"e":15,"se":-3},{"e":-3,"se":2},{"e":-1,"se":-16},{"e":-6,"se":6},{"e":-13,"se":5},{"e":1,"se":15},{"e":-4,"se":3},{"e":-1,"se":-14},{"e":-12,"se":1},{"e":-7,"se":-6},{"e":-6,"se":-1},{"e":8,"se":-3},{"e":11,"se":-4},{"e":-8,"se":-1},{"e":11,"se":6},{"e":-8,"se":-4},{"e":-8,"se":-6},{"e":-15,"se":6},{"e":16,"se":-4},{"e":-9,"se":12},{"e":-14,"se":0},{"e":-15,"se":0},{"e":-14,"se":11},{"e":3,"se":-16},{"e":-16,"se":15},{"e":9,"se":7},{"e":0,"se":14},{"e":-2,"se":-8},{"e":16,"se":-2},{"e":-15,"se":14},{"e":6,"se":-14},{"e":4,"se":-10},{"e":-15,"se":12},{"e":-16,"se":14},{"e":3,"se":-7},{"e":16,"se":-1},{"e":1,"se":7},{"e":-11,"se":12},{"e":13,"se":-9},{"e":1,"se":-8},{"e":8,"se":1},{"e":5,"se":-13},{"e":10,"se":1},{"e":8,"se":-4},{"e":-1,"se":10},{"e":4,"se":9},{"e":14,"se":-2},{"e":-16,"se":16},{"e":-12,"se":17},{"e":-10,"se":6},{"e":-10,"se":-7},{"e":-11,"se":10},{"e":7,"se":-7},{"e":6,"se":10},{"e":13,"se":-7},{"e":8,"se":6},{"e":-2,"se":4},{"e":14,"se":3},{"e":16,"se":-3},{"e":-1,"se":-6},{"e":-13,"se":13},{"e":0,"se":-17},{"e":-3,"se":9},{"e":9,"se":0},{"e":14,"se":-14},{"e":-9,"se":0},{"e":-11,"se":1},{"e":2,"se":-6},{"e":2,"se":-2},{"e":7,"se":-14},{"e":-2,"se":-11},{"e":-8,"se":14},{"e":10,"se":-10},{"e":0,"se":16},{"e":17,"se":-12},{"e":-12,"se":11},{"e":-9,"se":14},{"e":5,"se":-12},{"e":-17,"se":6},{"e":-8,"se":4},{"e":-5,"se":-5},{"e":-15,"se":7},{"e":-5,"se":-7},{"e":9,"se":-5},{"e":11,"se":-12},{"e":1,"se":6},{"e":6,"se":-9},{"e":-15,"se":2},{"e":0,"se":-1},{"e":11,"se":-14},{"e":11,"se":-17},{"e":2,"se":-15},{"e":9,"se":-10},{"e":13,"se":-5},{"e":16,"se":-13},{"e":-1,"se":-2},{"e":-17,"se":14},{"e":9,"se":-8},{"e":8,"se":-9},{"e":-1,"se":-5},{"e":4,"se":6},{"e":13,"se":-13},{"e":-17,"se":15},{"e":-17,"se":0},{"e":1,"se":-7},{"e":10,"se":7},{"e":8,"se":-17},{"e":1,"se":-13},{"e":11,"se":-15},{"e":7,"se":-3},{"e":-13,"se":-1},{"e":-4,"se":14},{"e":0,"se":3},{"e":15,"se":-4},{"e":17,"se":-7},{"e":-6,"se":17},{"e":-6,"se":-11},{"e":-2,"se":-2},{"e":-13,"se":2},{"e":-7,"se":7},{"e":4,"se":2},{"e":-16,"se":16},{"e":10,"se":-6},{"e":-3,"se":13},{"e":-9,"se":-1},{"e":-9,"se":7},{"e":9,"se":1},{"e":2,"se":6},{"e":4,"se":7},{"e":-6,"se":7},{"e":16,"se":-17},{"e":8,"se":-1},{"e":-16,"se":1},{"e":-2,"se":15},{"e":0,"se":2},{"e":-5,"se":-8},{"e":-4,"se":-6},{"e":17,"se":-4},{"e":3,"se":2},{"e":3,"se":-15},{"e":-3,"se":0},{"e":-7,"se":-3},{"e":-5,"se":-11},{"e":-17,"se":7},{"e":-1,"se":1},{"e":3,"se":1},{"e":0,"se":13},{"e":1,"se":9},{"e":6,"se":11},{"e":-13,"se":-3},{"e":8,"se":9},{"e":14,"se":-11},{"e":5,"se":7},{"e":8,"se":8},{"e":16,"se":1},{"e":-13,"se":6},{"e":10,"se":-2},{"e":-5,"se":-4},{"e":5,"se":0},{"e":-2,"se":-7},{"e":11,"se":-5},{"e":-1,"se":-13},{"e":2,"se":13},{"e":-11,"se":5},{"e":13,"se":-12},{"e":-14,"se":7},{"e":6,"se":-5},{"e":7,"se":-17},{"e":0,"se":5},{"e":-14,"se":4},{"e":-4,"se":-1},{"e":-12,"se":0},{"e":-17,"se":4},{"e":-8,"se":15}]

    let coords = testInput

    // e, se
    let map0 = {}

    const ROUNDS = 100
    const DIRS = ['e', 'w', 'ne', 'nw', 'se', 'sw']

    coords.map((pos)=>{
        map0[pos.se] = map0[pos.se] || {}
        map0[pos.se][pos.e] = !map0[pos.se][pos.e]
    })

    let SixTiles = function(p) {
        var self = {}
        self.id = 'aoc-24'
        self.name = 'AoCSixTiles'
        self.map = map0
        self.neighborGraph
        p.properties = {
            inputs: {
                // dataset: {
                //     desc: 'dataset',
                //     type: 'integer',
                //     min: 0,
                //     max: 1,
                //     value: 0
                // },
                speed: {
                    desc: 'step wait',
                    type: 'float',
                    min: 0,
                    max: 4000,
                    value: 250
                },
                step: {
                    type: 'button',
                    text: '►|',
                    action: ()=>self.step()
                },
                start: {
                    type: 'button',
                    text: '►',
                    action: ()=>self.play()
                },
                stop: {
                    type: 'button',
                    text: '■',
                    action: ()=>self.stop()
                },
                hundred: {
                    type: 'button',
                    text: '► 100|',
                    action: ()=>self.step100()
                },
                reset: {
                    type: 'button',
                    text: 'reset',
                    action: ()=>self.reset()
                }
            }
        }

        p.setup = ()=>{
            p.createCanvas(c.x, c.y)
            p.frameRate(30)
            c.info('AoC', '24')
            self.drawGraph(self.map)
        }

        self.initDrawing = ()=>{
            p.createCanvas(c.x, c.y)
        }

        self.gen = 0

        self.reset = ()=>{
            self.map = map0
            self.initDrawing()
            self.drawGraph(self.map)
            self.gen = 0
        }

        self.step100 = ()=>{
            let n = 0
            while (n++ < 100){
                console.log(n, 'b:', countAllBlack(self.map))
                self.neighborGraph = generateNewNeighbors(self.map)
                self.neighborMap = countTheFlops(self.neighborGraph)
                self.map = flipDay(generateNewNeighbors(self.map), self.neighborMap)
            }
            self.initDrawing()
            self.drawGraph(self.map)
            console.log('Final Blacks', countAllBlack(self.map))
        }
        self.isPlaying = false

        self.play = ()=>{
            self.isPlaying = true
            self.playStep()
        }
        self.stop = ()=>{
            self.isPlaying = false
        }

        self.playStep = ()=>{
            if (self.isPlaying){
                self.step()
                setTimeout(self.playStep, p.properties.inputs.speed.value)
            }
        }

        self.step = ()=>{
            if (!self.neighborGraph){
                // Gen & draw neighbor graph
                self.neighborGraph = generateNewNeighbors(self.map)
                self.neighborMap = countTheFlops(self.neighborGraph)
                self.initDrawing()
                self.drawGraph(self.neighborGraph, self.neighborMap)

            } else {
                // Neighbor graph is shown, do the flop
                self.map = flipDay(self.neighborGraph, self.neighborMap)
                self.drawGraph(self.map)
                let blacks = countAllBlack(self.map)
                let blacksPadded = (''+blacks).padStart(4, '0')
                let genPadded = (''+self.gen).padStart(3, '0')
                console.log('blacks', blacks)
                self.neighborGraph = false
                $('#shape-info').text(`_shape #AoC 24 gen#${genPadded} while: ${blacksPadded}`)
                self.gen++
            }
            return
        }

        self.drawGraph = (map, neighborMap)=>{
            let {minSe, maxSe, minE, maxE} = getMaxMin(map)
            let dy = maxSe - minE, dx = maxE - minE + (dy / 4) + 2
            let unitX = c.w / dx , unitY = c.h / dy
            // Preserve aspect ratio
            let unit = Math.min(unitX, unitY)

            const SQRT3PER2 = Math.sqrt(3/2)

            for(let se = minSe; se <= maxSe; se++){
                for(let e = minE; e <= maxE; e++){

                    e = parseInt(e)
                    se = parseInt(se)
                    let isBlack = isPosBlack(map, {e, se})

                    if (isBlack === undefined){
                        // continue;
                        // p.stroke(p.color(c.c.p[2]))
                    }
                    p.push()
                    p.translate((c.w / 2) + (e * unit + (se / 2 * unit)),
                        (c.h / 2) + (se * unit / SQRT3PER2))

                    if (se === 0 && e === 0){
                        p.stroke(p.color(c.c.p[0]))
                        p.stroke(p.color(c.c.p[0]))
                    }

                    p.stroke(p.color(c.c.p[5]))
                    p.fill(p.color(0,0,0, 0))
                    p.strokeWeight(1)

                    if (isBlack === undefined){
                        // continue;
                        p.stroke(p.color(c.c.p[2]))
                    } else if( isBlack ){
                        p.fill(p.color(c.c.p[7]))
                    }

                    p.rotate(Math.PI / 6)
                    c.poly(p, 0, 0, unit / 2, 6)

                    p.rotate(-Math.PI / 6)

                    // Debug
                    // if (neighborMap){
                    //     p.strokeWeight(0)
                    //     p.fill(p.color(0))
                    //     p.text(neighborMap[se][e], 0, 0)
                    // }

                    p.pop()
                }
            }
        }

        function getCommandPos(cmd, refPos){
            let pos = refPos || {e: 0, se: 0}
            switch(cmd){
                case 'e': pos.e++
                break;
                case 'w': pos.e--
                break;
                case 'se':
                    pos.se++
                break;
                case 'nw': pos.se--
                break;
                case 'ne':
                    pos.e++
                    pos.se--
                break;
                case 'sw':
                    pos.se++
                    pos.e--
                break;
            }
            return pos
        }

        function getMaxMin(map){
            let minSe = 0, minE = 0, maxE = 0, maxSe = 0
            for (let se in map){
                se = parseInt(se)
                if (se < minSe) minSe = se;
                if (se > maxSe) maxSe = se;
                for (let e in map[se]){
                    e = parseInt(e)
                    if (e < minE) minE = e;
                    if (e > maxE) maxE = e;
                }
            }
            // Now find the max true blocks.

            return {minSe, maxSe, minE, maxE}
        }

        function countAllBlack(map){
            let blacks = 0
            for (let se in map){
                for (let e in map[se]){
                    blacks = map[se][e]?blacks+1:blacks
                }
            }
            return blacks
        }

        function generateNewNeighbors(map){
            let newMap = {}
            for (let se in map){
                for (let e in map[se]){
                    setNeighborKeys(newMap, map, {e, se})
                }
            }
            return newMap
        }

        function countTheFlops(newMap){
            let neighborMap = {}
            for (let se in newMap){
                neighborMap[se] = {}
                for (let e in newMap[se]){
                    let pos = {se, e}
                    neighborMap[se][e] = getNeighbors(newMap, pos)
                }
            }
            return neighborMap
        }


        // Now do the flop.
        function flipDay(newMap, neighborMap){
            for (let se in newMap){
                for (let e in newMap[se]){
                    let pos = {se, e}
                    let blackNeighbors = neighborMap[se][e]

                    if (isPosBlack(newMap, pos)){
                        if (blackNeighbors === 0 || blackNeighbors > 2){
                            newMap[se][e] = false
                        }
                    } else{
                        if (blackNeighbors === 2){
                            newMap[se][e] = true
                        }
                    }
                }
            }
            return newMap
        }

        function isPosBlack(map, pos){
            if (!map[pos.se]) return;
            return map[pos.se][pos.e]
        }

        function setNeighborKeys(newMap, map, pos){
            let n = 0
            newMap[pos.se] = newMap[pos.se] || {}
            newMap[pos.se][pos.e] = isPosBlack(map, pos)

            if (newMap[pos.se][pos.e]){
                while(n < DIRS.length){
                    let neighborPos = getCommandPos(DIRS[n++])
                    neighborPos.se += +pos.se;
                    neighborPos.e += +pos.e;
                    newMap[neighborPos.se] = newMap[neighborPos.se] || {}
                    newMap[neighborPos.se][neighborPos.e] = isPosBlack(map, neighborPos) || false
                }
            }
        }

        function getNeighbors(map, pos){
            let blackNeighbors = 0
            let n = 0
            while(n < DIRS.length){
                let neighborPos = getCommandPos(DIRS[n++])
                neighborPos.e += +pos.e
                neighborPos.se += +pos.se
                if (isPosBlack(map, neighborPos)){
                    blackNeighbors++
                }
            }
            return blackNeighbors
        }

    }

    return SixTiles
});