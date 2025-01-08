class Label {
    constructor(text, x, y, size, align = LEFT, labelType = 'scale') {
        this.text = text;
        this.x = x;
        this.y = y;
        this.size = size;
        this.align = align;
        this.labelType = labelType; // pour les inscription a l interieur scale mode key
    }

    isHovered() {
        const textWidth = this.size * this.text.length * 0.6; // Approximation de la largeur du texte
        let xStart = this.x;
        if (this.align === RIGHT) {
            xStart = this.x - textWidth;
        } else if (this.align === CENTER) { 
            xStart = this.x - textWidth / 2;
        }
        return mouseX > xStart && mouseX < xStart + textWidth && mouseY > this.y && mouseY < this.y + this.size;
    }

    draw() {
        push();
        textSize(this.size);
        textAlign(this.align, TOP);
        noStroke();
        fill(255);
        text(this.text, this.x, this.y);
        stroke(255);
        if (this.isHovered()) {
            let xStart = this.x;
            if (this.align === RIGHT) {
                xStart = this.x - textWidth(this.text);
            } else if (this.align === CENTER) {
                xStart = this.x - textWidth(this.text) / 2;
            }
            line(xStart, this.y + this.size + 2, xStart + textWidth(this.text), this.y + this.size + 2);
        }
        pop();
    }

    isClicked() {
        return this.isHovered() && mouseIsPressed;
    }
}

class vScale2 {
    constructor(x = 50, y = 50, size = 100, circleMode = true, visualMode = 'color') {
        this.x = x;
        this.y = y; 
        this.height = size; 
        this.width = size * 3;
        this.scale = new Scale('Major'); // Créer une gamme majeure par défaut
        this.dragging = false;
        this.resizing = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.aspectRatio = this.width / this.height;
        this.minSize = 50; // Taille minimum pour le redimensionnement
        this.labels = [];
        this.bubbles = [];
        this.visualMode = visualMode; // Assurez-vous que visualMode est bien défini ici
        this.circleMode = circleMode; // Assurez-vous que circleMode est bien défini ici
        this.bubbleAnimation = new CustomAnimation(500); // Utiliser CustomAnimation pour les bulles
        this.labelAnimation = new CustomAnimation(500); // Utiliser CustomAnimation pour les labels
        this.createLabels();
        this.createBubbles();
    }

    createLabels() {
        const labelSize = this.height / 6;
        if (this.circleMode) {
            this.labels = [
                new Label(this.scale.key, this.x + this.width / 2, this.y + this.height / 2 -  labelSize * 4 , labelSize * 3 , CENTER, 'key'),
                new Label(this.scale.name, this.x + this.width / 2, this.y + this.height / 2 - labelSize, labelSize, CENTER, 'scale'),
                new Label(this.scale.modeName, this.x + this.width / 2, this.y + this.height / 2, labelSize, CENTER, 'mode')
            ];
        } else {
            this.labels = [
                new Label(this.scale.key, this.x - 5, this.y - labelSize * 3, labelSize * 3, LEFT, 'key'),               
                new Label(this.scale.name, this.x + 5, this.y + 5, labelSize, LEFT, 'scale'),
                new Label(this.scale.modeName, this.x + this.width - 5, this.y + 5, labelSize, RIGHT, 'mode')
            ];
        }
    }

    createBubbles() {
        const bubbleRadius = this.height / 4;
        const bubbleSpacing = this.width / 6;
        const bubbleY = this.y + this.height / 2;
        this.bubbles = [];

        for (let i = 0; i < 12; i++) {           
            const { bubbleX, bubbleY, labels } = this.getCoordinates(bubbleSpacing, i);
            const isInScale = this.scale.intervals.semitones.includes(i);
            this.bubbles.push(new Bubble(bubbleX, bubbleY, bubbleRadius, labels, i, isInScale, 'degree', this.visualMode));
        }
    }

    updateBubbles() {
        const bubbleRadius = this.height / 4;
        const bubbleSpacing = this.width / 6;
        const bubbleY = this.y + this.height / 2;

        this.bubbles.forEach((bubble, i) => {
            const { bubbleX, bubbleY, labels } = this.getCoordinates(bubbleSpacing, i);
            const isInScale = this.scale.intervals.semitones.includes(i);
            bubble.x = bubbleX;
            bubble.y = bubbleY;
            bubble.radius = bubbleRadius;
            bubble.labels = labels;
            bubble.isInScale = isInScale;
            bubble.visualMode = this.visualMode;
        });
    }

