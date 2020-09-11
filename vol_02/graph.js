/**
 * Magical graphs come out of this.
 */
define(['underscore'],(_)=>{

    class Graph{
        points = []
        addPoint(p){
            this.points.push(_.extend({neighbors: [] }, p))
        }

        /**
         * Point indexes
         * @param {Integer} p1
         * @param {Integer} p2
         */
        addEdge(p1, p2){
            this.points[p1].neighbors.push(p2)
            // Create indexes in both points.
            if (!this.directional){
                this.points[p2].neighbors.push(p1)
            }
        }
        init(directional) {
            this.directional = directional
        }

        resetWalkThrough(){
            this.points.map((p)=>p.visited = false)
        }

        dfs(startingPoint){
            this.points[startingPoint].visited = true
            let path = [], notVisitedNeighbors = []
            while ((notVisitedNeighbors = this.getNotVisitedNeighbors(this.points[startingPoint])).length){
                path.push([startingPoint, notVisitedNeighbors[0]])
                path = path.concat(this.dfs(notVisitedNeighbors[0]))
            }
            return path
        }

        /**
         * @param {Object} p
         */
        getNotVisitedNeighbors(p){
            return p.neighbors.filter((p)=>!this.points[p].visited)
        }
    }

    return Graph
})