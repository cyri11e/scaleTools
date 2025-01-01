class Bubble {
    constructor(x, y, radius, labels, hue, isInScale, labelType) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.labels = labels; // labels est maintenant un tableau
        this.currentLabelIndex = 0; // Index du label actuel
        this.hue = hue;
        this.isInScale = isInScale;
        this.labelType = labelType; // Ajouter la propriété labelType
    }

    draw() {
        push();
        if (this.isInScale) {
            fill(this.hue, 10, 10); // Utiliser la teinte pour le remplissage si la note est dans la gamme
        } else {
            noFill(); // Pas de remplissage si la note est hors gamme
        }
        stroke(255); // Contour blanc
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2); // Dessiner le cercle
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.labels[this.labelType] || '', this.x, this.y); // Utiliser labelType pour choisir le label
        pop();
    }

    cycleLabel() {
        this.currentLabelIndex = (this.currentLabelIndex + 1) % this.labels.length;
    }

    isMouseOver() {
        return dist(mouseX, mouseY, this.x, this.y) < this.radius;
    }
}

class vScale {
    constructor(scale, x, y, width = 200, height = 100) {
        this.scale = scale;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isDragging = false;
        this.isResizing = false;
        this.isDraggingNote = false;
        this.draggedNoteIndex = null;
        this.dragStartX = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.aspectRatio = width / height;
        this.labelType = 0; // Par défaut, afficher les intervalles
        this.notes = this.createNotes(); // Initialiser les notes
        this.isLabelHovered = false;
        this.isModeHovered = false;
    }

    createNotes() {
        let notes = [];
        let radius = this.height / 4; // Initialiser les diamètres des bulles à la moitié de la hauteur du rectangle
        for (let i = 0; i < 12; i++) {
            let labels = [
                this.scale.labels.degrees[i] || '', 
                this.scale.labels.intervals[i] || '', 
                this.scale.labels.notes[i] || ''
            ]; // Assurez-vous que les 3 labels sont inclus et non null
            let isInScale = this.scale.intervals.semitones.includes(i);
            let x = this.x + radius + i * (2 * radius);
            let y = this.y + this.height / 2;
            notes.push(new Bubble(x, y, radius, labels, i, isInScale, this.labelType));
        }
        return notes;
    }

    updateNotes() {
        let radius = this.height / 4; // Initialiser les diamètres des bulles à la moitié de la hauteur du rectangle
        for (let i = 0; i < 12; i++) {
            let x = this.x + radius + i * (2 * radius);
            let y = this.y + this.height / 2;
            let labels = [
                this.scale.labels.degrees[i] || '', 
                this.scale.labels.intervals[i] || '', 
                this.scale.labels.notes[i] || ''
            ]; // Assurez-vous que les 3 labels sont inclus et non null
            let isInScale = this.scale.intervals.semitones.includes(i);
            this.notes[i].x = x;
            this.notes[i].y = y;
            this.notes[i].radius = radius;
            this.notes[i].labels = labels;
            this.notes[i].isInScale = isInScale;
            this.notes[i].labelType = this.labelType; // Mettre à jour labelType
        }
    }

    draw() {
        push();
        translate(this.x, this.y); // Déplacer le système de coordonnées à l'emplacement de l'objet vScale
        // Afficher le nom de la gamme
        textSize(16 * (this.width / 200));
        fill(255); // Texte en blanc
        noStroke();
        if (this.scale.name) {
            text(this.scale.name, 10 * (this.width / 200), 20 * (this.height / 100));
            if (this.isLabelHovered) {
                stroke(255);
                line(10 * (this.width / 200), 22 * (this.height / 100), 10 * (this.width / 200) + textWidth(this.scale.name), 22 * (this.height / 100));
            }
        }

        // Afficher le mode à droite du rectangle
        if (this.scale.mode) {
            text(this.scale.mode, this.width - 10 * (this.width / 200), 20 * (this.height / 100));
            if (this.isModeHovered) {
                stroke(255);
                line(this.width - 10 * (this.width / 200), 22 * (this.height / 100), this.width - 10 * (this.width / 200) + textWidth(this.scale.mode), 22 * (this.height / 100));
            }
        }

        // Afficher les notes en demi-tons dans un tableau horizontal
        this.drawSemitoneTable();

        // Dessiner les icônes de déplacement et de redimensionnement
        this.drawIcons();
        pop();
    }