    getCoordinates(bubbleSpacing, i) {
        let bubbleX, bubbleY;
        let labels;
        if (!this.circleMode) {
            // calculer les coordonnées des bulles en ligne
            bubbleX = this.x + bubbleSpacing * i + bubbleSpacing / 2;
            bubbleY = this.y + this.height / 2;
        } else {
            // calculer les coordonnées des bulles en cercle
            const angle = map(i, 0, 12, -PI / 2, 3 * PI / 2); // Commencer à -PI/2 pour avoir la tonique en haut
            
            const radius = this.height / 2;
            bubbleX = this.x + this.width / 2 + cos(angle) * radius * 2 ; 
            bubbleY = this.y + this.height / 2 + sin(angle) * radius * 2; 
        }     
    
        labels = {
            interval: this.scale.labels.intervals[i],
            degree: this.scale.labels.degrees[i],
            note: this.scale.labels.notes[i]
        };
        return { bubbleX, bubbleY, labels };
    }
    updateKey(note) {
        this.scale = new Scale(this.scale.name, this.scale.mode, note);
        this.createLabels();
        this.createBubbles();
    }


    update() {
        const currentLabelType = this.labels.length > 0 ? this.labels[0].labelType : 'degree';
        const currentVisualMode = this.visualMode;

        if (this.dragging) {
            this.x = mouseX + this.offsetX;
            this.y = mouseY + this.offsetY;
            this.createLabels(); // Mettre à jour les labels lors du déplacement
            this.updateBubbles(); // Mettre à jour les bulles lors du déplacement
        }
        if (this.resizing) {
            const newWidth = Math.max(mouseX - this.x, this.minSize * this.aspectRatio);
            const newHeight = newWidth / this.aspectRatio;
            this.width = newWidth;
            this.height = newHeight;
            this.createLabels(); // Mettre à jour les labels lors du redimensionnement
            this.updateBubbles(); // Mettre à jour les bulles lors du redimensionnement
        }

        // Reapply the current label type and visual mode
        this.labels.forEach(label => label.labelType = currentLabelType);
        this.bubbles.forEach(bubble => bubble.visualMode = currentVisualMode);

        this.bubbleAnimation.update(); // Mettre à jour l'animation des bulles
        this.labelAnimation.update(); // Mettre à jour l'animation des labels
    }

    draw() {    
        this.drawFrame();
        this.drawLabels();
        this.drawBubbles();
    }
    
    drawFrame() {
        // Dessiner le cadre de la gamme si survolé ou en cours de redimensionnement
        if (this.isHovered() || this.isButtonHovered(this.x, this.y, 25 * (this.width / 200)) || this.isMouseOverResizeIcon() || this.resizing) {
            stroke(255);
            noFill();
            rect(this.x, this.y, this.width, this.height);
            this.drawMoveIcon(this.x, this.y, 25 * (this.width / 200));
            this.drawResizeIcon(this.x + this.width , this.y + this.height , 10 * (this.width / 200));
        }
    }

    drawLabels() {
        this.labels.forEach(label => {
            label.draw();
        });
    }

    drawBubbles() {
        this.bubbles.forEach(bubble => {
            bubble.draw();
        });
    }

    drawMoveIcon(x, y, size) {
        push();
        noFill();
        stroke(255);
        ellipse(x, y, size, size);

        fill(255);
        noStroke();
        let triangleSize = 3 * (this.width / 200);
        let triangleHeight = 6 * (this.width / 200);
        triangle(x - triangleSize, y - triangleHeight, x, y - triangleHeight * 2, x + triangleSize, y - triangleHeight);
        triangle(x - triangleSize, y + triangleHeight, x, y + triangleHeight * 2, x + triangleSize, y + triangleHeight);
        triangle(x - triangleHeight, y - triangleSize, x - triangleHeight * 2, y, x - triangleHeight, y + triangleSize);
        triangle(x + triangleHeight, y - triangleSize, x + triangleHeight * 2, y, x + triangleHeight, y + triangleSize);
        pop();
    }

    drawResizeIcon(x, y, size) {
        push();
        fill(255);
        noStroke();
        triangle(x - size, y, x, y, x, y - size);
        pop();
    }

    isHovered() {
        return (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height);
    }

    // zone sensible d'un zone circulaire
    isButtonHovered(x, y, s) {
        const dx = mouseX - x;
        const dy = mouseY - y;
        return dx * dx + dy * dy <= s * s;
    }

    isMouseOverResizeIcon() {
        return dist(mouseX, mouseY, this.x + this.width - 10, this.y + this.height - 10) < 10 * (this.width / 200);
    }

    mousePressed() {
        if (this.isButtonHovered(this.x, this.y, 25 * (this.width / 200))) {
            this.dragging = true;
            this.offsetX = this.x - mouseX;
            this.offsetY = this.y - mouseY;
        } else if (this.isMouseOverResizeIcon()) {
            this.resizing = true;
        }
    }

    mouseReleased() {
        this.dragging = false;
        this.resizing = false;
    }

    mouseDragged() {
        if (this.dragging || this.resizing) {
            this.update();
        }
    }

    mouseClicked() {

        this.labels.forEach(label => {
            if (label.isHovered()) {
                if (label.labelType === 'scale') {
                    console.log('Changement de gamme');
                    this.nextScale();
                } else if (label.labelType === 'mode') {
                    console.log('Changement de mode');
                    this.nextMode();
                }
            }
        });

    }

