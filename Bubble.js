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
        colorMode(HSB, 12); // Utiliser le mode HSB
        if (this.isInScale) {
            fill(this.hue, 10, 10); // Utiliser la teinte pour le remplissage si la note est dans la gamme
        } else {
            noFill(); // Pas de remplissage si la note est hors gamme
        }
        stroke(255); // Contour blanc
        if (this.isMouseOver()) {
            strokeWeight(3); // Augmenter l'épaisseur du contour si la bulle est survolée
        }
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2); // Dessiner le cercle
        colorMode(RGB); // Revenir au mode RVB
        noStroke();
        textSize(this.radius * 1.3)
        textAlign(CENTER, CENTER);
        let shadowOffset = this.radius / 20;
        fill(50);
        text(this.labels[this.labelType] || '', this.x + shadowOffset, this.y + shadowOffset); // Utiliser labelType pour choisir le label
        if ( this.isInScale ) {
        fill(255);  
        } else {    
        fill(100);  
        }
        text(this.labels[this.labelType] || '', this.x - shadowOffset, this.y - shadowOffset); // Utiliser labelType pour choisir le label

        pop();
    }

    cycleLabel() {
        this.currentLabelIndex = (this.currentLabelIndex + 1) % this.labels.length;
    }

    isMouseOver() {
        return dist(mouseX, mouseY, this.x, this.y) < this.radius;
    }
}
