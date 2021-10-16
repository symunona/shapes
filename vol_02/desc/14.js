// AoC 24

define(['frame', 'underscore'], (c, _)=>{
    'use strict'

    const testInput = [{"e":-3,"se":2},{"e":1,"se":-3},{"e":-3,"se":3},{"e":2,"se":-2},{"e":1,"se":-2},{"e":-1,"se":0},{"e":1,"se":-3},{"e":-2,"se":0},{"e":0,"se":-1},{"e":-2,"se":1},{"e":0,"se":-2},{"e":0,"se":-2},{"e":3,"se":-3},{"e":-1,"se":0},{"e":0,"se":2},{"e":0,"se":0},{"e":1,"se":-2},{"e":2,"se":-2},{"e":2,"se":0},{"e":-1,"se":-1}]

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
        self.map = map0
        self.neighborGraph
        p.properties = {
            id: 'aoc-24',
            name: 'AoCSixTiles',
            inputs: {
                speed: {
                    desc: 'step wait',
                    type: 'float',
                    min: 0,
                    max: 4000,
                    value: 700
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
            self.play()
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
                // console.log(n, 'b:', countAllBlack(self.map))
                self.neighborGraph = generateNewNeighbors(self.map)
                self.neighborMap = countTheFlops(self.neighborGraph)
                self.map = flipDay(generateNewNeighbors(self.map), self.neighborMap)
            }
            self.initDrawing()
            self.drawGraph(self.map)
            // console.log('Final Blacks', countAllBlack(self.map))
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
                // console.log('blacks', blacks)
                self.neighborGraph = false
                $('#shape-info').text(`_shape #AoC 24 gen#${genPadded} cnt: ${blacksPadded}`)
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
                        if (hasDefinedNeighbors(map, {e, se})){
                            p.stroke(p.color(c.c.p[2]))
                        } else {
                            p.strokeWeight(0)
                        }
                    } else if( isBlack ){
                        p.fill(p.color(c.c.p[7]))
                    }

                    p.rotate(Math.PI / 6)
                    c.poly(p, 0, 0, unit / 2, 6)

                    p.rotate(-Math.PI / 6)

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

        function hasDefinedNeighbors(newMap, pos){
            let n = 0
            while(n < DIRS.length){
                let neighborPos = getCommandPos(DIRS[n++])
                neighborPos.se += +pos.se;
                neighborPos.e += +pos.e;
                if (newMap[neighborPos.se] && newMap[neighborPos.se][neighborPos.e] !== undefined) return true
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