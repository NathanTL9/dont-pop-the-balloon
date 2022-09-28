// Event listeners
window.addEventListener("resize", resizeCanvas);
let buttonHeld = false;

document.addEventListener("touchstart", pageClicked);
document.addEventListener("touchend", pageReleased);
document.addEventListener("mousedown", pageClicked);
document.addEventListener("mouseup", pageReleased);


// Setting up canvas
document.getElementById("canvas").width = window.innerWidth;
document.getElementById("canvas").height = window.innerHeight;
let ctx = document.getElementById("canvas").getContext("2d");

// Game variables
let balloonFill = 100;
let balloonFillVel = 0;
let houseHeight = 0;
let houseVel = 0;
let grassPos = 0;
let grassVel = 0;
let mountainPos = 0.1;
let mountainVel = 0;
let parallax = false;
let numOfPumps = 0;
let counter = 0;
let popped = false;
let firstClick = true;

document.getElementById("begin").onclick = function (e) {
  e.preventDefault();
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
          }
        })
        .catch(console.error);
    } else {
      // handle regular non iOS 13+ devices
    }

   balloonFill = 100;
   balloonFillVel = 0;
   houseHeight = 0;
   houseVel = 0;
   grassPos = 0;
   grassVel = 0;
   mountainPos = 0.1;
   mountainVel = 0;
   parallax = false;
   numOfPumps = 0;
   counter = 0;
   popped = false;
   firstClick = true;
  
  numOfPumps = Math.floor(Math.random() * 100) + 25;
  document.getElementById("begin").innerHTML = "Restart";
  window.addEventListener("devicemotion", handleMotion);
};


document.getElementById("end").onclick = function (e) {
    window.removeEventListener("devicemotion", handleMotion);
    window.location.href = document.location='index.html';
};

resizeCanvas();
window.requestAnimationFrame(gameLoop);

function gameLoop() {
    tick();
    render();
    window.requestAnimationFrame(gameLoop);
}

function tick() {
  if (popped) {
    
    return;
  }
  
  console.log("Fill vel:" + balloonFillVel);
    balloonFill += balloonFillVel;
    grassPos += grassVel;
    mountainPos += mountainVel;
    houseHeight += houseVel;
  
  balloonFillVel -= 0.1;
  grassVel -= 0.1;
  mountainVel -= 0.1;
  houseVel -= 0.1;
  
  if (balloonFillVel < 0) {
    balloonFillVel = 0;
  }
  if (grassVel < 0) {
    grassVel = 0;
  }
  if (mountainVel < 0) {
    mountainVel = 0;
  }
  if (houseVel < 0) {
    houseVel = 0;
  }
}

function render() {
    let houseSize = window.innerHeight / 3;
    let balloonSize = (window.innerHeight / 2000) * balloonFill;
    ctx.fillStyle = '#76d6ff'
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    if (parallax) {
        if (window.innerHeight * (16 / 9) >= window.innerWidth) {
            ctx.drawImage(document.getElementById("mountains"), -(((window.innerHeight * (16 / 9)) - window.innerWidth) / 2), 0 + mountainPos, window.innerHeight * (16 / 9), window.innerHeight);
            ctx.drawImage(document.getElementById("grass"), -(((window.innerHeight * (16 / 9)) - window.innerWidth) / 2), 0 + grassPos, window.innerHeight * (16 / 9), window.innerHeight);
        } else {
            ctx.drawImage(document.getElementById("mountains"), 0, -(((window.innerWidth * (9 / 16)) - window.innerHeight)) + mountainPos, window.innerWidth, window.innerWidth * (9 / 16));
            ctx.drawImage(document.getElementById("grass"), 0, -(((window.innerWidth * (9 / 16)) - window.innerHeight)) + grassPos, window.innerWidth, window.innerWidth * (9 / 16));
        }
    } else {
        if (window.innerHeight * (16 / 9) >= window.innerWidth) {
            ctx.drawImage(document.getElementById("mountains"), -(((window.innerHeight * (16 / 9)) - window.innerWidth) / 2), 0, window.innerHeight * (16 / 9), window.innerHeight);
            ctx.drawImage(document.getElementById("grass"), -(((window.innerHeight * (16 / 9)) - window.innerWidth) / 2), 0, window.innerHeight * (16 / 9), window.innerHeight);
        } else {
            ctx.drawImage(document.getElementById("mountains"), 0, -(((window.innerWidth * (9 / 16)) - window.innerHeight)), window.innerWidth, window.innerWidth * (9 / 16));
            ctx.drawImage(document.getElementById("grass"), 0, -(((window.innerWidth * (9 / 16)) - window.innerHeight)), window.innerWidth, window.innerWidth * (9 / 16));
        }
    }
    if (window.innerHeight - houseSize - houseHeight > window.innerHeight / 2 - houseSize / 2 || parallax) {
        ctx.drawImage(document.getElementById("house"), (window.innerWidth / 2) - (houseSize / 2), window.innerHeight - houseSize - houseHeight, houseSize, houseSize);
        ctx.drawImage(document.getElementById("balloon"), (window.innerWidth / 2) - (balloonSize / 2), (window.innerHeight / 2) - (balloonSize) - houseHeight, balloonSize, balloonSize);
    } else {
        ctx.drawImage(document.getElementById("house"), (window.innerWidth / 2) - (houseSize / 2), window.innerHeight / 2 - houseSize / 2, houseSize, houseSize);
        ctx.drawImage(document.getElementById("balloon"), (window.innerWidth / 2) - (balloonSize / 2), (window.innerHeight / 2) - (balloonSize), balloonSize, balloonSize);
        parallax = true;
    }

}

function resizeCanvas() {
    document.getElementById("canvas").width = window.innerWidth;
    document.getElementById("canvas").height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;
}

function pageClicked() {
    buttonHeld = true;
    //console.log("Testing");
}

function pageReleased() {
    buttonHeld = false;
    //console.log("Testing over");
}

function trackPumps(value) {
    //console.log("Motion val:" + value);
    if (value < -25) {
        if (counter > numOfPumps) {
            popped = true;
            console.log("The balloon popped!");
        } else {
            counter++;
            balloonFillVel = 2.0;
        
            if (parallax) {
                grassVel = 5.0;
                mountainVel = 4.0;
                if (houseHeight > window.innerHeight / 20) {
                    houseVel = -2.0;
                }
            } else {
                houseVel = 5.0;
            }
        }
    }
}

function handleMotion(event) {
    if (buttonHeld) {
        //console.log("Handling motion");
        trackPumps(event.acceleration.z);
    }
}