    drawSemitoneTable() {
        push();
        let textSizeValue = this.height / 3;
        textSize(textSizeValue);
        noStroke();
        let spacing = this.height / 2; // Espacer les notes de la moitié de la hauteur du cadre
        let radius = this.height / 4; // Rayon du cercle
        textAlign(CENTER, CENTER); // Centrer le texte
        colorMode(HSB, 12); // Utiliser le mode de couleur HSB avec une plage de teinte de 0 à 12
        for (let i = 0; i < 12; i++) {
            let interval = this.scale.labels.intervals[i] || '';
            let x = radius + i * spacing; // Déplacer pour que le premier cercle touche le bord gauche du cadre
            let y = this.height / 2;
            let isInScale = this.scale.intervals.semitones.includes(i);
            let bubble = new Bubble(x, y, radius, [interval, this.scale.labels.degrees[i] || '', this.scale.labels.notes[i] || ''], i, isInScale, this.labelType); // Ajouter plusieurs labels
            bubble.draw();
        }
        pop();
    }

    drawIcons() {
        if (this.isMouseOver() || this.isMouseOverMoveIcon()) {
            push();
            // Dessiner le pourtour blanc avec des lignes, en évitant le cercle du bouton et sans fermer le rectangle
            stroke(255);
            noFill();
            let offset = 12.5 * (this.width / 200);
            line(offset, 0, this.width, 0);
            line(this.width, 0, this.width, this.height);
            line(this.width, this.height, 0, this.height);
            line(0, this.height, 0, offset);

            // Icône de déplacement (coin supérieur gauche)
            this.drawMoveIcon();

            // Icône de redimensionnement (coin inférieur droit)
            this.drawResizeIcon();
            pop();
        }
    }

    drawMoveIcon() {
        push();
        // Dessiner une icône de déplacement avec des triangles évidés pointant vers l'extérieur, entourés d'un cercle
        noFill();
        stroke(255);
        let size = 25 * (this.width / 200); // Utiliser la largeur pour la proportion
        ellipse(0, 0, size, size);

        fill(255);
        noStroke();
        let triangleSize = 3 * (this.width / 200); // Utiliser la largeur pour la proportion
        let triangleHeight = 6 * (this.width / 200); // Utiliser la largeur pour la proportion
        triangle(-triangleSize, -triangleHeight, 0, -triangleHeight * 2, triangleSize, -triangleHeight);
        triangle(-triangleSize, triangleHeight, 0, triangleHeight * 2, triangleSize, triangleHeight);
        triangle(-triangleHeight, -triangleSize, -triangleHeight * 2, 0, -triangleHeight, triangleSize);
        triangle(triangleHeight, -triangleSize, triangleHeight * 2, 0, triangleHeight, triangleSize);
        pop();
    }

    drawResizeIcon() {
        push();
        // Dessiner un triangle rectangle dans le coin inférieur droit, sans toucher le bord
        fill(255);
        noStroke();
        let size = 10 * (this.width / 200);
        triangle(this.width - size - 5, this.height - 5, this.width - 5, this.height - 5, this.width - 5, this.height - size - 5);
        pop();
    }

    isMouseOver() {
        return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.height;
    }

    isMouseOverMoveIcon() {
        return dist(mouseX, mouseY, this.x, this.y) < 12.5 * (this.width / 200);
    }

    isMouseOverResizeIcon() {
        return dist(mouseX, mouseY, this.x + this.width - 5, this.y + this.height - 5) < 10 * (this.width / 200);
    }

    isMouseOverLabel() {
        const labelX = this.x + 10 * (this.width / 200);
        const labelY = this.y + 20 * (this.height / 100);
        const labelWidth = textWidth(this.scale.name);
        const labelHeight = textAscent() + textDescent(); // Utiliser textHeight pour la zone sensible
        return mouseX > labelX && mouseX < labelX + labelWidth &&
               mouseY > labelY - labelHeight && mouseY < labelY + labelHeight;
    }

    isMouseOverMode() {
        const modeX = this.x + this.width - 10 * (this.width / 200);
        const modeY = this.y + 20 * (this.height / 100);
        const modeWidth = textWidth(this.scale.mode);
        const modeHeight = textAscent() + textDescent(); // Utiliser textHeight pour la zone sensible
        return mouseX > modeX && mouseX < modeX + modeWidth &&
               mouseY > modeY - modeHeight && mouseY < modeY + modeHeight;
    }

    startDragging() {
        this.isDragging = true;
        this.offsetX = mouseX - this.x;
        this.offsetY = mouseY - this.y;
    }

    stopDragging() {
        this.isDragging = false;

        this.stopDraggingNote();
    }

    startResizing() {
        this.isResizing = true;
        this.offsetX = mouseX - this.x - this.width;
        this.offsetY = mouseX - this.y - this.height;
    }

    stopResizing() {
        this.isResizing = false;
    }