    doubleClicked() {
        if (this.isButtonHovered(this.x, this.y, 25 * (this.width / 200))) {
            this.toggleCircleMode();
        }
    }

    toggleCircleMode() {
        const startBubblePositions = this.bubbles.map(bubble => ({ x: bubble.x, y: bubble.y }));
        const startLabelPositions = this.labels.map(label => ({ x: label.x, y: label.y, align: label.align }));
        this.circleMode = !this.circleMode;
        const endBubblePositions = this.bubbles.map((bubble, i) => {
            const { bubbleX, bubbleY } = this.getCoordinates(this.width / 6, i);
            return { x: bubbleX, y: bubbleY };
        });
        const endLabelPositions = this.circleMode ? [
            { x: this.x + this.width / 2, y: this.y + this.height / 2 - this.height / 6 * 4, align: CENTER },
            { x: this.x + this.width / 2, y: this.y + this.height / 2 - this.height / 6, align: CENTER },
            { x: this.x + this.width / 2, y: this.y + this.height / 2, align: CENTER }
        ] : [
            { x: this.x - 5, y: this.y - this.height / 6 * 3, align: LEFT },
            { x: this.x + 5, y: this.y + 5, align: LEFT },
            { x: this.x + this.width - 5, y: this.y + 5, align: RIGHT }
        ];

        this.bubbleAnimation.start(startBubblePositions, endBubblePositions, (currentPositions) => {
            push();
            this.bubbles.forEach((bubble, i) => {
                bubble.x = currentPositions[i].x;
                bubble.y = currentPositions[i].y;
            });
            pop();
        });

        this.labelAnimation.start(startLabelPositions, endLabelPositions, (currentLabelPositions) => {
            push();
            this.labels.forEach((label, i) => {
                label.x = currentLabelPositions[i].x;
                label.y = currentLabelPositions[i].y;
                label.align = currentLabelPositions[i].align;
            });
            pop();
        });
    }

    nextScale() {
        const currentIndex = SCALES_NAMES.indexOf(this.scale.name);
        const nextIndex = (currentIndex + 1) % SCALES_NAMES.length;
        this.scale = new Scale(SCALES_NAMES[nextIndex], 1, this.scale.key);
        this.createLabels(); // Mettre à jour les labels
        this.createBubbles(); // Mettre à jour les bulles
        console.log('Nouvelle gamme:', this.scale.name, 'Mode:', this.scale.modeName);
    }

    nextMode() {
        const currentScaleIndex = SCALES_NAMES.indexOf(this.scale.name);
        const currentModeIndex = MODES[currentScaleIndex].indexOf(this.scale.modeName);
        const nextModeIndex = (currentModeIndex + 1) % MODES[currentScaleIndex].length;
        this.scale = new Scale(this.scale.name, MODES[currentScaleIndex][nextModeIndex], this.scale.key);
        this.createLabels(); // Mettre à jour les labels
        this.createBubbles(); // Mettre à jour les bulles
        console.log('Nouveau mode:', this.scale.modeName);
    }

    // Ajouter des méthodes si nécessaire
    noteOn(midiNote) {
        for (let bubble of this.bubbles) {
          if (bubble.hue === (( midiNote  - FULL_NOTES[this.scale.key] ) % 12)) {
            bubble.isPlaying = true;
          }
        }
      }
    
      noteOff(midiNote) {
        for (let bubble of this.bubbles) {
          if (bubble.hue === ((midiNote  - FULL_NOTES[this.scale.key])  % 12)) {
            bubble.isPlaying = false;
          }
        }
      }

      keyPressed() {
        if (keyCode === 32) { // Barre d'espace
            for (let bubble of visualScale.bubbles) {
                bubble.toggleVisualMode();
            }
            visualScale.visualMode = visualScale.bubbles[0].visualMode;
        }
    
        // changement de type de label pour les bulles touchee entree
        if (keyCode === ENTER) { // Entree
            for (let bubble of visualScale.bubbles) {
                bubble.toggleLabelType();
            }
            visualScale.labelType = visualScale.bubbles[0].labelType;
        }
    }  
}

function mouseClicked() {
    visualScale.mouseClicked();
}

function doubleClicked() {
    visualScale.doubleClicked();
}

// function keyPressed() {
//     if (keyCode === 32) { // Barre d'espace
//         for (let bubble of visualScale.bubbles) {
//             bubble.toggleVisualMode();
//         }
//         visualScale.visualMode = visualScale.bubbles[0].visualMode;
//     }

//     // changement de type de label pour les bulles touchee entree
//     if (keyCode === ENTER) { // Entree
//         for (let bubble of visualScale.bubbles) {
//             bubble.toggleLabelType();
//         }
//         visualScale.labelType = visualScale.bubbles[0].labelType;
//     }
// }