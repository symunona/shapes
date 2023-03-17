import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import Stats from 'three/examples/jsm/libs/stats.module';
import register from './midi.js'
import _ from 'underscore'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module';

import listOfFiddles from '../list.json' assert {type: 'json'};
import { Fiddle } from './fiddle.js';
import { createElement, getFileName } from './utils.js';

const menu = createElement('div', {'class': 'menu'})
document.body.appendChild(menu)

listOfFiddles.map((fileName)=>{
    menu.appendChild(createElement('a', {
        innerHTML: getFileName(fileName),
        onclick: load.bind(this, fileName)
    }))
})

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

document.body.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.z = 4;
camera.position.y = 2;

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;

const light = new THREE.AmbientLight(0x404040) // soft white light

scene.add(light)
// scene.add(base(new Vector3(0,-1,0)))

window.addEventListener('resize', onWindowResize, false);

animate()

load(listOfFiddles[0])

/**
 * @type {Fiddle}
 */
let currentFiddle
let currentMesh
const rebuildThrottled = _.throttle(rebuild, 500)
const midiNotHookedInThrottled = _.throttle(midiNotHookedIn, 5000)

console.log('Hooking up MIDI input')
register((channel, value) => {
    if (currentFiddle) {
        const param = currentFiddle.inputs.getByIndex(channel)
        if (!param) {
            midiNotHookedInThrottled(channel)
            return;
        }
        param.changeNormal(value / 128)
    }
    if (currentFiddle.throttle) {
        return rebuildThrottled()
    }
    rebuild()
})



function midiNotHookedIn(channel){
    console.warn(`Midi channel ${channel} not hooked in, as there are only ${Object.keys(currentFiddle.inputs).length} parameters.`)
}

function rebuild() {
    console.log('Rebuilding', currentFiddle.name)
    console.warn(currentFiddle.inputs.toString())

    if (currentMesh) {
        scene.remove(currentMesh)
    }
    currentMesh = currentFiddle.build()
    scene.add(currentMesh)
}

/**
 * Loads a fiddle.
 * @param {String} fileName
 */
function load(fileName) {
    return import('./desc/' + fileName)
        .then((FiddleInstance) => loadModel(FiddleInstance, getFileName(fileName)))
}

/**
 * @param {Fiddle}
 */
function loadModel(FiddleInstance, fiddleName) {
    currentFiddle = new FiddleInstance.default();
    currentFiddle.name = fiddleName
    console.log('Fiddle loaded:', fiddleName)
    return rebuild()
}


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    // stats.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

