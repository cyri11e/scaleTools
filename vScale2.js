class Label {
    constructor(text, x, y, size, align = LEFT) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.size = size;
        this.align = align;
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
    constructor(x = 50, y = 50, size = 100, circleMode = true) {
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
        this.circleMode = circleMode; // Assurez-vous que circleMode est bien défini ici
        this.createLabels();
        this.createBubbles();
    }

    createLabels() {
        const labelSize = this.height / 6;
        if (this.circleMode) {
            this.labels = [
                new Label(this.scale.name, this.x + this.width / 2, this.y + this.height / 2 - labelSize, labelSize, CENTER),
                new Label(this.scale.modeName, this.x + this.width / 2, this.y + this.height / 2, labelSize, CENTER)
            ];
        } else {
            this.labels = [
                new Label(this.scale.name, this.x + 5, this.y + 5, labelSize, LEFT),
                new Label(this.scale.modeName, this.x + this.width - 5, this.y + 5, labelSize, RIGHT)
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
            this.bubbles.push(new Bubble(bubbleX, bubbleY, bubbleRadius, labels, i, isInScale, 'degree'));
        }
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

    update() {
        if (this.dragging) {
            this.x = mouseX + this.offsetX;
            this.y = mouseY + this.offsetY;
            this.createLabels(); // Mettre à jour les labels lors du déplacement
            this.createBubbles(); // Mettre à jour les bulles lors du déplacement
        }
        if (this.resizing) {
            const newWidth = Math.max(mouseX - this.x, this.minSize * this.aspectRatio);
            const newHeight = newWidth / this.aspectRatio;
            this.width = newWidth;
            this.height = newHeight;
            this.createLabels(); // Mettre à jour les labels lors du redimensionnement
            this.createBubbles(); // Mettre à jour les bulles lors du redimensionnement
        }
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
        console.log('Clic');
        this.labels.forEach(label => {
            if (label.isHovered()) {
                if (label.text === this.scale.name) {
                    console.log('Changement de gamme');
                    this.nextScale();
                } else if (label.text === this.scale.modeName) {
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
        this.circleMode = !this.circleMode;
        this.createLabels();
        this.createBubbles();
    }

    nextScale() {
        const currentIndex = SCALES_NAMES.indexOf(this.scale.name);
        const nextIndex = (currentIndex + 1) % SCALES_NAMES.length;
        this.scale = new Scale(SCALES_NAMES[nextIndex]);
        this.createLabels(); // Mettre à jour les labels
        this.createBubbles(); // Mettre à jour les bulles
        console.log('Nouvelle gamme:', this.scale.name, 'Mode:', this.scale.modeName);
    }

    nextMode() {
        const currentScaleIndex = SCALES_NAMES.indexOf(this.scale.name);
        const currentModeIndex = MODES[currentScaleIndex].indexOf(this.scale.modeName);
        const nextModeIndex = (currentModeIndex + 1) % MODES[currentScaleIndex].length;
        this.scale = new Scale(this.scale.name, MODES[currentScaleIndex][nextModeIndex]);
        this.createLabels(); // Mettre à jour les labels
        this.createBubbles(); // Mettre à jour les bulles
        console.log('Nouveau mode:', this.scale.modeName);
    }

    // Ajouter des méthodes si nécessaire
}

function mouseClicked() {
    visualScale.mouseClicked();
}

function doubleClicked() {
    visualScale.doubleClicked();
}