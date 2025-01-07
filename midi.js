// midi.js
function initializeMidi(keyboard) {
  WebMidi.enable(function (err) {
    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      console.log("WebMidi enabled!");
      if (WebMidi.inputs.length > 0) {
        let input = WebMidi.inputs[0];
        input.addListener('noteon', "all", function (e) {
          keyboard.noteOn(e.note.number);
        });
        input.addListener('noteoff', "all", function (e) {
          keyboard.noteOff(e.note.number);
        });
      } else {
        console.log("No MIDI device connected.");
      }
    }
  });
}
