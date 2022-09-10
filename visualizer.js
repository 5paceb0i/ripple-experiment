const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

var visRect = document.getElementById('visualizer');
canvas.width = visRect.getBoundingClientRect().width-10;
canvas.height = visRect.getBoundingClientRect().height-8;
canvas.top = visRect.getBoundingClientRect().top;
canvas.left = visRect.getBoundingClientRect().left;
console.log(visRect.getBoundingClientRect().width, visRect.getBoundingClientRect().height);

let particleArray = [];
let rippleArray = [];

let adjustX = visRect.offsetLeft -20;
let adjustY = visRect.offsetTop -30;
let keydownCount = 0;
let keyUpFlag = 1;
let originalMouseRadius = 50;
let isMusicPlaying = false;
let audio = new Audio('G:/downloads/vF.wav');
let audio2 = new Audio('');
var fadeAudio;
var counter = 0;
var stepper = 0.1;
var flip = true;
var playAnim = false;

//var points = [];

//mouse handle --> Change radius of this mouse handle dynamically
const mouse = {
    x: null,
    y: null,
    radius: originalMouseRadius
}

//event Listener
window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('keydown',function(){
    keydownCount++;
    keyUpFlag = 0;
    playAnim = true;
    //clearInterval(fadeAudio);
    //audio.currentTime=0;
    //playMusic();
    createRipple();
});

window.addEventListener('keyup',function(){
    keyUpFlag = 1;
    keydownCount = 0;
    counter = 0;
    isMusicPlaying = false;
});

window.addEventListener('resize', () => {
    canvas.width = visRect.getBoundingClientRect().width-10;
    canvas.height = visRect.getBoundingClientRect().height-8;
})

// function increaseRadius(){
//     mouse.radius+=10;
// }

// myVar = setInterval(increaseRadius(), 1000);

ctx.fillStyle = 'white';
ctx.font = '30px Verdana';
ctx.fillText('A', 0, 40);

const textCoordinates = ctx.getImageData(0,0,100,100);

//rippleCircle Object
class Ripple{
    constructor(x,y,size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 40) + 5;
        this.mouseDistance = 0;
        this.vel = 0.1;
        this.speed = 0.001;
        this.points= [];

    }
    draw(){
        ctx.strokeStyle = 'cyan';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
    }

    update(){
        let [p0, p1, p2, p3] = rippleArray[0].points;
        //Calculate the coefficients based on where the ball currently is in the animation
        let cx = 3 * (p1.x - p0.x);
        let bx = 3 * (p2.x - p1.x) - cx;
        let ax = p3.x - p0.x - cx - bx;

        let cy = 3 * (p1.y - p0.y);
        let by = 3 * (p2.y - p1.y) - cy;
        let ay = p3.y - p0.y - cy -by;

        let t = rippleArray[0].vel;

        //Increment t value by speed
        rippleArray[0].vel += rippleArray[0].speed;
        //Calculate new X & Y positions of ball
        let xt = ax*(t*t*t) + bx*(t*t) + cx*t + p0.x;
        let yt = ay*(t*t*t) + by*(t*t) + cy*t + p0.y;

        if(rippleArray[0].vel > 1){
            rippleArray[0].vel = 1;
            rippleArray[0].size = 0;
        }
        else{   
        //We draw the ball to the canvas in the new location
        rippleArray[0].x = xt;
        rippleArray[0].y = yt;
        //rippleArray[0].size += 1;
        }

        //this.draw();
    }
    
}

//particle Object
class Particle{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 3;
        //base values are initial values to return particles to their original posn
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 40) + 5;
        this.mouseDistance = 0;
    }
    draw(){
        ctx.fillStyle = 'cyan';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    //computes distance between mouse position and particle position
    update(){
        let dx = rippleArray[0].x - this.x;
        let dy = rippleArray[0].y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        this.mouseDistance = distance;

        //force Direction, greater distance -> less force
        let forceDirectionX = dx/distance;
        let forceDirectionY = dy/distance;
        let maxDistance = rippleArray[0].size;

        //closer particles have more speed
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

       
        
        //console.log(rippleArray[0].x);
        if(distance < rippleArray[0].size){
            this.x -= directionX
            this.y -= directionY;
        }
        else{
            if(this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/100;
            }
            if(this.x !== this.baseY){
                let dy = this.y -  this.baseY;
                this.y -= dy/100;
            }
        }
    }
}

//filling canvas with random generated particles
function init() {
    particleArray = [];
    for(let i = 0; i < 100; i++){
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particleArray.push(new Particle(x,y));
    }
    // for(let y = 0, y2 = textCoordinates.height; y<y2; y++){
    //     for(let x = 0, x2 = textCoordinates.width; x<x2; x++){
    //        if(textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
    //             let positionX = x + adjustX;
    //             let positionY = y + adjustY;
    //             particleArray.push(new Particle(positionX * 30,positionY * 30));
    //        } 
    //     }
    // }
    
    rippleArray.push(new Ripple(30,30,60));
    rippleArray[0].points = [
        {x: rippleArray[0].x, y: rippleArray[0].y},
        {x:70, y:200},
        {x:507, y:115},
        {x:560, y:415}
    ];
}

init();

//recursive function that calls it self and animates
function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    for( let i=0; i < particleArray.length; i++){
        //rippleArray[0].draw();
        particleArray[i].draw();
        particleArray[i].update();  
    }

    if(playAnim){
        rippleArray[0].update();
    }
    
    
    connect();
    //increaseRadius();
    
    // if(keydownCount%3 == 1){
    //     mouse.radius+=5;
    // }

    // if(keyUpFlag == 1 && mouse.radius > originalMouseRadius ){
    //     mouse.radius=originalMouseRadius;
    // }
    
    requestAnimationFrame(animate);
}

animate();

function connect(){
    let opacityValue = 1;
    for(let a = 0; a < particleArray.length; a++){
        for(let b = a; b < particleArray.length; b++){
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx*dx + dy*dy);

            if(distance < 50){
                opacityValue = 1 - (distance/50);
                if(particleArray[a].mouseDistance < (mouse.radius + 100)){
                    ctx.strokeStyle = 'rgba(0,245,184,' + opacityValue + ')';
                }
                else{
                    ctx.strokeStyle = 'rgba(157,95,250,' + opacityValue + ')';
                } 
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
            // else if( this.mouseDistance < 20)
        }
    }
}

function playMusic(){
       if(isMusicPlaying === false){
        isMusicPlaying = true;
        audio.currentTime = 0;
        audio.play();
    }
}


function createRipple(){
    rippleArray[0].x = Math.random() * canvas.width;
    rippleArray[0].y = Math.random() * canvas.height;
    rippleArray[0].vel = 0;
    rippleArray[0].size = 100;
    rippleArray[0].points = [
        {x: rippleArray[0].x, y: rippleArray[0].y},
        {x:70, y:200},
        {x:507, y:115},
        {x:560, y:415}
    ];

}
