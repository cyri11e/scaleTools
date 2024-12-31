const { Scale, detectMode } = require('./scales');

test('permuteMode should correctly permute the semitones', () => {
    const scale = new Scale('Major', 'Ionian');

    // Test permutation pour le mode 1 (Ionian)
    let semitones = [2, 2, 1, 2, 2, 2, 1];
    let permuted = scale.permuteMode(semitones, 1);
    expect(permuted).toEqual([2, 2, 1, 2, 2, 2, 1]);

    // Test permutation pour le mode 2 (Dorian)
    permuted = scale.permuteMode(semitones, 2);
    expect(permuted).toEqual([2, 1, 2, 2, 2, 1, 2]);

    // Test permutation pour le mode 3 (Phrygian)
    permuted = scale.permuteMode(semitones, 3);
    expect(permuted).toEqual([1, 2, 2, 2, 1, 2, 2]);

    // Test permutation pour le mode 4 (Lydian)
    permuted = scale.permuteMode(semitones, 4);
    expect(permuted).toEqual([2, 2, 2, 1, 2, 2, 1]);

    // Test permutation pour le mode 5 (Mixolydian)
    permuted = scale.permuteMode(semitones, 5);
    expect(permuted).toEqual([2, 2, 1, 2, 2, 1, 2]);

    // Test permutation pour le mode 6 (Aeolian)
    permuted = scale.permuteMode(semitones, 6);
    expect(permuted).toEqual([2, 1, 2, 2, 1, 2, 2]);

    // Test permutation pour le mode 7 (Locrian)
    permuted = scale.permuteMode(semitones, 7);
    expect(permuted).toEqual([1, 2, 2, 1, 2, 2, 2]);
});

test('convertToDiatonic should correctly convert semitones to diatonic intervals', () => {
    const scale = new Scale('Major', 'Ionian');

    // Test conversion pour la gamme majeure
    let semitones = [0, 2, 4, 5, 7, 9, 11];
    let diatonic = scale.convertToDiatonic(semitones);
    expect(diatonic).toEqual(['1P', '2M', '3M', '4P', '5P', '6M', '7M']);

    // Test conversion pour la gamme mineure harmonique
    semitones = [0, 2, 3, 5, 7, 8, 11];
    diatonic = scale.convertToDiatonic(semitones);
    expect(diatonic).toEqual(['1P', '2M', '3m', '4P', '5P', '6m', '7M']);

    // Test conversion pour la gamme mineure mélodique
    semitones = [0, 2, 3, 5, 7, 9, 11];
    diatonic = scale.convertToDiatonic(semitones);
    expect(diatonic).toEqual(['1P', '2M', '3m', '4P', '5P', '6M', '7M']);
});

test('getModeIndex should correctly return the index of the mode', () => {
    const scale = new Scale('Major', 'Ionian');

    // Test pour le mode Ionian
    let modeIndex = scale.getModeIndex('Ionian');
    expect(modeIndex).toBe(1);

    // Test pour le mode Dorian
    modeIndex = scale.getModeIndex('Dorian');
    expect(modeIndex).toBe(2);

    // Test pour le mode Phrygian
    modeIndex = scale.getModeIndex('Phrygian');
    expect(modeIndex).toBe(3);

    // Test pour le mode Lydian
    modeIndex = scale.getModeIndex('Lydian');
    expect(modeIndex).toBe(4);

    // Test pour le mode Mixolydian
    modeIndex = scale.getModeIndex('Mixolydian');
    expect(modeIndex).toBe(5);

    // Test pour le mode Aeolian
    modeIndex = scale.getModeIndex('Aeolian');
    expect(modeIndex).toBe(6);

    // Test pour le mode Locrian
    modeIndex = scale.getModeIndex('Locrian');
    expect(modeIndex).toBe(7);
});

test('convertToDegrees should correctly convert semitones to degrees', () => {
    const scale = new Scale('Major', 'Ionian');

    // Test conversion pour la gamme majeure
    let semitones = [0, 2, 4, 5, 7, 9, 11];
    let degrees = scale.convertToDegrees(semitones);
    expect(degrees).toEqual(['1', '2', '3', '4', '5', '6', '7']);

    // Test conversion pour la gamme mineure harmonique
    semitones = [0, 2, 3, 5, 7, 8, 11];
    degrees = scale.convertToDegrees(semitones);
    expect(degrees).toEqual(['1', '2', 'b3', '4', '5', 'b6', '7']);

    // Test conversion pour la gamme mineure mélodique
    semitones = [0, 2, 3, 5, 7, 9, 11];
    degrees = scale.convertToDegrees(semitones);
    expect(degrees).toEqual(['1', '2', 'b3', '4', '5', '6', '7']);
});

test('updateSemitone should correctly update the semitone and recalculate intervals', () => {
    const scale = new Scale('Major', 'Ionian');

    // Mise à jour de la tierce majeure (4) en tierce mineure (3)
    scale.updateSemitone(scale.intervals.semitones.indexOf(4), 3);
    expect(scale.intervals.semitones).toEqual([0, 2, 3, 5, 7, 9, 11]);
    expect(scale.intervals.diatonic).toEqual(['1P', '2M', '3m', '4P', '5P', '6M', '7M']);
    expect(scale.intervals.degrees).toEqual(['1', '2', 'b3', '4', '5', '6', '7']);
    expect(scale.name).toBe('Melodic Minor');
});

test('replaceInterval should correctly replace the diatonic interval', () => {
    const scale = new Scale('Major', 'Ionian');

    // Remplacement de la tierce majeure (3M) par une tierce mineure (3m)
    scale.replaceInterval('3M', '3m');
    expect(scale.intervals.diatonic).toEqual(['1P', '2M', '3m', '4P', '5P', '6M', '7M']);
});

test('fromChromatic should correctly create a scale from chromatic intervals', () => {
    const chromaticIntervals = ['1P', '2M', '3M', '4P', '5P', '6M', '7M'];
    const intervals = Scale.fromChromatic(chromaticIntervals);
    expect(intervals.semitones).toEqual([0, 2, 4, 5, 7, 9, 11]);
    expect(intervals.diatonic).toEqual(['1P', '2M', '3M', '4P', '5P', '6M', '7M']);
    expect(intervals.degrees).toEqual(['1', '2', '3', '4', '5', '6', '7']);
});

test('detectMode should correctly detect the mode from semitones', () => {
    // Test pour détecter le mode Ionian
    let semitones = [0, 2, 4, 5, 7, 9, 11];
    let detectedMode = detectMode(semitones);
    expect(detectedMode).toEqual({ name: 'Ionian', scaleType: 0, mode: 1 });

    // Test pour détecter le mode Dorian
    semitones = [0, 2, 3, 5, 7, 9, 10];
    detectedMode = detectMode(semitones);
    expect(detectedMode).toEqual({ name: 'Dorian', scaleType: 0, mode: 2 });

    // Test pour détecter le mode Phrygian
    semitones = [0, 1, 3, 5, 7, 8, 10];
    detectedMode = detectMode(semitones);
    expect(detectedMode).toEqual({ name: 'Phrygian', scaleType: 0, mode: 3 });

    // Test pour détecter une gamme inconnue
    semitones = [0, 2, 3, 5, 6, 8, 10];
    detectedMode = detectMode(semitones);
    expect(detectedMode).toBeNull();
});
