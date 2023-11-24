/**
 * 2/3D fiddle editor, parametric visuals wrapper
 *
 */

document.getElementById('load-error').remove()

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import Stats from 'three/examples/jsm/libs/stats.module';
import _ from 'underscore'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module';

import listOfFiddles from '../fiddles.json' assert {type: 'json'};
import { Fiddle } from './lib/fiddle.js';
import { base, createElement, getFileName, midiNotHookedInThrottled } from './lib/utils.js';
import { animateButtonChangedValue, arrayLightUp, MIDI_MAPS, reverseTranslateMidiKnobChannel, translateMidiKnobChannel } from './lib/shapes-midi-helper.js';
import ShapesMIDIController from './lib/midi.js';
import { Vector3 } from 'three';


const menu = createElement('div', { 'class': 'menu' })
document.body.appendChild(menu)

listOfFiddles.map((fileName) => {
    menu.appendChild(createElement('a', {
        innerHTML: getFileName(fileName),
        onclick: load.bind(this, fileName)
    }))
})

// const log = createElement('div', { 'class': 'log' })
// document.body.appendChild(log)


let scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

document.body.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.z = 4;
camera.position.y = 2;

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;

const light = new THREE.PointLight({ color: 0x404040 }) // soft white light



// scene.add(base(new Vector3(0, 0, 0)))

window.addEventListener('resize', onWindowResize, false);

// animate()


// let wheel = 5

// window.addEventListener('wheel', (e) => {
//     if (e.deltaY < 0)
//         wheel++
//     else
//         wheel--
//     console.warn(wheel)
//     log.innerHTML =
//         Math.round(e.offsetX/4).toString().padStart(3, '_') + ' - ' +
//         Math.round(e.offsetY/4).toString().padStart(3, '_') + ' ch: ' + wheel
// })

// log.addEventListener('mousemove', (e)=>{
//     const KEY = 36 + Math.round(e.offsetX/4 / 8)
//     const ONOFF = Math.round(e.offsetY/256) * 127
//     log.innerHTML =
//         KEY + ' - ' +
//         ONOFF
// })



// log.addEventListener('click', (e) => {
//     // const data = [0x90, Math.round(e.offsetX/4), Math.round(e.offsetY/4)]
//     const KEY = 36 + Math.round(e.offsetX/4 / 8)
//     const KEY2 = 0 + Math.round(e.offsetX/4 / 8)
//     const ONOFF = Math.round(e.offsetY/256) * 127
//     const data = [0x90, KEY, ONOFF]
//     log.innerHTML = data
// })


// window.addEventListener('keypress', (e) => {
//     if (e.code.startsWith('Digit')) {
//         if (e.shiftKey) {
//             wheel = parseInt(' ' + wheel + e.code.substring(5))
//         } else {
//             wheel = parseInt(e.key)
//         }
//         console.warn('ch', wheel)
//     }
// })

load(listOfFiddles[0])

/**
 * @type {Fiddle}
 */
let currentFiddle
let currentMesh
const rebuildThrottled = _.throttle(rebuild, 500)



console.log('Hooking up MIDI input')

let activeMidiName

const shapesMidiController = new ShapesMIDIController(function (midiName, msgType, channel, value) {
    // When a knob is turned, light up the corresponding value on the numpad
    activeMidiName = midiName

    if (currentFiddle) {
        const actualChannel = translateMidiKnobChannel(midiName, channel)

        const param = currentFiddle.inputs.getByIndex(actualChannel)
        if (!param) {
            midiNotHookedInThrottled(actualChannel, currentFiddle)
            return;
        }
        param.changeNormal(value / 128)

        animateButtonChangedValue(shapesMidiController, channel)

        if (currentFiddle.throttle) {
            return rebuildThrottled()
        }
        rebuild()
    } else {
        // console.log(arguments)
    }
})

function restoreMidiVariables(currentFiddle) {
    activeMidiName = shapesMidiController.lastMidiName
    for (let i = 0; i < currentFiddle.inputs.length; i++) {
        const actualMidiChannelToRestore = reverseTranslateMidiKnobChannel(activeMidiName, i)
        if (actualMidiChannelToRestore === false) {
            console.warn('Channel restore error.')
            continue
        }
        const value = shapesMidiController.lastState[activeMidiName][actualMidiChannelToRestore]
        if (value !== undefined) {
            currentFiddle.inputs.getByIndex(i).changeNormal(value / 128)
        }
    }
    console.warn('restored from midi: ', currentFiddle.inputs.toString())
}



function rebuild() {
    console.log('Rebuilding', currentFiddle.name)
    console.warn(currentFiddle.inputs.toString())

    scene.remove()

    if (currentMesh) {
        scene = new THREE.Scene();
        light.position.set(10, 10, 10)
        scene.add(light)
    }
    currentMesh = currentFiddle.build(scene, camera)
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

let loaded = false

/**
 * @param {Fiddle}
 */
function loadModel(FiddleInstance, fiddleName) {
    currentFiddle = new FiddleInstance.default();
    currentFiddle.name = fiddleName

    // Show which are the inputs that can be manipulated
    arrayLightUp(shapesMidiController, currentFiddle.inputs.length, 100, 500)

    restoreMidiVariables(currentFiddle)

    console.log('Fiddle loaded:', fiddleName)
    if (!loaded) {
        animate();
        loaded = true
    }
    return rebuild()
}

let lastPos, lastRot;

function animate() {
    requestAnimationFrame(animate);

    // controls.update();
    // stats.update();
    if (currentFiddle && currentFiddle.orbital) {
        controls.update();
    } else {

        if (lastPos && (
            lastPos.x !== camera.position.x ||
            lastPos.z !== camera.position.z ||
            lastPos.y !== camera.position.y)
        ) {
            console.warn(camera.position)
        }
        lastPos = camera.position.clone()

        if (lastRot && (
            lastRot.x !== camera.rotation.x ||
            lastRot.z !== camera.rotation.z ||
            lastRot.y !== camera.rotation.y)
        ) {
            console.warn(camera.rotation)
        }
        lastRot = camera.rotation.clone()

    }
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

