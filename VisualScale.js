class VisualScale {
    constructor(scale, x, y, width = 200, height = 100) {
        this.scale = scale;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isDragging = false;
        this.isResizing = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.aspectRatio = width / height;
        this.labelType = LABEL_TYPES[0]; // Par défaut, afficher les intervalles
        this.updateScale();
    }

    updateScale() {
        this.scale.updateScale();
        this.notes = this.createNotes();
    }

    createNotes() {
        let notes = [];
        let radius = this.height / 4; // Initialiser les diamètres des bulles à la moitié de la hauteur du rectangle
        for (let i = 0; i < 12; i++) {
            let label = this.labelType === 'degree' ? this.scale.fullIntervals.degrees[i] : this.scale.fullIntervals.diatonic[i];
            let isInScale = this.scale.intervals.semitones.includes(i);
            let x = this.x + radius * 2 * i + radius;
            let y = this.y + this.height / 2;
            notes.push(new Note(
                this.scale.fullIntervals.diatonic[i], 
                this.scale.fullIntervals.degrees[i], 
                i, // Ajout de l'indice en demi-ton
                x, y, radius, isInScale
            ));
        }
        return notes;
    }

    updateNotes() {
        let radius = this.height / 4; // Initialiser les diamètres des bulles à la moitié de la hauteur du rectangle
        for (let i = 0; i < 12; i++) {
            let x = this.x + radius * 2 * i + radius;
            let y = this.y + this.height / 2;
            let label = this.labelType === 'degree' ? this.scale.fullIntervals.degrees[i] : this.scale.fullIntervals.diatonic[i];
            let isInScale = this.scale.intervals.semitones.includes(i);
            this.notes[i].updatePosition(x, y);
            this.notes[i].updateRadius(radius);
            this.notes[i].updateInterval(this.scale.fullIntervals.diatonic[i], isInScale);
            this.notes[i].updateDegree(this.scale.fullIntervals.degrees[i]);
            this.notes[i].updateSemitoneIndex(i); // Mise à jour de l'indice en demi-ton
        }
    }

    display() {
        push();
        // Afficher le nom de la gamme
        textSize(16 * (this.width / 200));
        fill(255); // Texte en blanc
        noStroke();
        text(this.scale.name, this.x + 10 * (this.width / 200), this.y + 20 * (this.height / 100));

        // Afficher le mode à droite du rectangle
        text(this.scale.mode, this.x + this.width - 10 * (this.width / 200), this.y + 20 * (this.height / 100));

        // Dessiner les icônes de déplacement et de redimensionnement
        this.drawIcons();

        // Afficher les notes
        this.notes.forEach(note => note.display(this.labelType));
        pop();
    }

    drawIcons() {
        if (this.isMouseOver() || this.isMouseOverMoveIcon()) {
            push();
            // Dessiner le pourtour blanc avec des lignes, en évitant le cercle du bouton et sans fermer le rectangle
            stroke(255);
            noFill();
            let offset = 12.5 * (this.width / 200);
            line(this.x + offset, this.y, this.x + this.width, this.y);
            line(this.x + this.width, this.y, this.x + this.width, this.y + this.height);
            line(this.x + this.width, this.y + this.height, this.x, this.y + this.height);
            line(this.x, this.y + this.height, this.x, this.y + offset);

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
        ellipse(this.x, this.y, 25 * (this.width / 200), 25 * (this.height / 100));

        fill(255);
        noStroke();
        triangle(this.x - 3 * (this.width / 200), this.y - 6 * (this.height / 100), this.x, this.y - 11 * (this.height / 100), this.x + 3 * (this.width / 200), this.y - 6 * (this.height / 100));
        triangle(this.x - 3 * (this.width / 200), this.y + 6 * (this.height / 100), this.x, this.y + 11 * (this.height / 100), this.x + 3 * (this.width / 200), this.y + 6 * (this.height / 100));
        triangle(this.x - 6 * (this.width / 200), this.y - 3 * (this.height / 100), this.x - 11 * (this.width / 200), this.y, this.x - 6 * (this.width / 200), this.y + 3 * (this.height / 100));
        triangle(this.x + 6 * (this.width / 200), this.y - 3 * (this.height / 100), this.x + 11 * (this.width / 200), this.y, this.x + 6 * (this.width / 200), this.y + 3 * (this.height / 100));
        pop();
    }

    drawResizeIcon() {
        push();
        // Dessiner un triangle rectangle dans le coin inférieur droit, sans toucher le bord
        fill(255);
        noStroke();
        let size = 10 * (this.width / 200);
        triangle(this.x + this.width - size - 5, this.y + this.height - 5, this.x + this.width - 5, this.y + this.height - 5, this.x + this.width - 5, this.y + this.height - size - 5);
        pop();
    }

    isMouseOver() {
        return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
    }

    isMouseOverMoveIcon() {
        return dist(mouseX, mouseY, this.x, this.y) < 12.5 * (this.width / 200);
    }

    isMouseOverResizeIcon() {
        return dist(mouseX, mouseY, this.x + this.width - 5, this.y + this.height - 5) < 10 * (this.width / 200);
    }

    isMouseOverLabel() {
        return mouseX > this.x + 10 * (this.width / 200) && mouseX < this.x + 10 * (this.width / 200) + textWidth(this.scale.name) &&
               mouseY > this.y + 20 * (this.height / 100) - 16 * (this.width / 200) && mouseY < this.y + 20 * (this.height / 100);
    }

    isMouseOverMode() {
        return mouseX > this.x + this.width - 10 * (this.width / 200) && mouseX < this.x + this.width - 10 * (this.width / 200) + textWidth(this.scale.mode) &&
               mouseY > this.y + 20 * (this.height / 100) - 16 * (this.width / 200) && mouseY < this.y + 20 * (this.height / 100);
    }

    isMouseOverTonic() {
        return this.notes[0].isMouseOver();
    }

    startDragging() {
        this.isDragging = true;
        this.offsetX = mouseX - this.x;
        this.offsetY = mouseY - this.y;
    }

    stopDragging() {
        this.isDragging = false;
    }

    startResizing() {
        this.isResizing = true;
        this.offsetX = mouseX - this.x - this.width;
        this.offsetY = mouseX - this.y - this.height;
    }

    stopResizing() {
        this.isResizing = false;
    }

    handleMousePressed() {
        if (this.isMouseOverMoveIcon()) {
            this.startDragging();
        } else if (this.isMouseOverResizeIcon()) {
            this.startResizing();
        } else if (this.isMouseOverLabel()) {
            this.cycleScale();
        } else if (this.isMouseOverMode()) {
            this.cycleMode();
        } else if (this.isMouseOverTonic()) {
            this.toggleLabelType();
        }
    }

    handleMouseReleased() {
        this.stopDragging();
        this.stopResizing();
    }

    handleMouseDoubleClicked() {
        this.notes.forEach((note, index) => {
            if (note.isMouseOver()) {
                this.toggleNote(index);
            }
        });
    }

    toggleNote(noteIndex) {
        let note = this.notes[noteIndex];
        note.isInScale = !note.isInScale;
        let semitones = this.notes.filter(note => note.isInScale).map(note => note.semitoneIndex);
        this.scale.intervals = this.scale.calculateIntervals(semitones);
        this.updateScale(); // Recalculer la gamme après avoir basculé l'état d'une note
    }

    cycleScale() {
        const currentIndex = SCALES_NAMES.indexOf(this.scale.name);
        const nextIndex = (currentIndex + 1) % SCALES_NAMES.length;
        this.scale.name = SCALES_NAMES[nextIndex];
        this.scale.semitones = SCALES_SEMITONES[nextIndex];
        this.scale.mode = MODES[nextIndex][0];
        this.scale.scaleType = nextIndex;
        this.scale.updateScale();
        this.updateScale();
    }

    cycleMode() {
        const currentIndex = MODES[this.scale.scaleType].indexOf(this.scale.mode);
        const nextIndex = (currentIndex + 1) % MODES[this.scale.scaleType].length;
        this.scale.mode = MODES[this.scale.scaleType][nextIndex];
        this.scale.updateScale();
        this.updateScale();
    }

    toggleLabelType() {
        const currentIndex = LABEL_TYPES.indexOf(this.labelType);
        this.labelType = LABEL_TYPES[(currentIndex + 1) % LABEL_TYPES.length];
        this.updateNotes();
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

        // Mettre à jour les notes
        this.updateNotes();
        this.notes.forEach(note => note.handleMouseOver());
    }
}
