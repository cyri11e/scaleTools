class vScale {
    constructor(scale, x, y, width = 200, height = 100, circular = false) {
        this.scale = scale;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.centerX = width / 2; // Centre du rectangle
        this.centerY = height / 2; // Centre du rectangle
        this.isDragging = false;
        this.isResizing = false;
        this.isDraggingNote = false;
        this.draggedNoteIndex = null;
        this.dragStartX = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.aspectRatio = width / height;
        this.labelType = 0; // Par défaut, afficher les intervalles
        this.circular = circular; // Affichage circulaire ou en ligne
        this.notes = this.createNotes(); // Initialiser les notes
        this.isLabelHovered = false;
        this.isModeHovered = false;
        this.hotzones = {
            frame: { x: 0, y: 0, w: 0, h: 0 },
            move: { x: 0, y: 0, r: 0 },
            resize: { x: 0, y: 0, w: 0, h: 0 },
            label: { x: 0, y: 0, w: 0, h: 0 },
            mode: { x: 0, y: 0, w: 0, h: 0 }
        };
    }

    createNotes() {
        return this.circular ? this.createCircularNotes() : this.createLinearNotes();
    }

    createLinearNotes() {
        let notes = [];
        let circleRadius = this.height / 4; // Le diamètre est la moitié de la hauteur du cadre
        for (let i = 0; i < 12; i++) {
            let { x, y } = this.getLinearCoordinates(i, circleRadius);
            let labels = [
                this.scale.labels.degrees[i] || '', 
                this.scale.labels.intervals[i] || '', 
                this.scale.labels.notes[i] || ''
            ]; // Assurez-vous que les 3 labels sont inclus et non null
            let isInScale = this.scale.intervals.semitones.includes(i);
            notes.push(new Bubble(x, y, circleRadius, labels, i, isInScale, this.labelType));
        }
        return notes;
    }

    createCircularNotes() {
        let notes = [];
        let circleRadius = this.height / 4; // Le diamètre est la moitié de la hauteur du cadre
        for (let i = 0; i < 12; i++) {
            let { x, y } = this.getCircularCoordinates(i, this.centerX, this.centerY, this.height / 2);
            let labels = [
                this.scale.labels.degrees[i] || '', 
                this.scale.labels.intervals[i] || '', 
                this.scale.labels.notes[i] || ''
            ]; // Assurez-vous que les 3 labels sont inclus et non null
            let isInScale = this.scale.intervals.semitones.includes(i);
            notes.push(new Bubble(x, y, circleRadius, labels, i, isInScale, this.labelType));
        }
        return notes;
    }

    updateNotes() {
        let circleRadius = this.height / 4; // Le diamètre est la moitié de la hauteur du cadre
        for (let i = 0; i < 12; i++) {
            let { x, y } = this.circular 
                ? this.getCircularCoordinates(i, this.centerX, this.centerY, this.height / 2)
                : this.getLinearCoordinates(i, circleRadius);
            let labels = [
                this.scale.labels.degrees[i] || '', 
                this.scale.labels.intervals[i] || '', 
                this.scale.labels.notes[i] || ''
            ]; // Assurez-vous que les 3 labels sont inclus et non null
            let isInScale = this.scale.intervals.semitones.includes(i);
            this.notes[i].x = x + this.x; // Mettre à jour la position x de la bulle
            this.notes[i].y = y + this.y; // Mettre à jour la position y de la bulle
            this.notes[i].radius = circleRadius;
            this.notes[i].labels = labels;
            this.notes[i].isInScale = isInScale;
            this.notes[i].labelType = this.labelType; // Mettre à jour labelType
        }
    }

    draw() {
        this.updateHotzones();
        push();
        translate(this.x, this.y); // Déplacer le système de coordonnées à l'emplacement de l'objet vScale
        // Afficher le nom de la gamme avec la tonique
        textSize(16 * (this.width / 200));
        fill(255); // Texte en blanc
        noStroke();
        this.drawScaleName();
        this.drawScaleMode();

        // Afficher les notes en demi-tons dans un tableau horizontal ou circulaire
        this.drawSemitoneTable();

        // Dessiner les icônes de déplacement et de redimensionnement
        this.drawHotzones(); 
        this.drawIcons();
        pop();
    }

    drawScaleName() {
        push();
        if (this.scale.name && this.scale.key) {
            text(`${this.scale.key} ${this.scale.name}`, 10 * (this.width / 200), 20 * (this.height / 100));
            if (this.isLabelHovered) {
                stroke(255);
                line(10 * (this.width / 200), 22 * (this.height / 100), 10 * (this.width / 200) + textWidth(`${this.scale.key} ${this.scale.name}`), 22 * (this.height / 100));
            }
        }
        pop();
    }

    drawScaleMode() {
        push();
        if (this.scale.mode) {
            text(this.scale.mode, this.width - 10 * (this.width / 200), 20 * (this.height / 100));
            if (this.isModeHovered) {
                stroke(255);
                line(this.width - 10 * (this.width / 200), 22 * (this.height / 100), this.width - 10 * (this.width / 200) + textWidth(this.scale.mode), 22 * (this.height / 100));
            }
        }
        pop();
    }

    drawSemitoneTable() {
        push();
        let textSizeValue = this.height / 3;
        textSize(textSizeValue);
        noStroke();
        let circleRadius = this.height / 4;
        let scaleRadius = this.height ;
        textAlign(CENTER, CENTER); // Centrer le texte
        colorMode(HSB, 12); // Utiliser le mode de couleur HSB avec une plage de teinte de 0 à 12
        for (let i = 0; i < 12; i++) {
            let interval = this.scale.labels.intervals[i] || '';
            let x, y;
            if (this.circular) {
                ({ x, y } = this.getCircularCoordinates(i, this.centerX, this.centerY, scaleRadius));
            } else {
                ({ x, y } = this.getLinearCoordinates(i, circleRadius));
            }
            let isInScale = this.scale.intervals.semitones.includes(i);
            let bubble = new Bubble(x, y, circleRadius, [interval, this.scale.labels.degrees[i] || '', this.scale.labels.notes[i] || ''], i, isInScale, this.labelType); // Ajouter plusieurs labels
            bubble.draw();
        }
        pop();
    }

    getLinearCoordinates(i, size) {
        let x =  size + i * (2 * size); // Ajuster l'espacement des bulles
        let y =  this.height / 2;
        return { x, y };
    }

    getCircularCoordinates(i, x, y, size) {
        const angle = TWO_PI * (i / 12) - HALF_PI; // Ajuster l'angle pour que la tonique soit en haut
        x = x + cos(angle) * size;
        y = y + sin(angle) * size;
        return { x, y };
    }

    drawInteractiveFrame() {
        push();
        stroke(255);
        noFill();
        let offset = 12.5 * (this.width / 200);
        line(offset, 0, this.width, 0);
        line(this.width, 0, this.width, this.height);
        line(this.width, this.height, 0, this.height);
        line(0, this.height, 0, offset);

        this.drawMoveIcon();
        this.drawResizeIcon();
        pop();
    }

    drawIcons() {
        if (this.isFrameHovered() || this.isMouseOverMoveIcon()) {
            this.drawInteractiveFrame();
        }
    }

    drawMoveIcon() {
        push();
        noFill();
        stroke(255);
        let size = 25 * (this.width / 200);
        ellipse(0, 0, size, size);

        fill(255);
        noStroke();
        let triangleSize = 3 * (this.width / 200);
        let triangleHeight = 6 * (this.width / 200);
        triangle(-triangleSize, -triangleHeight, 0, -triangleHeight * 2, triangleSize, -triangleHeight);
        triangle(-triangleSize, triangleHeight, 0, triangleHeight * 2, triangleSize, triangleHeight);
        triangle(-triangleHeight, -triangleSize, -triangleHeight * 2, 0, -triangleHeight, triangleSize);
        triangle(triangleHeight, -triangleSize, triangleHeight * 2, 0, triangleHeight, triangleSize);
        pop();
    }

    drawResizeIcon() {
        push();
        fill(255);
        noStroke();
        let size = 10 * (this.width / 200);
        triangle(this.width - size - 5, this.height - 5, this.width - 5, this.height - 5, this.width - 5, this.height - size - 5);
        pop();
    }

    drawHotzones() {
        push();
        stroke(255, 0, 0);
        noFill();

        // Cadre
        rect(this.hotzones.frame.x, this.hotzones.frame.y, this.hotzones.frame.w, this.hotzones.frame.h);

        // Déplacement
        ellipse(this.hotzones.move.x, this.hotzones.move.y, this.hotzones.move.r * 2);

        // Redimensionnement
        rect(this.hotzones.resize.x, this.hotzones.resize.y, this.hotzones.resize.w, this.hotzones.resize.h);

        // Label
        rect(this.hotzones.label.x, this.hotzones.label.y, this.hotzones.label.w, this.hotzones.label.h);

        // Mode
        rect(this.hotzones.mode.x, this.hotzones.mode.y, this.hotzones.mode.w, this.hotzones.mode.h);

        pop();
    }

    updateHotzones() {
        // Cadre
        this.hotzones.frame.x = 0;
        this.hotzones.frame.y = 0;
        this.hotzones.frame.w = this.width;
        this.hotzones.frame.h = this.height;

        // Icône de déplacement
        this.hotzones.move.x = 0;
        this.hotzones.move.y = 0;
        this.hotzones.move.r = 12.5 * (this.width / 200);

        // Icône de redimensionnement
        let resizeSize = 10 * (this.width / 200);
        this.hotzones.resize.x = this.width - resizeSize - 5;
        this.hotzones.resize.y = this.height - resizeSize - 5;
        this.hotzones.resize.w = resizeSize;
        this.hotzones.resize.h = resizeSize;

        // Label
        const labelX = 10 * (this.width / 200);
        const labelY = 20 * (this.height / 100);
        const labelW = textWidth(`${this.scale.key} ${this.scale.name}`);
        const labelH = textAscent() + textDescent();
        this.hotzones.label.x = labelX;
        this.hotzones.label.y = labelY - labelH;
        this.hotzones.label.w = labelW;
        this.hotzones.label.h = labelH;

        // Mode
        const modeX = this.width - 10 * (this.width / 200);
        const modeY = 20 * (this.height / 100);
        const modeW = textWidth(this.scale.mode);
        const modeH = textAscent() + textDescent();
        this.hotzones.mode.x = modeX;
        this.hotzones.mode.y = modeY - modeH;
        this.hotzones.mode.w = modeW;
        this.hotzones.mode.h = modeH;
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
        const labelWidth = textWidth(`${this.scale.key} ${this.scale.name}`);
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

    isMouseOverNote() {
        return this.notes.some(note => note.isMouseOver());
    }

    isFrameHovered() {
        return (
            mouseX > this.x &&
            mouseX < this.x + this.width &&
            mouseY > this.y &&
            mouseY < this.y + this.height
        );
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
                console.log((mouseX > this.dragStartX)&&(mouseX != this.dragStartX) ? "droite" : "gauche"); // Afficher droite ou gauche selon la position de départ du clic
            }
        }
        this.isDraggingNote = false;
        this.draggedNoteIndex = null;
    }

    handleMousePressed() {
         if (this.isMouseOverMoveIcon()) {
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
        if (this.isMouseOverNote()) {
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
        console.log(`Scale changed to: ${this.scale.key} ${this.scale.name}, Mode: ${this.scale.mode}, ScaleType: ${this.scale.scaleType}`); // Debug
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
            this.updateNotes(); // Mettre à jour les notes après déplacement
        }

        if (this.isResizing) {
            let newWidth = mouseX - this.x - this.offsetX;
            let newHeight = newWidth / this.aspectRatio;
            if (newHeight + this.y <= windowHeight && newWidth + this.x <= windowWidth) {
                this.width = newWidth;
                this.height = newHeight;
                this.centerX = this.width / 2; // Mettre à jour le centre du rectangle
                this.centerY = this.height / 2; // Mettre à jour le centre du rectangle
                this.updateNotes(); // Mettre à jour les notes après redimensionnement
            }
        }

        // Mettre à jour l'état de survol des labels
        this.isLabelHovered = this.isMouseOverLabel();
        this.isModeHovered = this.isMouseOverMode();
    }
}
