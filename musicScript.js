var notes1 = ['g#3','b3','c#4','d#4','f#4','g#4','b4','c#5','d#5','f#5','g#5','b5','c#6','d#6','f#6','g#6'];
const notes2 = ['g#3','b3','c#4','d#4','f#4','g#4','b4','c#5','d#5','f#5','g#5','b5','c#6','d#6','f#6','g#6'];
const sampleMusic = ["d#6","b4","f#6","g#4","","d#4","b3","d#6","d#6","b3","","b5","d#5","","g#5",""];
const sampleChords = ['','','','','','c#6','','','g#3','','g#6','','','','',''];
const bgNotes = ['g#3','b3', 'c#3', 'd#3', 'f#3','g#2','b2', 'c#2', 'd#2', 'f#2', ];
const bassNotes = ['d#1','b1','c#1','g#1'];
var rhthym = 0;
var rhythm2 = 0;
var rhythm3 = 0;
var bassCounter = 0;
var flipper = true;
var masterVolume = 1;
notes1 = (Tonal.Scale.get("C4 minor").notes).concat(Tonal.Scale.get("C5 minor").notes, Tonal.Scale.get("C3 minor").notes);
var chordNotes = Tonal.Chord.get("F3min").notes;
const lowerCased = notes1.map(note => note.toLowerCase());
chordNotes = chordNotes.map(note2 => note2.toLowerCase());
console.log(chordNotes);
var genMusic = getRandomNotes(35, lowerCased);
var genMusic2 = getRandomNotes(60, lowerCased);
const allNotes = [...new Set([...genMusic, ...genMusic2])].sort();
allNotes.shift();

var genBg = getRandomNotes(20, bgNotes);
let noteHit;
let noteHitPast;


//effects
const pingPong = new Tone.PingPongDelay("4n", 0.2).toDestination();
const reverb = new Tone.Reverb({
    "decay" : 5
}).toDestination();
const reverb2 = new Tone.Reverb().toDestination();
const reverb3 = new Tone.Reverb({
    "wet" : 1,
    "decay" : 20
}).toDestination();
const filter = new Tone.Filter(400, 'highpass');
const filter2 = new Tone.Filter(800, 'lowpass');
const filter3 = new Tone.Filter(1200, 'lowpass');
const feedbackDelay = new Tone.FeedbackDelay("4n", 0.5).toDestination();
const compressor = new Tone.Compressor({ 
    ratio : 2 ,
    threshold : -13 ,
    release : 0.05 ,
    attack : 0.002 ,
    knee : 24
});
const chorus = new Tone.Chorus().toDestination().start();
const noiseFilter = new Tone.Filter(100,'lowpass');
const noiseSource = new Tone.Noise('brown').connect(noiseFilter).start();
const panner = new Tone.Panner3D(0,0,2);
const pitchModulation = new Tone.PitchShift(12);

//instruments
const synth = new Tone.AMSynth({});
const bgSynth = new Tone.AMSynth({});
const bassSynth = new Tone.FMSynth({});
const chordSynth = new Tone.PolySynth(Tone.FMSynth);

//mixing volumes
noiseSource.volume.value = -45;
chordSynth.volume.value = -20;
bassSynth.volume.value = -25;
bgSynth.volume.value = -15;


noiseFilter.frequency.rampTo(1000,'1n');

chordSynth.set({
    "volume": 0,
    "detune": 0,
    "portamento": 0,
    "harmonicity": 3.000000000000001,
    "oscillator": {
        "partialCount": 0,
        "partials": [],
        "phase": 0,
        "type": "sawtooth"
    },
    "envelope": {
        "attack": 0.5,
        "attackCurve": "linear",
        "decay": 0.5,
        "decayCurve": "linear",
        "release": 0.4,
        "releaseCurve": "exponential",
        "sustain": 0.9999999999999999
    },
    "modulation": {
        "partialCount": 0,
        "partials": [],
        "phase": 5,
        "type": "sawtooth"
    },
    "modulationEnvelope": {
        "attack": 0.2,
        "attackCurve": "linear",
        "decay": 0.01,
        "decayCurve": "exponential",
        "release": 0.5,
        "releaseCurve": "exponential",
        "sustain": 1
    },
    "modulationIndex": 4.800000000000022
});

