class Piano {
  constructor(x, y, keyCount) {
    this.x = x;
    this.y = y;
    this.updateKeyCount(keyCount);
    this.selectedNotes = [];
    this.rubans = [];
  }

  // piano n 'est pas un objet d'affichage 
  // mais un conteneur de touches et de rubans
  // il transmet les événements de souris et de clavier
  // aux objets graphiques ket et ruban

  setKeyCount(count) {
    this.keyCount = count;
    this.updateSize();
  }

  updateKeyCount(keyCount) {
    this.keyCount = keyCount; // 25 C4 49 C3, 61 C2, 76 E1, 88 A0
    this.s = (windowWidth - 2 * this.x) / this.whiteCount(keyCount);
    this.keys = [];
    this.startNote = this.getStartNote(keyCount);
    for (let i = 0; i < keyCount; i++) {
      let keyType = this.getKeyType(i, keyCount);
      this.keys.push(
        new Key(
          i,
          this.startNote,
          keyType,
          this.x,
          this.y,
          this.s,
          false,
          true,
          'X'
        )
      );
    }
  }

  display() {
    push();
    text(this.selectedNotes, 10, 10)
    for (let key of this.keys) {
      key.display();
    }
    for (let i = this.rubans.length - 1; i >= 0; i--) {
      let ruban = this.rubans[i];
      ruban.update();
      ruban.display();
      if (ruban.endY <= 0) {
        this.rubans.splice(i, 1);
      }
    }
    textAlign(CENTER, CENTER);
    pop();
  }


  updateSize() {
    for (let key of this.keys) {
      key.updateSize((windowWidth - 2 * this.x) / this.whiteCount(this.keyCount));
    }
  }
  updateColor() {
    for (let key of this.keys) {
      key.updateColor();
    }
  }

  updateOctave(octave) {
    for (let key of this.keys) {
      key.updateOctave(octave);
    }
  }

  updateLiveNotes(liveNotes) {
    this.selectedNotes = [];
    for (let key of this.keys) {
      key.updateLiveNotes(liveNotes);
      this.selectedNotes.push(key.midiNoteLabel);
    }
  }

  createRuban(key) {
    let rubanWidth = key.isWhiteKey ? key.w : key.w * 0.8; // Rubans plus fins pour les touches noires
    if (key.isPlayed) { 
      let ruban = new Ruban(key.midiNote, key.midiNoteLabel, key.keyX, key.y, key.y, rubanWidth);
      this.rubans.push(ruban);
    }
  }

  stopRuban(midiNote) {
    for (let ruban of this.rubans) {
      if (ruban.midiNote === midiNote && ruban.isPlaying) {
        ruban.stop();
        break; // Arrêter la boucle après avoir trouvé et arrêté le ruban correspondant
      }
    }
  }

  
  toggleKeyCount(k) {
    let keyCountindex, keyCount;
    keyCountindex = keyCounts.indexOf(k);
    keyCountindex++;
    keyCountindex = keyCountindex % keyCounts.length;
    keyCount = keyCounts[keyCountindex];
    console.log(k + '>' + keyCount);
    return keyCount;
  }


  // interactions SOURIS

  mouseMoved() {
    for (let key of this.keys) {
      key.mouseMoved();
    }
  }

  mousePressed() {
    this.selectedNotes = [];
    for (let key of this.keys) {
      key.mousePressed();
      if (key.isSelected) {
        this.selectedNotes.push(key.midiNote);
      }
      if (key.isHover) {
        this.noteOn(key.midiNote); // Simuler un événement MIDI noteOn
      }
    }
  }

  mouseReleased() {
    for (let key of this.keys) {
      if (key.isHover) {
        this.noteOff(key.midiNote); // Simuler un événement MIDI noteOff
      }
    }
  }

  doubleClicked() {
    let note
    for (let key of this.keys) {  
      note  = key.doubleClicked();
      if (note) {
        console.log(note);
        break;
      }  
    }
  }

  getPianoNote() {
    let note
    for (let key of this.keys) {  
      note  = key.doubleClicked();
      if (note) {
        console.log(note);
        break;
      }  
    }
    return note
  }

  // CLAVIER

  keyPressed() {

    // c couleur /transparent
    if (keyCode == 67) {
      this.updateColor();
    }
    //z mode zoom
    if (keyCode == 90) {
      this.updateKeyCount(this.toggleKeyCount(this.keyCount));
    }
    //haut octave +
    if (keyCode == 38) {
      this.updateOctave(1);
    }
    //haut octave -
    if (keyCode == 40) {
      this.updateOctave(-1);
    }

    // Changer le nombre de touches du piano
    if (keyCode == 50) {
      // touche '2'
      this.updateKeyCount(25);
    }
    if (keyCode == 52) {
      // touche '4'
      this.updateKeyCount(49);
    }
    if (keyCode == 54) {
      // touche '6'
      this.updateKeyCount(61);
    }
    if (keyCode == 55) {
      // touche '7'
      this.updateKeyCount(76);
    }
    if (keyCode == 56) {
      // touche '8'
      this.updateKeyCount(88);
    }
  }


  // utils
  whiteCount(keyCount) {
    let whiteCount;
    if (this.keyCount == 25) whiteCount = 15;
    if (this.keyCount == 49) whiteCount = 29;
    if (this.keyCount == 61) whiteCount = 36;
    if (this.keyCount == 76) whiteCount = 45;
    if (this.keyCount == 88) whiteCount = 52;
    return whiteCount;
  }

  getStartNote(keyCount) {
    let startNote;
    if (keyCount == 88) startNote = 'A0';
    else if (keyCount == 76) startNote = 'E1';
    else if (keyCount == 61) startNote = 'C2';
    else startNote = 'C3';
    return startNote;
  }

  getKeyType(index, keyCount) {
    let keyType = 'middle';
    if (index == 0) keyType = 'first';
    else if (index == keyCount - 1) keyType = 'last';
    return keyType;
  }


  //  MIDI

  noteOn(midiNote) {
    for (let key of this.keys) {
      if (key.midiNote === midiNote) {
        key.isPlayed = true;
        // Marquer la note comme jouée
        this.createRuban(key);
      }
    }
  }

  noteOff(midiNote) {
    for (let key of this.keys) {
      if (key.midiNote === midiNote) {
        key.isPlayed = false;
        // Marquer la note comme relâchée
        this.stopRuban(key.midiNote);
      }
    }
  }
}