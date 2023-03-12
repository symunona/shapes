import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import register from '../midi.js'
import _ from 'underscore'




console.log('initing my first three tree')

const stats = Stats();
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;
camera.position.y = 2;


const controls = new OrbitControls( camera, renderer.domElement );
controls.autoRotate = true;



function marker(position, color, size){
    size = size || 0.1
    const geometry = new THREE.BoxGeometry(size, size, size)
    const material = new THREE.MeshStandardMaterial({ emissive: color || 0x770000, vertexColors: true })
    const marker = new THREE.Mesh(geometry, material)
    marker.position.set(position.x, position.y, position.z)
    scene.add(marker)
    return marker
}


// const material = new THREE.LineDashedMaterial( {
// 	color: 0x770000,
// 	linewidth: 0.01,
// 	scale: 100,
// 	dashSize: 0.03,
// 	gapSize: 0.01,
// } );


const light = new THREE.AmbientLight(0x404040) // soft white light
scene.add(light)

const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00aa00 })

const points = []

/**
 *
 * @param {Number} depth
 * @param {Number} branches
 * @param {THREE.Vector3} formerBase
 * @param {THREE.Vector3} startPoint
 * @param {THREE.Vector3} direction
 * @param {Number} branchAngleZ
 * @param {Array} treePoints
 * @param {Number} reduceBranchLength
 */
function buildTree(
    depth,
    branches,
    formerBase,
    startPoint,
    direction,
    branchAngleZ,
    treePoints,
    reduceBranchLength
) {

    treePoints.push(startPoint)
    let newBase = startPoint.clone().add(direction)
    treePoints.push(newBase)

    // const arrowHelper = new THREE.ArrowHelper( startPoint, direction, 1, 0xff0000 );
    // scene.add(arrowHelper)

    // marker(newBase)

    const n = branches // we can programmatically insert functions here later
    const dAngle = Math.PI*2 / n

    // Stop at the end of recursion depth
    if (depth > 0){
        for (let i = 0; i < n; i++){
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

            buildTree(
                depth - 1, // recursion
                branches,
                startPoint, // formerBase,
                newBase, // startPoint
                newDirection,
                branchAngleZ,
                treePoints,
                reduceBranchLength * reduceBranchLength
            )
            // console.log(`branch ${depth} - ${i}`, newDirection)
        }
    }
    treePoints.push(startPoint)
}


/**
 * @param {THREE.Vector3} p1
 * @param {THREE.Vector3} p2
 * @param {THREE.Vector3} p3
 */
function getNormalOfPlain(p1,p2, p3){
    const r1 = p1.clone().sub(p2)
    const r2 = p1.clone().sub(p3)
    return r1.cross(r2).normalize()
}


let treePoints = []

let formerBase = new THREE.Vector3(0, 0, 1)
let startPoint = new THREE.Vector3(0, -1, 0)
let direction = new THREE.Vector3(0, 1, 0)
let depth = 4
let branches = 3
let branchAngle = Math.PI / 6 // 30 DEG
let reduceBranchLength = 0.9

const rebuildThrottled = _.throttle(rebuildTree, 500)

register((channel, value)=>{
    // console.log('midievent: ', channel, value)
    const normalizedValue = value / 127
    switch(channel){
        case 0:
            depth = normalizedValue * 8 // max 8
        break;
        case 1: branches = value / 8 // max 16
        break;
        case 2: branchAngle = normalizedValue * Math.PI / 2 // 90 Deg
        break
        case 3: reduceBranchLength = normalizedValue;
        break;
    }
    rebuildThrottled()
})


let line

function rebuildTree(){

    if (line){
        scene.remove(line)
    }

    console.log('rebuildTree:',
        depth,
        branches,
        branchAngle,
        reduceBranchLength
    )
    treePoints = []
    buildTree(
        depth,
        branches,
        formerBase,
        startPoint,
        direction,
        branchAngle,
        treePoints,
        reduceBranchLength
        )

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(treePoints);
    line = new THREE.Line(lineGeometry, lineMaterial);

    scene.add(line)
}

buildTree(
    depth,
    branches,
    formerBase,
    startPoint,
    direction,
    branchAngle,
    treePoints,
    reduceBranchLength
    )


base(startPoint, 0.1)

function base(position, size){
    const geometry = new THREE.BoxGeometry(size, size * 0.1, size)
    const material = new THREE.MeshNormalMaterial()
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(position.x, position.y, position.z4)
    scene.add(cube)
}




animate()


// let cameraDist = 3
// let cameraY = 1 // RAD
// let cameraZ = 1 // RAD

// const center = new THREE.Vector3(0,1,0)

// addEventListener("wheel", (event) => {
//     const delta = event.deltaY / 240 / 10
//     cameraDist += delta;
//     animate()
// });

// const deltaMouse = 0.01

// addEventListener("mousemove",(event) => {
//     const dx = event.movementX * deltaMouse, dy = event.movementY * deltaMouse
//     // console.log(dx, dy)
//     cameraY += dx
//     cameraZ += dy
//     camera.position.x = Math.cos(cameraY) * cameraDist
//     camera.position.z = Math.sin(cameraY) * cameraDist
//     camera.position.y = Math.sin(cameraZ) * cameraDist
//     camera.lookAt(center)
//     animate()
// })

function animate() {

    requestAnimationFrame( animate );

    controls.update();
    stats.update();

    renderer.render( scene, camera );

}



// renderer.setAnimationLoop(() => {

//    translatemat.makeTranslation(num, -num, 0)
//    mesh.position.applyMatrix4(translatemat)
//    rotatemat.makeRotationY(num)
//    camera.lookAt(new THREE.Vector3(0,0,0))
// })

// setInterval(() => {
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
//     line.rotation.x += 0.01;
//     line.rotation.y += 0.01;
//     animate();

// }, 100)