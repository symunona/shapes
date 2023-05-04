import { midiMapDoNotExistThrottled } from "./utils.js"

const CHANGE_ANIMATION = {type: 'blink', n: 2, length: 250}

/**
 * Blink up a row of pads one after the other until n is reached, then blink them out.
 * @param {Number} n - number of channels on the pad to mark.
 * @param {Number} speed - switch each PAD item this fast after another on.
 * @param {Number} finalTimeout - wait ON for this long.
 */
export function arrayLightUp(shapesMidi, n, speed, finalTimeout) {
    if (shapesMidi.lastMidiName &&
        MIDI_MAPS[shapesMidi.lastMidiName] &&
        MIDI_MAPS[shapesMidi.lastMidiName].OUTPUTS &&
        MIDI_MAPS[shapesMidi.lastMidiName].OUTPUTS.PAD
    ) {
        for (let i = 0; i < n; i++) {
            const channel = MIDI_MAPS[shapesMidi.lastMidiName].OUTPUTS.PAD[i]
            setTimeout(() => {
                shapesMidi.animate(shapesMidi.lastMidiName, channel, {
                    type: 'blink',
                    n: 0,
                    length: speed * (n - i) + finalTimeout
                })
            }, i * speed)
        }
    }
}

export function animateButtonChangedValue(shapesMidiController, channel) {
    // Light up the correspondent controller if provided.
    if (MIDI_MAPS[shapesMidiController.lastMidiName]) {
        if (MIDI_MAPS[shapesMidiController.lastMidiName].CORRESPONDENCE) {
            const correspondentChannel = MIDI_MAPS[shapesMidiController.lastMidiName]
                .CORRESPONDENCE[channel]
            if (correspondentChannel !== undefined) {
                shapesMidiController.animate(shapesMidiController.lastMidiName,
                    correspondentChannel,
                    CHANGE_ANIMATION)
            }
        }
    }
}

export function translateMidiKnobChannel(midiName, channel) {
    if (!MIDI_MAPS[midiName]) {
        return midiMapDoNotExistThrottled(midiName)
    }
    const channelIndex = MIDI_MAPS[midiName].INPUTS.KNOBS.indexOf(channel)
    return channelIndex
}


export function reverseTranslateMidiKnobChannel(midiName, n) {
    if (!MIDI_MAPS[midiName]) {
        return false
    }
    return MIDI_MAPS[midiName].INPUTS.KNOBS[n]
}



export const MIDI_MAPS = {
    'LPD8 MIDI 1': {
        INPUTS: {
            KNOBS: [
                1, 2, 3, 4,
                5, 6, 7, 8
            ],

            // BUTTON Modes: PAD, CC, PROG CHNG
            PAD:
                [
                    40, 41, 42, 43,
                    36, 37, 38, 39
                ]
        },
        OUTPUTS: {
            PAD: [
                40, 41, 42, 43,
                36, 37, 38, 39
            ]
        },

        CORRESPONDENCE: {
            1: 40, 2: 41, 3: 42, 4: 43,
            5: 36, 6: 37, 7: 38, 8: 39
        },
        MSG_TYPES: {
            144: 'KEY_DOWN',
            128: 'KEY_UP',
            176: 'VALUE_CHANGE'
        }
    }
}