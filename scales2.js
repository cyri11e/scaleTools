// Inclure le fichier const.js
// <script src="const.js"></script> doit être ajouté dans index.html

class Scale {
    constructor(scaleName, mode = 1) {
        this.name = scaleName;
        this.mode = mode;
        this.scaleType = SCALES_NAMES.indexOf(scaleName); // Définir scaleType
        
        this.createFullScale(scaleName, mode);
    }

    createFullScale(scaleName, mode) {
        const [semitones, diatonic, degrees] = this.createScale(scaleName, mode);
        this.intervals = {
            semitones,
            diatonic,
            degrees
        };
        this.labels = this.createLabels();
    }

    getNotes() {
        // ...existing code...
    }

    getNotesFromTonic(tonic) {
        const tonicIndex = FULL_NOTES[tonic];
        if (tonicIndex === undefined) {
            throw new Error('Tonique invalide');
        }

        let notes = [tonic];
        let currentLetter = tonic[0];
        const useSharps = tonic.includes('#') || tonic.includes('x');
        const useFlats = tonic.includes('b');

        this.intervals.semitones.slice(1).forEach(interval => {
            const noteIndex = (tonicIndex + interval) % 12;
            currentLetter = String.fromCharCode((currentLetter.charCodeAt(0) - 65 + 1) % 7 + 65); // Passer à la lettre suivante
            let note = Object.keys(FULL_NOTES).find(key => 
                FULL_NOTES[key] === noteIndex && 
                key[0] === currentLetter && 
                ((useSharps && key.includes('#')) || (useFlats && key.includes('b')) || (!useSharps && !useFlats))
            );
            if (!note) {
                note = Object.keys(FULL_NOTES).find(key => 
                    FULL_NOTES[key] === noteIndex && 
                    key[0] === currentLetter
                );
            }
            notes.push(note);
        });

        return notes;
    }

    modifyNote(noteIndex, alteration) {
        if (noteIndex < 0 || noteIndex >= this.intervals.semitones.length) {
            throw new Error('Note non trouvée dans le tableau des demi-tons');
        }

        const newSemitoneValue = (this.intervals.semitones[noteIndex] + alteration + 12) % 12;

        // Vérifier si le nouveau degré existe déjà
        if (this.intervals.semitones.includes(newSemitoneValue)) {
            console.warn('Le nouveau degré existe déjà, modification ignorée');
            return;
        }

        // Modifier le tableau des demi-tons
        this.intervals.semitones[noteIndex] = newSemitoneValue;

        // Mettre à jour les autres propriétés basées sur les nouveaux intervalles
        this.updateScale(this.intervals.semitones);
    }

    transpose(interval) {
        const transposedSemitones = this.intervals.semitones.map(semitone => (semitone + interval) % 12);
        this.updateScale(transposedSemitones);
    }

    updateScale(semitones = this.intervals.semitones) {
        this.intervals.semitones = semitones;
        this.intervals.diatonic = this.convertToDiatonic(semitones);
        this.intervals.degrees = this.convertToDegrees(semitones);
        this.labels = this.createLabels();

        // Détecter la gamme et le mode
        const detectedScale = this.detectScale(semitones);
        this.name = detectedScale.name;
        this.mode = detectedScale.mode;
        this.scaleType = SCALES_NAMES.indexOf(this.name); // Mettre à jour scaleType
    }

    detectScale(semitones) {
        for (let i = 0; i < SCALES_SEMITONES.length; i++) {
            for (let j = 0; j < SCALES_SEMITONES[i].length; j++) {
                const permutedSemitones = Scale.permuteMode(SCALES_SEMITONES[i], j + 1);
                const absolutePermutedSemitones = Scale.relativeToAbsolute(permutedSemitones);
                if (JSON.stringify(absolutePermutedSemitones) === JSON.stringify(semitones)) {
                    return { name: SCALES_NAMES[i], mode: MODES[i][j] };
                }
            }
        }
        return { name: 'Inconnu', mode: 1 };
    }

    createScale(scaleName, mode = 1) {
        const scaleIndex = SCALES_NAMES.indexOf(scaleName);
        if (scaleIndex === -1) {
            throw new Error('Nom de gamme invalide');
        }

        let semitones = SCALES_SEMITONES[scaleIndex];
        if (typeof mode === 'number') {
            semitones = Scale.permuteMode(semitones, mode);
        } else {
            const modeIndex = MODES[scaleIndex].indexOf(mode);
            if (modeIndex === -1) {
                throw new Error('Nom de mode invalide');
            }
            semitones = Scale.permuteMode(semitones, modeIndex + 1);
        }

        semitones = Scale.relativeToAbsolute(semitones);
        return [semitones, this.convertToDiatonic(semitones), this.convertToDegrees(semitones)];
    }

