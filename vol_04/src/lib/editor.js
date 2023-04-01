/**
 * First step:
 *  - Create a visual editor in JS for displaying fiddles. Goals:
 *    - standard: when loading the fiddle create a simple link network with the default values
 *    - implement different input sources
 *    - implement re-mapper
 * - Start with the following:
 *   - standard inputs: mouse, midi
 *   - parametric input sliders
 *   - import an existing fiddle
 */

import { createElement } from "./utils.js";


export default class ShapeEditor{
     constructor(scene, parentElement){
        this.element = createElement('div', {id: 'rete'})

        parentElement.appendChild(this.element)
     }
}
