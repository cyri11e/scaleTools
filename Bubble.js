class Bubble {
    constructor(x, y, radius, labels, hue, isInScale, labelType, visualMode = 'color', showOffScale = true) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.labels = labels; // labels est maintenant un tableau
        this.currentLabelIndex = 0; // Index du label actuel
        this.hue = hue;
        this.isInScale = isInScale;
        this.isHighlighted = false;
        this.isPlaying = false;
        this.visualMode = visualMode; // Mode visuel par défaut
        this.labelType = labelType; // degre interval note chord
    }

    draw() {
        push();
        this.isHighlighted = this.isMouseOver() || this.isPlaying;

        colorMode(HSB, 12); // Utiliser le mode HSB       
        let shadowOffset = this.radius / 20;
        textAlign(CENTER, CENTER);

        if (this.visualMode === 'color') {
            if (this.isInScale) {
                fill(this.hue, this.isHighlighted ? 12 : 8, this.isHighlighted ? 12 : 8); // Utiliser la teinte pour le remplissage si la note est dans la gamme
            } else {
                noFill(); // Pas de remplissage si la note est hors gamme
            }
            stroke(this.hue , 12 , 12 ); // Contour blanc
            strokeWeight(Math.round(this.radius / (this.isHighlighted ? 5 : 30) )); // Augmenter l'épaisseur du contour si la bulle est survolée

            ellipse(this.x, this.y, this.radius * 2, this.radius * 2); // Dessiner le cercle
            
            noStroke();
            textSize(this.radius * 1.3);
            fill(4, 0, 2, this.isHighlighted ? 0 : 12);
            
            if (this.isInScale)
                displayDegreLabel(this.labels[this.labelType] || '', this.x + shadowOffset, this.y + shadowOffset); // Utiliser labelType pour choisir le label
                if (this.labels.note != undefined){
                    fill(12)

                    textSize(this.radius * 0.5);
                    displayNoteLabel(this.labels.note || '', this.x , this.y + this.radius * 0.8  ); // Utiliser labelType pour choisir le label
                }
 
            if (this.isInScale) {
                fill(12);  
            } else {               
                fill(0, 0, 12, this.isHighlighted ? 10 : 3);  
            }
            textSize(this.radius * 1.3);
            displayDegreLabel(this.labels[this.labelType] || '', this.x - shadowOffset, this.y - shadowOffset); // Utiliser labelType pour choisir le label
            noFill();
        } else if (this.visualMode === 'invisible') {
            // MODE INVISIBLE
            // effet glow
            drawingContext.shadowBlur = 10;
            drawingContext.shadowColor = 'rgba(255, 255, 255, 0.7)';
   
            strokeWeight(this.radius / (this.isHighlighted ? 5 : 50)); // Augmenter l'épaisseur du contour si la bulle est survolée
          
            noFill();
            stroke(255);
            ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
            
            noStroke();
            if (this.isInScale) { 
                fill(0, 0, 12, this.isHighlighted ? 12 : 10);
                textSize(this.radius * 1.3);
                displayDegreLabel(this.labels[this.labelType] || '', this.x - shadowOffset, this.y - shadowOffset); // Utiliser labelType pour choisir le label
                if (this.labels.note) {
                    textSize(this.radius * 0.5);
                    displayNoteLabel(this.labels.note || '', this.x , this.y + this.radius * 0.8 ); // Utiliser labelType pour choisir le label
                }
            } else {       
                fill(0, 0, 12, this.isHighlighted ? 12 : 0.5);
                textSize(this.radius);
                displayDegreLabel(this.labels[this.labelType] || '', this.x - shadowOffset, this.y - shadowOffset); // Utiliser labelType pour choisir le label
            }        
        }
        pop();
    }

    cycleLabel() {
        this.currentLabelIndex = (this.currentLabelIndex + 1) % this.labels.length;
    }

    isMouseOver() {
        return dist(mouseX, mouseY, this.x, this.y) < this.radius;
    }

    toggleVisualMode() {      
        this.visualMode = this.visualMode === 'color' ? 'invisible' : 'color';
    }

    toggleLabelType() {
        this.labelType = (this.labelType + 1) % LABEL_TYPES.length;
    }
}












function displayDegreLabel(note, x, y) {
    let size = textSize();
    push();
    textAlign(CENTER, CENTER);
    if (note.includes('##')) note = note.replace('##', '𝄪');
    if (note.includes('#')) note = note.replace('#', '♯');
    if (note.includes('bb')) note = note.replace('bb', '𝄫');
    if (note.includes('b')) note = note.replace('b', '♭');

    if (note.length > 2) {
      text(note[0], x - 0.3 * size, y);
      textSize(0.6 * size);
      text(note[1] + note[2], x + 0.3 * size, y - 0.3 * size);
    } else if (note.length == 2) {
      text(note[1], x + 0.1 * size, y);
      textSize(0.8 * size);
      text(note[0], x - 0.3 * size, y - 0.2 * size);
    } else {
      textSize(size);
      text(note[0], x, y);
    }

    pop();
  }

  function displayNoteLabel(note, x, y) {
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