    createLabels() {
        let intervalLabels = Array(12).fill(null);
        let degreeLabels = Array(12).fill(null);

        this.intervals.semitones.forEach((semitone, index) => {
            intervalLabels[semitone] = this.intervals.diatonic[index];
            degreeLabels[semitone] = this.intervals.degrees[index];
        });

        this.fillGaps(intervalLabels, 'interval');
        this.fillGaps(degreeLabels, 'degree');

        return {
            intervals: intervalLabels,
            degrees: degreeLabels
        };
    }

    fillGaps(labels, labelType) {
        for (let i = 0; i < labels.length; i++) {
            if (labels[i] === null) {
                if (labelType === 'degree') {
                    labels[i] = this.getDegreeFromInterval(i);
                } else {
                    labels[i] = this.getLabelWithPriority(i, labelType);
                }
            }
        }
    }

    getLabelWithPriority(degree, labelType) {
        const natural = this.getLabel(degree, labelType, ['P']);
        if (natural) return natural;

        const alteredM = this.getLabel(degree, labelType, ['M', 'm']);
        if (alteredM) return alteredM;

        const alteredD = this.getLabel(degree, labelType, ['d']);
        if (alteredD) return alteredD;

        const alteredA = this.getLabel(degree, labelType, ['A']);
        return alteredA || '';
    }

    getLabel(degree, labelType, priorities) {
        if (labelType === 'degree') {
            return Object.keys(FULL_DEGREES).find(key => FULL_DEGREES[key] === degree && priorities.some(p => key.includes(p))) || '';
        } else {
            return Object.keys(FULL_INTERVALS).find(key => FULL_INTERVALS[key] === degree && priorities.some(p => key.includes(p))) || '';
        }
    }

    getDegreeFromInterval(interval) {
        const priorities = ['b', 'd', '#', ''];
        const degreeEntries = Object.entries(FULL_DEGREES);
        let possibleDegrees = [];

        for (const [degree, value] of degreeEntries) {
            if (value === interval) {
                possibleDegrees.push(degree);
            }
        }

        for (const priority of priorities) {
            const degree = possibleDegrees.find(deg => deg.includes(priority));
            if (degree) {
                return degree;
            }
        }

        return '';
    }

    static permuteMode(semitones, modeIndex) {
        const result = [...semitones.slice(modeIndex - 1), ...semitones.slice(0, modeIndex - 1)];
        return result;
    }

    static relativeToAbsolute(semitones) {
        let intervals = [0];
        let semitoneSum = 0;

        for (let i = 0; i < semitones.length; i++) {
            semitoneSum += semitones[i];
            intervals.push(semitoneSum);
        }

        // Supprimer l'octave finale
        intervals.pop();

        return intervals;
    }

    convertToDiatonic(semitones) {
        let diatonic = ['1P'];
        const intervalOrder = ['2', '3', '4', '5', '6', '7'];

        for (let i = 1; i < semitones.length; i++) {
            let intervalValue = semitones[i];
            let diatonicInterval = Object.keys(FULL_INTERVALS).find(key => 
                FULL_INTERVALS[key] === intervalValue && key.startsWith(intervalOrder[i - 1])
            );
            diatonic.push(diatonicInterval);
        }

        return diatonic;
    }

    convertToDegrees(semitones) {
        let diatonicDegrees = ['1'];
        const degreeOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

        for (let i = 1; i < semitones.length; i++) {
            let intervalValue = semitones[i];
            let degree = degreeOrder[i - 1];
            if (intervalValue < FULL_INTERVALS[degree + 'M']) {
                degree = 'b' + degree;
            } else if (intervalValue > FULL_INTERVALS[degree + 'M']) {
                degree = '#' + degree;
            } else if (degree === '4' && intervalValue === FULL_INTERVALS['4A']) {
                degree = '#4'; // Cas spécial du Lydian
            } else if (degree === '4' && intervalValue === FULL_INTERVALS['4d']) {
                degree = 'b4'; 
            }
            diatonicDegrees.push(degree);
        }

        return diatonicDegrees;
    }

    static getNoteFromInterval(interval) {
        return FULL_NOTES[interval % 12] || '';
    }

    static getIntervalFromNote(note) {
        return FULL_NOTES[note] || -1;
    }

    static getNoteLabel(tonic) {
        const tonicIndex = FULL_NOTES[tonic];
        if (tonicIndex === undefined) {
            throw new Error('Tonique invalide');
        }

        let noteLabels = [];
        for (let i = 0; i < 12; i++) {
            const noteIndex = (tonicIndex + i) % 12;
            const note = Object.keys(FULL_NOTES).find(key => FULL_NOTES[key] === noteIndex);
            noteLabels.push(note);
        }

        return noteLabels;
    }
}

