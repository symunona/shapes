
define([], () => {
    let callback;
    if (!navigator || !navigator.requestMIDIAccess) { return ()=>{}}
    navigator.requestMIDIAccess()
        .then(onMIDISuccess, function onMIDIFailure() { console.warn('No midi for your browser today...') });

    function onMIDISuccess(midiAccess) {
        var inputs = midiAccess.inputs;
        var outputs = midiAccess.outputs;

        for (var input of midiAccess.inputs.values()) {
            input.onmidimessage = getMIDIMessage;
        }

        function getMIDIMessage(midiMessage) {
            // console.warn(midiMessage.data[0], midiMessage.data[1], midiMessage.data[2], midiMessage);
            callback(midiMessage.data[1] - 1, midiMessage.data[2])
        }
    }
    return (_callback) => {
        callback = _callback
    }
})