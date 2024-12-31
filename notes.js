class Note {
    constructor(interval, degree, semitoneIndex, x, y, radius, isInScale) {
        this.interval = interval; // Intervalle sous forme 1P, 2M, etc.
        this.degree = degree; // Degré de la note 1, b2, etc.
        this.semitoneIndex = semitoneIndex; // Indice en demi-ton
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.isHovered = false;
        this.isInScale = isInScale;
        this.isDragging = false;
    }

    display(labelType, isDragging = false) {
        push();
        if (this.isInScale) {
            colorMode(HSB);
            let hue = (this.semitoneIndex / 12) * 360;
            fill(hue, 80, 50, isDragging ? 100 : 255); // Couleur basée sur le hue pour les notes dans la gamme, avec transparence si en cours de déplacement
        } else {
            noFill(); // Pas de remplissage pour les notes hors gamme
        }
        stroke(this.isInScale ? 255 : 150);
        strokeWeight(this.isHovered ? 3 : 1);
        ellipse(this.x, this.y, this.radius * 2);
        fill(this.isInScale ? 255 : 150); // Texte en blanc pour les notes dans la gamme, gris clair pour les notes hors gamme
        noStroke();
        textSize(this.radius); // Ajuster la taille du texte en fonction du rayon
        textAlign(CENTER, CENTER);
        text(labelType === 'degree' ? this.degree : this.interval, this.x, this.y);
        pop();
    }

    isMouseOver() {
        return dist(mouseX, mouseY, this.x, this.y) < this.radius;
    }

    handleMouseOver() {
        this.isHovered = this.isMouseOver();
    }

    startDragging() {
        this.isDragging = true;
    }

    stopDragging() {
        this.isDragging = false;
    }

    updatePosition(x, y) {
        if (this.isDragging) {
            this.x = x;
            this.y = y;
        }
    }

    updateRadius(radius) {
        this.radius = radius;
    }

    updateInterval(interval, isInScale) {
        this.interval = interval;
        this.isInScale = isInScale;
    }

    updateDegree(degree) {
        this.degree = degree;
    }

    updateSemitoneIndex(semitoneIndex) {
        this.semitoneIndex = semitoneIndex;
    }
}
