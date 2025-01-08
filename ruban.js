class Ruban {
  constructor(midiNote, label, startX, startY, endY, width) {
    this.midiNote = midiNote;
    this.label = label.replace(/[0-9]/g, ''); // Enlever le numéro d'octave
    this.startX = startX;
    this.startY = startY;
    this.endY = endY;
    this.width = width;
    this.isPlaying = true;
    this.speed = 2; // Vitesse constante
  }

  update() {
    if (this.isPlaying) {
      this.startY -= this.speed;
    } else {
      this.startY -= this.speed;  
      this.endY -= this.speed;
    }

    // Supprimer le ruban lorsque le segment stop atteint le haut de l'écran
    if (this.endY <= 0) {
      this.isPlaying = false;
    }
  }

  display() {
    if (this.endY > 0) {
      push();
      colorMode(HSB, 12, 12, 12); // Utiliser le mode de couleur HSB
      noFill();
      stroke(this.midiNote %12, 12 ,12); // Couleur blanche
      strokeWeight(this.width / 10); // Augmenter l'épaisseur du trait

      // Ajouter un effet de glow
      drawingContext.shadowBlur = 30;
      drawingContext.shadowColor = 'rgba(255, 255, 255, 0.8)';

      rect(this.startX, this.startY, this.width, this.endY - this.startY, 10); // Coins arrondis

      // Afficher le label si le ruban est assez long
      if ((this.endY - this.startY > 40)&(this.isPlaying)) {
        fill(this.midiNote %12, 12 ,12); 
        noStroke();
        textSize(this.width); // Augmenter la taille du texte
        textAlign(CENTER, TOP);
        this.displayNoteLabel(this.label, this.startX + this.width / 2, this.startY + this.width / 10);
      }
      if (!this.isPlaying) {
        fill(this.midiNote %12, 12 ,12);
        noStroke();
        textSize(this.width); // Augmenter la taille du texte
        textAlign(CENTER, TOP);
        this.displayNoteLabel(this.label, this.startX + this.width / 2, this.endY - this.width );
      }

      pop();
    }
  }

  displayNoteLabel(note, x, y) {
    let size = textSize();
    push();

    if (note.includes('##')) note = note.replace('##', '𝄪');
    if (note.includes('#')) note = note.replace('#', '♯');
    if (note.includes('bb')) note = note.replace('bb', '𝄫');
    if (note.includes('b')) note = note.replace('b', '♭');

    if (note.length > 2) {
      text(note[0], x - 0.3 * size, y);
      textSize(0.6 * size);
      text(note[1] + note[2], x + 0.3 * size, y - 0.3 * size);
    } else if (note.length == 2) {
      text(note[0], x - 0.1 * size, y);
      textSize(0.6 * size);
      text(note[1], x + 0.3 * size, y - 0.2 * size);
    } else {
      textSize(size);
      text(note[0], x, y);
    }

    pop();
  }

  stop() {
    console.log('stop' + this.label);
    this.isPlaying = false;
  }
}
