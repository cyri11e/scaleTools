let visualScale;

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Créer une gamme visuelle au hasard
    const randomScaleName = random(SCALES_NAMES);
    const randomMode = random(MODES[SCALES_NAMES.indexOf(randomScaleName)]);
    const scale = new Scale(randomScaleName, randomMode, 'C');
    visualScale = new vScale(scale, 50, 50, 300, 100);
}

function draw() {
    background(120);
    visualScale.update();
    visualScale.draw();
}

function mousePressed() {
    console.log("Mouse pressed at:", mouseX, mouseY); // Debug
    visualScale.handleMousePressed(); // Appeler handleMousePressed pour gérer tous les cas
}

function mouseReleased() {
    visualScale.stopDragging();
    visualScale.stopResizing();
}

function mouseDragged() {
    if (visualScale.isDragging) {
        visualScale.x = mouseX - visualScale.offsetX;
        visualScale.y = mouseY - visualScale.offsetY;
    } else if (visualScale.isResizing) {
        let newWidth = mouseX - visualScale.x - visualScale.offsetX;
        let newHeight = newWidth / visualScale.aspectRatio;
        if (newHeight + visualScale.y <= windowHeight && newWidth + visualScale.x <= windowWidth) {
            visualScale.width = newWidth;
            visualScale.height = newHeight;
        }
    }
}