    startDraggingNote() {
        this.isDraggingNote = true;
        this.draggedNoteIndex = this.notes.findIndex(note => dist(mouseX, mouseY, note.x, note.y) < note.radius);
        if (this.draggedNoteIndex !== -1) {
            console.log(`Note clicked: Index ${this.draggedNoteIndex}`); // Log l'indice de la note cliquée
            this.dragStartX = mouseX; // Enregistrer la position de départ du clic
        }
    }

    stopDraggingNote() {
        if (this.draggedNoteIndex !== null) {
            const draggedNote = this.notes[this.draggedNoteIndex];
            const alteration = mouseX > this.dragStartX ? 1 : -1;
            const semitoneIndex = this.scale.intervals.semitones.indexOf(draggedNote.hue);
            if (semitoneIndex !== -1 && semitoneIndex !== 0) { // Ne pas appeler modifyNote pour la tonique
                this.scale.modifyNote(semitoneIndex, alteration); // Utiliser l'indice en demi-ton correspondant
                this.updateNotes();
                console.log(`Note released: Index ${this.draggedNoteIndex}`); // Log l'indice de la note relâchée
                console.log(mouseX > this.dragStartX ? "droite" : "gauche"); // Afficher droite ou gauche selon la position de départ du clic
            }
        }
        this.isDraggingNote = false;
        this.draggedNoteIndex = null;
    }

    handleMousePressed() {
        console.log("handleMousePressed called"); // Debug
        if (this.isMouseOverMoveIcon()) {
            console.log("Move icon clicked in handleMousePressed"); // Debug
            this.startDragging();
        }
        if (this.isMouseOverResizeIcon()) {
            console.log("Resize icon clicked in handleMousePressed"); // Debug
            this.startResizing();
        }
        if (this.isMouseOverLabel()) {
            console.log("Scale name clicked in handleMousePressed"); // Debug
            this.cycleScale();
        }
        if (this.isMouseOverMode()) {
            console.log("Mode clicked in handleMousePressed"); // Debug
            this.cycleMode();
        }
        if (this.notes.some(note => dist(mouseX, mouseY, note.x, note.y) < note.radius)) {
            console.log("Note clicked in handleMousePressed"); // Debug
            this.startDraggingNote();
        }
        if (this.notes[0].isMouseOver()) {
            console.log("Tonic clicked in handleMousePressed"); // Debug
            this.cycleLabelType(); // Cycler les labels de la tonique et de toutes les bulles
        }
    }

    handleMouseReleased() {
        console.log("handleMouseReleased called"); // Debug
        this.stopDragging();
        this.stopResizing();
        this.stopDraggingNote();
    }

    cycleLabelType() {
        this.labelType = (this.labelType + 1) % this.notes[0].labels.length;
        this.notes.forEach(note => note.labelType = this.labelType);
        this.updateNotes();
    }

    getScaleIndex() {
        return SCALES_NAMES.indexOf(this.scale.name);
    }

    getModeIndex() {
        return MODES[this.scale.scaleType].indexOf(this.scale.mode);
    }

    cycleScale() {
        const currentIndex = this.getScaleIndex();
        const nextIndex = (currentIndex + 1) % SCALES_NAMES.length;
        this.scale.name = SCALES_NAMES[nextIndex];
        this.scale.scaleType = nextIndex; // Mettre à jour scaleType
        this.scale.mode = MODES[nextIndex][0]; // Passer au premier mode de la nouvelle gamme
        this.scale.createFullScale(this.scale.name, this.scale.mode);
        this.updateNotes(); // Mettre à jour les notes
        console.log(`Scale changed to: ${this.scale.name}, Mode: ${this.scale.mode}, ScaleType: ${this.scale.scaleType}`); // Debug
    }

    cycleMode() {
        const currentIndex = this.getModeIndex();
        const nextIndex = (currentIndex + 1) % MODES[this.scale.scaleType].length;
        this.scale.mode = MODES[this.scale.scaleType][nextIndex];
        this.scale.createFullScale(this.scale.name, this.scale.mode);
        this.updateNotes(); // Mettre à jour les notes
        console.log(`Mode changed to: ${this.scale.mode}, ScaleType: ${this.scale.scaleType}`); // Debug
    }

    update() {
        if (this.isDragging) {
            this.x = mouseX - this.offsetX;
            this.y = mouseY - this.offsetY;
        }

        if (this.isResizing) {
            let newWidth = mouseX - this.x - this.offsetX;
            let newHeight = newWidth / this.aspectRatio;
            if (newHeight + this.y <= windowHeight && newWidth + this.x <= windowWidth) {
                this.width = newWidth;
                this.height = newHeight;
            }
        }

        // Mettre à jour l'état de survol des labels
        this.isLabelHovered = this.isMouseOverLabel();
        this.isModeHovered = this.isMouseOverMode();
        this.updateNotes(); // Mettre à jour les notes
    }
}
