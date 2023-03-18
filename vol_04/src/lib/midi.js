/**
 * Simple midi module. On midi event we get the callback called with the event.
 * We also save the last state of each KNOB, so that we can read it out from the memory.
 */

const LS_KEY = 'lastMidiStateMap'

export default class ShapesMIDIController {
    animationInProgress = {}

    outputs = []
    outputMap = {}
    inputs = []

    lastState = {}
    lastMidiName

    midiAccess
    /**
     * @param {Function} onMidiMessage
     */
    constructor(onMidiMessage) {
        this.onMidiMessage = onMidiMessage
        if (navigator && navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess()
                .then(this.onMIDISuccess.bind(this), function onMIDIFailure() {
                    console.warn('No midi for your browser today...')
                });
        }
    }

    onMIDISuccess(midiAccess) {

        const lastSavedState = localStorage.getItem(LS_KEY)
        if (lastSavedState){
            try{
                this.lastState = JSON.parse(lastSavedState)
            } catch(e){
                this.lastState = {}
                localStorage.removeItem(LS_KEY)
                console.warn('Something went wrong with removing your last MIDI state.')
            }
        }

        this.midiAccess = midiAccess
        for (let input of midiAccess.inputs.values()) {
            console.log('MIDI input: ', input)
            input.onmidimessage = this.getMIDIMessage.bind(this);
            this.inputs.push(input)
            // Save all the updates, so we can re-read how it was before!
            this.lastState[input.name] = this.lastState[input.name] || {}
        }

        for (let output of midiAccess.outputs) {
            console.log('MIDI output: ', output)
            this.outputMap[output[1].name] = output[1]
            this.outputs.push(output[1])
            this.lastMidiName = output[1].name
        }


        window.onbeforeunload = ()=>{
            localStorage.setItem(LS_KEY, JSON.stringify(this.lastState))
        }
    }

    getMIDIMessage(midiMessage) {
        // console.warn(midiMessage.data[0], midiMessage.data[1], midiMessage.data[2], midiMessage);

        const midiName = midiMessage.srcElement?.name
        const msgType = midiMessage.data[0]
        const channel = midiMessage.data[1]
        const value = midiMessage.data[2]

        this.lastMidiName = midiName

        this.lastState[midiName][channel] = value

        this.onMidiMessage(midiName, msgType, channel, value)
    }

    // sendToAll(data, midiControllerIndex){
    //     let out = outputs[midiControllerIndex][1]
    //     if(out){
    //         console.log('sending', out.name, midiControllerIndex, data)
    //         out.send(data)
    //     }
    // }

    animate(midiName, channel, animationProperties){
        if (!this.animationInProgress[midiName]){this.animationInProgress[midiName] = {}}

        // We have an animation running, cancel that!
        if (this.animationInProgress[midiName][channel]){
            clearTimeout(this.animationInProgress[midiName][channel])
        }

        if (this.ANIMATIONS[animationProperties.type]) {
            this.ANIMATIONS[animationProperties.type].call(this, midiName, channel, animationProperties)
        }
    }

    ANIMATIONS = {blink: this.blink}

    blink(midiName, channel, properties){
        let n = properties.n * 2
        let state = true
        this.outputMap[midiName].send([0x90, channel, 127])

        const timer = ()=>setTimeout(()=>{
            this.outputMap[midiName].send([0x90, channel, state?0:127])
            state = !state
            if (n-- > 0){
                this.animationInProgress[midiName][channel] = timer()
            } else {
                this.animationInProgress[midiName][channel] = null
            }
        }, properties.length)
        return this.animationInProgress[midiName][channel] = timer()
    }

}
