let visualScale;
let pianos = []
let keyCounts = [25,49,61,76,88]

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


    // Créer une gamme visuelle
    visualScale = new vScale2(50, 100, 100, true); // Assurez-vous que circleMode est bien passé ici
    initializeMidi(visualScale);

    // clavier
    pianos.push(new Piano(10, 50, keyCounts[1] )) 

    for (const piano of pianos)
        initializeMidi(piano)
}

function draw() {
    background(120);
    visualScale.update();
    visualScale.draw();

      // clavier
    for (const piano of pianos)
        piano.display()
}

function mousePressed() {
    visualScale.mousePressed(); 
    for (const piano of pianos)
        piano.mousePressed()
}

function mouseReleased() {
    visualScale.mouseReleased();
    for (const piano of pianos)
        piano.mouseReleased()
}

// mouvements de souris 

function mouseMoved() {
    for (const piano of pianos)
        piano.mouseMoved()
}

function mouseDragged() {
    visualScale.mouseDragged();
}

function mouseClicked() {
    visualScale.mouseClicked();
}

function doubleClicked() {
    visualScale.doubleClicked();
    for (const piano of pianos)
        piano.doubleClicked()
}

function windowResized() {
    wW =windowWidth
    wH = windowHeight
    resizeCanvas(wW, wH);
  
    for (const piano of pianos)
      piano.updateSize()
  }

  function keyPressed(){
    for (const piano of pianos)
      piano.keyPressed()

    visualScale.keyPressed()

  }