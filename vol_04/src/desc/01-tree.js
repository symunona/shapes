import * as THREE from 'three';
import { LineBasicMaterial, Scene, Vector3 } from 'three';
import _ from 'underscore'
import { Fiddle, Inputs } from '../lib/fiddle.js';
import { Param } from '../lib/param.js';
import { DEG1, getNormalOfPlain } from '../lib/utils.js';

export default class Tree1 extends Fiddle{
    inputs = new Inputs({
        startPoint: new Param('startPoint', new THREE.Vector3(0, -1, 0)),
        direction: new Param('direction', new THREE.Vector3(0, 1, 0)),
        depth: new Param('depth', 4, 1, 0, 6),
        branches: new Param('branches', 3, 1, 1, 5),
        branchAngle: new Param('branchAngle', Math.PI / 6, DEG1, 0, Math.PI), // 30 DEG
        reduceBranchLength: new Param('reduceBranchLength', 0.9, 0.001, 0, 5)
    })

    lineMaterial = new LineBasicMaterial({ color: 0x00aa00 })

    /**
     * @param {Scene} scene
     * @returns {Array}
     */
    build() {
        this.treePoints = []

        this.buildTree(
            this.inputs.depth.value,
            this.inputs.branches.value,
            new Vector3(0, 0, 1).add(this.inputs.startPoint.value),
            this.inputs.startPoint.value,
            this.inputs.direction.value,
            this.inputs.branchAngle.value,
            this.inputs.reduceBranchLength.value,
            this.treePoints,
        )

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(this.treePoints);
        const line = new THREE.Line(lineGeometry, this.lineMaterial);

        return line
    }


    /**
     *
     * @param {Number} depth
     * @param {Number} branches
     * @param {THREE.Vector3} formerBase
     * @param {THREE.Vector3} startPoint
     * @param {THREE.Vector3} direction
     * @param {Number} branchAngleZ
     * @param {Number} reduceBranchLength
     * @param {Array} treePoints
     */
    buildTree(
        depth,
        branches,
        formerBase,
        startPoint,
        direction,
        branchAngleZ,
        reduceBranchLength,
        treePoints,
    ) {

        treePoints.push(startPoint)
        let newBase = startPoint.clone().add(direction)
        treePoints.push(newBase)

        const n = branches // we can programmatically insert functions here later
        const dAngle = Math.PI * 2 / n

        // Stop at the end of recursion depth
        if (depth > 0) {
            for (let i = 0; i < n; i++) {
                const branchAngleY = i * dAngle
                // Let's rotate this around by two axis:
                // Y relative to the `direction`
                //
                //            Y
                //            |
                //            | ___ X
                //           /
                //          /
                //         Z
                //
                const zRotationAxisForBranch = getNormalOfPlain(formerBase, startPoint, newBase)
                const yRotationAxisForBranch = direction.clone().normalize()
                const newDirection = direction.clone().applyAxisAngle(zRotationAxisForBranch, branchAngleZ)
                newDirection.applyAxisAngle(yRotationAxisForBranch, branchAngleY)
                newDirection.multiplyScalar(reduceBranchLength)

                this.buildTree(
                    depth - 1, // recursion
                    branches,
                    startPoint, // formerBase,
                    newBase, // startPoint
                    newDirection,
                    branchAngleZ,
                    reduceBranchLength * reduceBranchLength,
                    treePoints
                )
            }
        }
        treePoints.push(startPoint)
    }
}
