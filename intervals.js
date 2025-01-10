class Intervals {
  constructor(name, semitones, direction = 'ascending', number, nature) {
    this.name = name;
    this.semitones = semitones;
    this.direction = direction;
    this.number = number;
    this.nature = nature;
    this.shortName = `${direction === 'descending' ? '-' : ''}${number}${nature}`;
  }

  getName() {
    return this.name;
  }

  getSemitones() {
    return this.semitones;
  }

  getDirection() {
    return this.direction;
  }

  getNumber() {
    return this.number;
  }

  getNature() {
    return this.nature;
  }

  getShortName() {
    return this.shortName;
  }

  invert() {
    const invertedSemitones = -this.semitones;
    const invertedDirection = this.direction === 'ascending' ? 'descending' : 'ascending';
    return new Intervals(this.name, invertedSemitones, invertedDirection, this.number, this.nature);
  }

  complement() {
    const complementNumber = 9 - this.number;
    const complementNature = this.nature === 'M' ? 'm' : this.nature === 'm' ? 'M' : this.nature;
    const complementInterval = Intervals.get().find(interval => interval.number === complementNumber && interval.nature === complementNature);
    return complementInterval ? new Intervals(complementInterval.name, complementInterval.semitones, this.direction, complementNumber, complementNature) : null;
  }

  static get() {
    const intervals = [];
    INTERVAL_TYPES.forEach(type => {
      type.natures.forEach(nature => {
        const natureObj = INTERVAL_NATURES.find(n => n.label === nature);
        if (natureObj) {
          let offset = natureObj.offset;
          if (!type.natures.includes('P') && ( nature === 'd')) {
            offset = offset * 2;
          }
          const semitones = type.chroma + offset;
          if (semitones >= 0 && semitones <= 12) {
            intervals.push(new Intervals(`${natureObj.name} ${type.name}`, semitones, 'ascending', type.number, nature));
          }
        }
      });
    });
    return intervals;
  }

  static getFromSemitone(semitone) {
    const direction = semitone < 0 ? 'descending' : 'ascending';
    const absSemitone = Math.abs(semitone);
    const intervals = this.get().filter(interval => interval.semitones === absSemitone);
    return intervals.map(interval => new Intervals(interval.name, semitone, direction, interval.number, interval.nature));
  }

  static getFromDegree(degree) {
    if (typeof degree === 'string') {
      const type = INTERVAL_TYPES.find(type => type.name.toLowerCase() === degree.toLowerCase());
      if (type) {
        degree = type.number;
      }
    }
    return this.get().filter(interval => interval.number === degree);
  }

  static getFromNature(nature) {
    if (typeof nature === 'string' && nature.length > 1) {
      const natureObj = INTERVAL_NATURES.find(n => n.name.toLowerCase() === nature.toLowerCase());
      if (natureObj) {
        nature = natureObj.label;
      }
    }
    return this.get().filter(interval => interval.nature === nature);
  }

  static getByName(name) {
    return this.get().find(interval => interval.name === name || interval.shortName === name);
  }
}

const INTERVAL_TYPES = [
  { name: 'Unison', number: 1, chroma: 0, natures: ['P'] },
  { name: 'Second', number: 2, chroma: 2, natures: ['m', 'M', 'A', 'd'] },
  { name: 'Third', number: 3, chroma: 4, natures: ['m', 'M', 'A', 'd'] },
  { name: 'Fourth', number: 4, chroma: 5, natures: ['P', 'A', 'd'] },
  { name: 'Fifth', number: 5, chroma: 7, natures: ['P', 'A', 'd'] },
  { name: 'Sixth', number: 6, chroma: 9, natures: ['m', 'M', 'A', 'd'] },
  { name: 'Seventh', number: 7, chroma: 11, natures: ['m', 'M', 'A', 'd'] },
  { name: 'Octave', number: 8, chroma: 12, natures: ['P'] }
];

const INTERVAL_DIRECTIONS = ['ascending', 'descending'];

const INTERVAL_NATURES = [
  { name: 'Perfect', label: 'P', offset: 0 },
  { name: 'Minor', label: 'm', offset: -1 },
  { name: 'Major', label: 'M', offset: 0 },
  { name: 'Augmented', label: 'A', offset: 1 },
  { name: 'Diminished', label: 'd', offset: -1 }
];

function testComplement() {
  const intervals = Intervals.get();
  intervals.forEach(interval => {
    const complementInterval = interval.complement();
    console.log(`Original: ${interval.getShortName()}, Complement: ${complementInterval.getShortName()}`);
  });
}

// Appelez la fonction de test
testComplement();