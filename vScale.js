class vScale {
    constructor(scale, x, y, width, height) {
        this.scale = scale;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.buttons = [];
        this.createButtons();
    }

    createButtons() {
        const buttonWidth = 50;
        const buttonHeight = 30;
        const buttonSpacing = 10;
        const buttonLabels = ['Transpose', 'Modify'];

        buttonLabels.forEach((label, index) => {
            const buttonX = this.x + (buttonWidth + buttonSpacing) * index;
            const buttonY = this.y + this.height + buttonSpacing;
            this.buttons.push(new Button(label, buttonX, buttonY, buttonWidth, buttonHeight));
        });
    }

    draw() {
        // Dessiner le cadre
        stroke(0);
        fill(255);
        rect(this.x, this.y, this.width, this.height);

        // Dessiner les boutons
        this.buttons.forEach(button => button.draw());

        // Afficher les informations de la gamme
        fill(0);
        textSize(16);
        text(`Gamme: ${this.scale.name}`, this.x + 10, this.y + 30);
        text(`Mode: ${this.scale.mode}`, this.x + 10, this.y + 50);
        text(`Intervalles: ${JSON.stringify(this.scale.intervals.semitones)}`, this.x + 10, this.y + 70);
    }
}

class Button {
    constructor(label, x, y, width, height) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        stroke(0);
        fill(200);
        rect(this.x, this.y, this.width, this.height);
        fill(0);
        textSize(12);
        textAlign(CENTER, CENTER);
        text(this.label, this.x + this.width / 2, this.y + this.height / 2);
    }
}
