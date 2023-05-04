import * as THREE from 'three';
import { BufferGeometry, Line, LineBasicMaterial, Scene, Vector3 } from 'three';
import _ from 'underscore'
import { Fiddle, Inputs } from '../lib/fiddle.js';
import { Param } from '../lib/param.js';


const deg60 = Math.PI / 3 * 2
const deg90 = Math.PI / 2
const sqrt3 = Math.sqrt(3)
const height = Math.sin(Math.acos(1 / sqrt3)) * sqrt3

const pBase1 = new THREE.Vector3().setFromSpherical(new THREE.Spherical(1, deg90, 0))
const pBase2 = new THREE.Vector3().setFromSpherical(new THREE.Spherical(1, deg90, deg60))
const pBase3 = new THREE.Vector3().setFromSpherical(new THREE.Spherical(1, deg90, -deg60))
const pTop = new THREE.Vector3().setFromSpherical(new THREE.Spherical(height, 0, 0))

const center = pBase1.clone()
    .add(pBase2)
    .add(pBase3)
    .add(pTop)
    .divideScalar(4)
pBase1.sub(center)
pBase2.sub(center)
pBase3.sub(center)
pTop.sub(center)

const cornerPoints = [pBase1, pBase2, pBase3, pTop]

export default class TriPi extends Fiddle{

    throttle = 10

    lineMaterial = new LineBasicMaterial({ color: 0x00aa00 })
    inputs = new Inputs({
        depth: new Param('depth', 4, 1, 0, 6),
        type: new Param('type', 0, 1, 0, 1),
    })

    build() {
        this.treePoints = []

        switch(this.inputs.type.value){
            case 0:
                this.buildPyramid(
                    this.inputs.depth.value,
                    new Vector3(0, 0, 0),
                    1,
                    this.treePoints,
                )
                break;
            case 1:
                this.ver2(
                    this.inputs.depth.value,
                    1,
                    this.treePoints
                )
                break
        }

        const lineGeometry = new BufferGeometry().setFromPoints(this.treePoints);
        const line = new Line(lineGeometry, this.lineMaterial);
        return line
    }

    ver2(d, r, treePoints){
        for (let i = 0; i < cornerPoints.length; i++){
            treePoints.push(cornerPoints[i])
            const startPoint = cornerPoints[i].clone().multiplyScalar(2)
            treePoints.push(startPoint)
            this.ver2Leaf(d-1, startPoint, cornerPoints[i])
        }
    }
    ver2Leaf(d, start, direction){

    }

    addTrianglePyramid(center, r){
        const movedPoints = []
        for (let i = 0; i < cornerPoints.length; i++){
            // Scale them down, then move to the center
            movedPoints.push(cornerPoints[i].clone().multiplyScalar(r).add(center))
        }

        return [
            movedPoints[0],
            movedPoints[1],
            movedPoints[2],
            movedPoints[3],
            movedPoints[0],
            movedPoints[2],
            movedPoints[3],
            movedPoints[1],
        ]
    }

    /**
     * @param {Number} depth
     * @param {THREE.Vector3} center
     * @param {Number} r
     * @param {Array} treePoints
     */
    buildPyramid(
        depth,
        center,
        r,
        treePoints
    ) {

        treePoints.push(...this.addTrianglePyramid(center, r))

        // Stop at the end of recursion depth
        if (depth > 0) {
            for (let i = 0; i < cornerPoints.length; i++){
                const newCenter = cornerPoints[i].clone().multiplyScalar(1.5 * r).add(center)

                this.buildPyramid(
                    depth - 1, // recursion
                    newCenter,
                    r / 2,
                    treePoints
                    )
            }
        }
    }
}
