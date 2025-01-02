let visualScale;

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Créer une gamme visuelle au hasard
    const randomScaleName = random(SCALES_NAMES);
    const randomMode = random(MODES[SCALES_NAMES.indexOf(randomScaleName)]);
    let randomTonic = random(Object.keys(FULL_NOTES)); // Tonique aléatoire

    // Vérifier que la tonique n'est pas un double bémol ou double dièse
    while (randomTonic.includes('bb') || randomTonic.includes('x')) {
        randomTonic = random(Object.keys(FULL_NOTES));
    }

    visualScale = new vScale2(50, 10, 100, true); // Assurez-vous que circleMode est bien passé ici
}

function draw() {
    background(120);
    visualScale.update();
    visualScale.draw();
}

function mousePressed() {
    visualScale.mousePressed(); 
}

function mouseReleased() {
    visualScale.mouseReleased();
}

function mouseDragged() {
    visualScale.mouseDragged();
}

function mouseClicked() {
    visualScale.mouseClicked();
}

function doubleClicked() {
    visualScale.doubleClicked();
}

