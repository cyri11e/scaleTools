class Key {
  constructor(index, startNote, keyType, originX, key = 'C', size, isPlayed, isScale, label) {
    this.index = index;
    this.startNote = startNote;
    this.keyType = keyType;
    this.setNote();
    this.setKey(key);
    this.size = size;
    this.w = this.size;
    this.h = this.size * 6;
    this.x = originX;
    this.y = windowHeight - this.h - this.x;
    this.isPlayed = isPlayed;
    this.isSelected = false; // Nouvelle propriété pour l'état de sélection
    this.isScale = isScale;
    this.isHovered = false;
    this.label = label;
    this.thickness = 1;
    this.isWhiteKey = true;
    this.key = key;
    this.frameColor = 'green';
    this.scaleColor = 'white';
    this.scaleColorWhite = 'rgb(255,255,255)';
    this.scaleColorBlack = '#000000(0,0,0)';
    this.playedColor = '#00B0FF'; // Couleur pour l'état joué
    this.selectedColor = '#FFD700'; // Couleur pour l'état sélectionné
    this.colorModes = ['BW', 'color', 'fullcolor', 'invisible'];
    this.colorMode = 'BW';
  }

  setKey(key) {  
    this.key = key;
    this.chromaKey = FULL_NOTES[this.key]; // Set the chromatic degree of the note from the FULL_NOTES table
  }  

  setNote(){
    this.startNoteChroma = this.getNoteChroma(this.startNote)
    this.noteChroma = this.index + this.startNoteChroma
    this.midiNote = this.getMidiNote(this.startNote) + this.index
    this.midiNoteLabel = Tonal.Note.fromMidi(this.midiNote)
    this.noteLabel = Tonal.Note.pitchClass(this.midiNoteLabel)
    this.chromaNote = this.getChromaNote()  
  }

  setColors(chroma){
    let hue = (chroma - this.chromaKey +12 ) % 12
    // touches noires
    if ([1,3,6,8,10].includes(chroma%12)){
      if (this.colorMode=='invisible'){
        this.scaleColor = 'lime' 
        this.playedColor = 'white'
        } else  if ((this.colorMode=='BW')||(this.colorMode=='color')){
        this.scaleColor = 'rgb(22,21,21)'  
        this.playedColor = 'cyan'
      }
      else {
        this.scaleColor = color(hue, 8, 6)  
        this.playedColor = color(hue,8, 6)  
      }
   } else { 
   // touches blanches
   if (this.colorMode=='invisible'){
    this.scaleColor = 'lime' 
    this.playedColor = 'white'
    } else if (this.colorMode=='BW'){
       this.scaleColor = 'rgb(249,249,238)' 
       this.playedColor = 'cyan'
     }
     else {
       this.scaleColor = color(hue , 8, 10)
       this.playedColor = color(hue, 8, 10)
     }     
   } 
   if (this.isScale) {
      if (this.colorMode=='invisible')
        stroke('white')   
      else
        stroke('black') // Stroke noir pour les touches de l'échelle
     this.color= this.scaleColor      
   } 
   if (this.isPlayed){
     stroke('white')
     this.color =this.playedColor
   } 
   if (this.isSelected) {
     stroke('black')
     this.color = this.selectedColor
   }
  }

  getNoteChroma(note){
    let noteChroma 
    noteChroma = Tonal.Note.get(note).chroma
    return noteChroma
  }

  updateSize(size){
    this.size = size
    this.w = this.size
    this.h = this.size*6
  }

  updateColor(){
    let indexColorMode
    indexColorMode = this.colorModes.indexOf(this.colorMode)
    indexColorMode =(indexColorMode +1)%this.colorModes.length
    this.colorMode = this.colorModes[indexColorMode]
  }

  updateLiveNotes(liveNotes) {
    this.liveNotes = liveNotes;
    if (liveNotes.includes(this.midiNote)) {
      if (!this.isPlayed) {
        this.isPlayed = true;
      }
    } else {
      if (this.isPlayed) {
        this.isPlayed = false;
      }
    }
  }

  display(){    
    push();
    noFill()
    colorMode(HSB, 12, 12, 12) 
    strokeWeight(1)
    
    // recuparation de la couleur
    this.setColors(this.chromaNote)
    // coordonnées
    this.getX()
    // forme
    let shape = this.getShape(this.chromaNote)  
    
    if (this.isHovered) {
      fill('red');
    }
    else
      if (this.colorMode == 'invisible') 
        noFill()
      else  
        fill(this.color)
      
    this.displayKey(shape, this.keyX, this.y, this.w, this.h)
    
    // affichage des labels C 
    if (this.midiNoteLabel.includes('C')){    
      fill('silver')
      this.displayLabel()
    }
    
    if (this.isPlayed){    
      this.displayNote()
    }

    if (!this.isWhiteKey) {
     // this.displayReflection(0.05); // Exemple d'épaisseur de liseré
    }
    pop();
  } 

  getX(){
    this.delta = this.getDelta(this.noteChroma)
    let delta2 = this.getDelta(this.startNoteChroma) // pour recaler non C
    this.keyX = this.x+this.delta-delta2  //-this.getDelta(this.startNoteChroma)    
    
    if (['C','F'].includes(this.noteLabel)) this.labelX = this.keyX + 0.4*this.w/2
    if (['D','G','A'].includes(this.noteLabel)) this.labelX = this.keyX + 0.6*this.w/2
    if (['E','B'].includes(this.noteLabel)) this.labelX = this.keyX + 0.8*this.w/2
    if (!this.isWhiteKey) this.labelX = this.keyX + 0.4*this.w/2

  }

  getDelta(index){
    //calcule loffset entre le X d origine 
    // et l endroit on on dessin la note
    let delta 
    let octave = Math.floor(index/12)   
    //decalage par defaut = 1/2 touche
    delta = index*this.w/2    
    // pour les touches noire on reajuste a 2/3
    if ([1,3,6,8,10].includes(index%12)) {
      delta = delta +this.w/6     
    } 
    if ( (index%12) > 4) delta = delta +this.w/2 //+octave*this.w/2
    if ( octave>0 ) delta = delta +(octave)*this.w    
    return delta
  }
    
    displayKey(shape, x, y, w, h) {
      push();
      if (shape === 'b') {
        this.blackKeyShape(x, y, w, h);
      } else {
        this.generalKeyShape(shape, x, y, w, h);
      }
      pop();
    }
  
    generalKeyShape(shape, x, y, w, h) {
      push();
      beginShape();
      switch (shape) {
        case 'I':
          vertex(x, y);
          vertex(x + w - this.thickness, y);
          vertex(x + w - this.thickness, y + h);
          vertex(x, y + h);
          break;
        case 'C':
          vertex(x, y);
          vertex(x, y + h);
          vertex(x + w - this.thickness, y + h);
          vertex(x + w - this.thickness, y + h * 0.6);
          vertex(x + w / 1.5, y + h * 0.6);
          vertex(x + w / 1.5, y);
          break;
        case 'D':
          vertex(x + (w / 3), y);
          vertex(x + w / 1.5, y);
          vertex(x + w / 1.5, y + h * 0.6);
          vertex(x + w - this.thickness, y + h * 0.6);
          vertex(x + w - this.thickness, y + h);
          vertex(x, y + h);
          vertex(x, y + h * 0.6);
          vertex(x + (w / 3), y + h * 0.6);
          break;
        case 'E':
          vertex(x + w / 3, y);
          vertex(x + w - this.thickness, y);
          vertex(x + w - this.thickness, y + h);
          vertex(x, y + h);
          vertex(x, y + h * 0.6);
          vertex(x + w / 3, y + h * 0.6);
          break;
      }
      endShape(CLOSE);
      pop();
    }
  
    blackKeyShape(x, y, w, h) {
      push();
      rect(x + this.thickness, y, w / 1.5 - this.thickness * 2, h * 0.6 - this.thickness);
      pop();
    }
  
  displayReflection(thickness) {
    push();
    noStroke();
    fill(255, 255, 255, 50); // couleur blanche semi-transparente
    rect(this.keyX + this.w * thickness * 3, this.y, this.w * 0.05, this.h * 0.5);
    rect(this.keyX + this.w * thickness * 3, this.y + this.h * 0.5, this.w * 0.4, this.h * 0.01);
    pop();
  }
  
  displayLabel(){
    push();
    noStroke()
    textFont('Arial')
    textSize(this.w/2)
    textAlign(LEFT,TOP)
    text(this.midiNoteLabel,this.labelX, this.y+this.h-this.w/2)
    pop();
  }

  displayNote(){
    push();
    noStroke()

    fill('white')
    textFont('Arial')
    textSize(this.w)
    textAlign(LEFT,TOP)
    textKeyNote(this.noteLabel,this.labelX, this.y-this.w)
    pop();
  } 
  

  CShape(x,y,w,h){
    beginShape();  
    vertex(x, y);
    vertex(x, y+h)
    vertex(x+w-this.thickness, y+h )
    vertex(x+w-this.thickness, y+h*0.6) 
    vertex(x+w/1.5, y+h*0.6)
    vertex(x+w/1.5, y );
    endShape(CLOSE)
  }
  
  blackKeyShape(x,y,w,h){
    push();
    rect(x+this.thickness, y,
         w/1.5-this.thickness*2 , h*0.6 -this.thickness);
    pop();
  }
  
  DShape(x,y,w,h){
    beginShape();  
    vertex(x+(w/3), y);
    vertex(x+w/1.5, y);
    vertex(x+w/1.5, y+h*0.6);
    vertex(x+w-this.thickness, y+h*0.6 );
    vertex(x+w-this.thickness, y+h);
    vertex(x, y+h );
    vertex(x, y+h*0.6 )
    vertex(x+(w/3), y+h*0.6)
    endShape(CLOSE)
  }
 
  EShape(x,y,w,h){
    beginShape();
    vertex(x+w/3, y);
    vertex(x+w-this.thickness, y);
    vertex(x+w-this.thickness, y+h );
    vertex(x, y+h );
    vertex(x, y+h*0.6 );
    vertex(x+w/3, y+h*0.6 );
    endShape(CLOSE)
  }
  
  IShape(x,y,w,h){    
    rect(x, y, w-this.thickness ,h );
  }

    
  getShape(midiNote){
    let shape, note, letter, isBlack
    note = Tonal.Midi.midiToNoteName(midiNote, { pitchClass: true })
    letter = Tonal.Note.get(note).letter
    isBlack = (Tonal.Note.get(note).alt != 0)

    if (isBlack) {
      this.isWhiteKey = false
      return 'b'
    }
    // cas particuler des 1ere et derniere note
    if (this.keyType=='first'){
      if (['B','E'].includes(letter))
        shape = 'I'
      if (['C','D','F','G','A'].includes(letter))
        shape = 'C'
    } else if (this.keyType=='last'){
            if (['D','E','G','A'].includes(letter))
              shape = 'E'
            if (['F','C'].includes(letter))
              shape = 'I'
    } else {
     // cas normaux  
        if (['C','F'].includes(Tonal.Note.get(note).letter))
          shape = 'C'
        else if (['D','G','A'].includes(Tonal.Note.get(note).letter))
          shape = 'D'
        else if (['E','G','B'].includes(Tonal.Note.get(note).letter))
          shape = 'E'
        } 
  
    return shape
  }

  updateOctave(octave){    
    if (octave == 1)
      this.startNote = Tonal.Note.transpose(this.startNote, '8P')
    else
      this.startNote = Tonal.Note.transpose(this.startNote, '-8P')
    this.setNote()
  }

  getMidiNote(note){
    let midiNote
    midiNote = Tonal.Midi.toMidi(note)
    return midiNote
  }
  
  getChromaNote(){
    let chromaNote
    chromaNote = this.midiNote % 12   
    return chromaNote
  }  
  
  mouseMoved(){
   this.isHovered = this.isMouseOver()
  }
  
  mousePressed() {
    if (this.isHovered) {
      this.toggleSelect();
    }
  }

  toggleSelect(){
    this.isSelected = !this.isSelected;
  }

  toggleLock(){
    this.isLocked = !this.isLocked

    this.isPlayed =this.isLocked
  }

  isMouseOver() {
    let hovered;
    if (this.isWhiteKey) {
      hovered = (mouseX > this.keyX && mouseX < this.keyX + this.w &&
                 mouseY > this.y + this.h * 0.6 && mouseY < this.y + this.h);
    } else {
      hovered = (mouseX > this.keyX && mouseX < this.keyX + this.w &&
                 mouseY > this.y && mouseY < this.y + this.h * 0.6);
    }
    return hovered;
  }

  doubleClicked(){
    if (this.isHovered){
      return this.noteLabel
    }
  }
}

function textKeyNote(note,x,y){ 
  let size = textSize()
  push()


  if (!note) // return
      console.log('oops')

  if (note.includes('##')) note = note.replace('##', '𝄪')
  if (note.includes('#')) note = note.replace('#', '♯')
  if (note.includes('bb')) note = note.replace('bb', '𝄫')
  if (note.includes('b')) note = note.replace('b', '♭')
  

  if (note.length > 2) {

      text(note[0],x-0.3*size,y)
      textSize(0.6*size)
      text(note[1]+note[2],x+0.3*size,y-0.3*size)
  } else
  if (note.length == 2) {
      text(note[0],x-0.1*size,y)
      textSize(0.6*size)
      text(note[1],x+0.3*size,y-0.2*size)
  } else {
      textSize(size)
      text(note[0],x,y)
  }
  
  pop()
}