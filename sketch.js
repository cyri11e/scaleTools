let scales = [];
let visualScales = [];

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Créer une gamme majeure ionienne
    const scaleWithTonic = new Scale('Major', 'Lydian');
    const tonic = 'C';

    // Sauvegarder l'état avant modification
    const stateBefore = {
        name: scaleWithTonic.name,
        mode: scaleWithTonic.mode,
        tonic: tonic,
        intervals: { ...scaleWithTonic.intervals },
        labels: { ...scaleWithTonic.labels }
    };

    console.log('Avant modification:', JSON.stringify(stateBefore.intervals.semitones));
    console.log('Nom de gamme avant:', stateBefore.name);
    console.log('Mode avant:', stateBefore.mode);

    // Diminuer la tierce
    scaleWithTonic.modifyNote(2, 1); // La tierce est à l'indice 4

    // Sauvegarder l'état après modification
    const stateAfter = {
        name: scaleWithTonic.name,
        mode: scaleWithTonic.mode,
        tonic: tonic,
        intervals: { ...scaleWithTonic.intervals },
        labels: { ...scaleWithTonic.labels }
    };

    console.log('Après modification:', JSON.stringify(stateAfter.intervals.semitones));
    console.log('Nom de gamme après:', stateAfter.name);
    console.log('Mode après:', stateAfter.mode);

    scales.push({ stateBefore, stateAfter });

    // Créer une gamme visuelle au hasard
    const randomScaleName = random(SCALES_NAMES);
    const randomMode = random(MODES[SCALES_NAMES.indexOf(randomScaleName)]);
    const scale = new Scale(randomScaleName, randomMode);
    const visualScale = new vScale(scale, 50, 50, 300, 100);

    visualScales.push(visualScale);
}

function draw() {
    background(120);

    visualScales.forEach(visualScale => visualScale.draw());
}