//chaining the effects 
Tone.Master.volume.value = masterVolume;
synth.chain(filter, filter2, chorus, Tone.Destination);
bgSynth.chain(pitchModulation, reverb,  new Tone.Filter(1000, 'lowpass'), Tone.Destination);
bassSynth.chain(new Tone.Filter(20, 'highpass'), filter2, chorus, reverb3, compressor, feedbackDelay, Tone.Destination);
chordSynth.chain(filter2,chorus, reverb3, feedbackDelay, pingPong, Tone.Destination);
//noiseSource.chain(noiseFilter, compressor, Tone.Destination);

var isPlaying = false;
loop = new Tone.Loop((time) =>{
    if(flipper == true){
        if(genMusic[rhthym%16]!=''){
            synth.triggerAttackRelease(genMusic[rhthym%16],'16n',time);
            createRipple();
            if(noteHitPast){
                noteHitPast.setAttribute("fill" , "#1D1D1D");
            }
            noteHit = document.querySelector(`.${genMusic[rhthym%16]}`);
            noteHitPast = noteHit;
            let noteColor = noteHit.getAttribute("stroke");
            noteHit.setAttribute("fill" , noteColor);
            console.log(genMusic[rhthym%16]);
            if(genMusic2[rhthym%16]!=''){
                //synth.triggerAttackRelease(genMusic2[rhthym%16],'16n',time+0.01);
            }
        }
    }
    else{
        if(genMusic2[rhthym%16]!=''){
            synth.triggerAttackRelease(genMusic2[rhthym%16],'16n',time);
            createRipple();
            if(noteHitPast){
                noteHitPast.setAttribute("fill" , "#1D1D1D");
            }
            noteHit = document.querySelector(`.${genMusic2[rhthym%16]}`);
            let noteColor = noteHit.getAttribute("stroke");
            noteHit.setAttribute("fill" , noteColor);
            noteHitPast = noteHit;
            console.log(genMusic2[rhthym%16]);
        }
    }   

    rhthym++;
    if(rhthym>16){
        flipper = !flipper;
        rhthym =0;
    }
    if(rhthym%16 == 0){
        noiseFilter.frequency.rampTo(1000,'1n');
    }
    else if(rhthym%8 == 0){
        noiseFilter.frequency.rampTo(100,'1n');
    }
}, "2n");

loopBass = new Tone.Loop((time) =>{
    if(rhythm2%8 == 0){
        bassSynth.triggerAttackRelease(bassNotes[bassCounter%4],'1n',time+0.02);
        bassCounter++;
    }
    if(rhythm2%5 == 4){
        chordSynth.triggerAttackRelease(chordNotes,'1n');
    }
    rhythm2++;

    if(rhythm2>15){
        rhythm2 =0;
    }

    if(bassCounter>4){
        bassCounter =0;
    }
},"1n");

loopBg = new Tone.Loop((time)=>{
   if(genMusic[rhythm3%16]!=''){
    bgSynth.triggerAttackRelease(genMusic[rhythm3%16],'32n');
   }
   rhythm3++
   if(rhythm3>16){
    rhythm3 = 0;
   }
   pitchModulation.pitch = Math.random()*30;
}, "16n");

console.log(genBg);
// function loopStep(time){
    
// }

//35 & 60

//function to get random notes from the available notes. randomness(int) : more the number lesser the notes, scale(array of notes)
function getRandomNotes(randomness, scale){
    let genMusic = [];
    for(let i = 0; i < scale.length; i++){
        var randomNum = Math.floor(Math.random()*randomness);
        if(randomNum > scale.length - 1){
            genMusic[i] = '';
        }
        else{
            let note = scale[randomNum];
            genMusic[i] = note;
        }
    }
    return genMusic;
}

console.log(genMusic);
console.log(genMusic2);

window.addEventListener('keydown',function(e){
    // synth.triggerAttackRelease("C4",0.5);
    // if(!isPlaying){
    //     loop.start();
    //     loopBass.start();
    //     //loopBg.start();
    //     Tone.Transport.start();
    //     isPlaying = !isPlaying;
    //     // for(let i =0; i<16;i++){
    //         //synth.triggerAttack(genMusic[2],'16n');
    //     // }
    // }
});

window.addEventListener('keyup',function(e){
    //synth.triggerRelease();
    //isPlaying = false;
});

function startMusic(){
    if(!isPlaying){
        loop.start();
        loopBass.start();
        //loopBg.start();
        Tone.Transport.start();
        isPlaying = !isPlaying;
        // for(let i =0; i<16;i++){
            //synth.triggerAttack(genMusic[2],'16n');
        // }
    }
}

