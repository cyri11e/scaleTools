const SCALES_SEMITONES = [
    [2, 2, 1, 2, 2, 2, 1], // Gamme majeure
    [2, 1, 2, 2, 1, 3, 1], // Mineure harmonique
    [2, 1, 2, 2, 2, 2, 1]  // Mineure mélodique
];

const MODES = [
    ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'], // Gamme majeure
    ['Harmonic Minor', 'Locrian #6', 'Ionian #5', 'Dorian #4', 'Phrygian Dominant', 'Lydian #2', 'Altered bb7'], // Mineure harmonique
    ['Melodic Minor', 'Dorian b2', 'Lydian Augmented', 'Lydian Dominant', 'Mixolydian b6', 'Locrian #2', 'Altered'] // Mineure mélodique
];

const SCALES_NAMES = [
    'Major',
    'Harmonic Minor',
    'Melodic Minor'
];

const DIATONIC_INTERVALS = ['1P', '2M', '3M', '4P', '5P', '6M', '7M'];
const DEGREES = ['1', '2', '3', '4', '5', '6', '7'];

const FULL_INTERVALS = {
    '1P': 0,
    '2m': 1,
    '2M': 2,
    '2A': 3,
    '3d': 2,
    '3m': 3,
    '3M': 4,
    '4d': 4,
    '4P': 5,
    '4A': 6,
    '5d': 6,
    '5P': 7,
    '5A': 8,
    '6d': 7,
    '6m': 8,
    '6M': 9,
    '6A': 10,
    '7d': 9,
    '7m': 10,
    '7M': 11,
    '8P': 12
};

const FULL_DEGREES = {
    '1': 0,
    '#1': 1,
    'b2': 1,
    '2': 2,
    '#2': 3,
    'b3': 3,
    '3': 4,
    'b4': 4,
    '4': 5,
    '#4': 6,
    'b5': 6,
    '5': 7,
    '#5': 8,
    'b6': 8,
    '6': 9,
    '#6': 10,
    'b7': 10,
    '7': 11,
    '8': 12
};

const FULL_NOTES = {
    'C': 0,
    'B#': 0,
    'Dbb': 0,  // Double bémol
    'C#': 1,
    'Db': 1,
    'Cx': 2, // Double dièse
    'D': 2,
    'Ebb': 2,  // Double bémol
    'D#': 3,
    'Eb': 3,
    'Fbb': 3,  // Double bémol
    'Dx': 4, // Double dièse
    'E': 4,
    'Fb': 4,
    'F': 5,
    'E#': 5,
    'Gbb': 5,  // Double bémol
    'F#': 6,
    'Gb': 6,
    'Fx': 7, // Double dièse
    'G': 7,
    'Abb': 7,  // Double bémol
    'G#': 8,
    'Ab': 8,
    'Gx': 9, // Double dièse
    'A': 9,
    'Bbb': 9,  // Double bémol
    'A#': 10,
    'Bb': 10,
    'Cbb': 10, // Double bémol
    'Ax': 11, // Double dièse
    'B': 11,
    'Cb': 11
};

const LABEL_TYPES = ['interval', 'degree', 'chord', 'note'];
const VISUAL_MODES = ['color', 'invisible'];