/**
 * @param {THREE.Vector3} position
 * @param {String} color
 * @param {Number} size
 * @returns {Mesh}
 */

import {BoxGeometry, Mesh, MeshNormalMaterial, MeshStandardMaterial, Vector3} from 'three';

export const DEG1 = Math.PI / 180 // 1deg
export const PI2 = Math.PI * 2 // 360deg


export function marker(position, color, size) {
    size = size || 0.1
    const geometry = new BoxGeometry(size, size, size)
    const material = new MeshStandardMaterial({ emissive: color || 0x770000, vertexColors: true })
    const marker = new Mesh(geometry, material)
    marker.position.set(position.x, position.y, position.z)
    scene.add(marker)
    return marker
}

/**
 * @param {Vector3} position
 * @param {*} size
 * @returns {Mesh}
 */
export function base(position, size) {
    size = size || 0.1
    const geometry = new BoxGeometry(size, size * 0.1, size)
    const material = new MeshNormalMaterial()
    const cube = new Mesh(geometry, material)
    cube.position.set(position.x, position.y, position.z4)
    return cube
}

/**
 * @param {Vector3} p1
 * @param {Vector3} p2
 * @param {Vector3} p3
 */
export function getNormalOfPlain(p1,p2, p3){
    const r1 = p1.clone().sub(p2)
    const r2 = p1.clone().sub(p3)
    return r1.cross(r2).normalize()
}


export function createElement(nodeName, params){
    const el = document.createElement(nodeName);
    Object.assign(el, params)
    if (params.class){
        el.classList.add(params.class)
    }
    return el
}

export function getFileName(fileName){
    return fileName.substring(0, fileName.lastIndexOf('.'))
}