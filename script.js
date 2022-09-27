// Event listeners
window.addEventListener("resize", resizeCanvas);
let buttonHeld = false;
document.addEventListener("touchstart", pageClicked);
document.addEventListener("touchend", pageReleased);
document.addEventListener("mousedown", pageClicked);
document.addEventListener("mouseup", pageReleased);
window.addEventListener("devicemotion", handleMotion);

// Setting up canvas
document.getElementById("canvas").width = window.innerWidth;
document.getElementById("canvas").height = window.innerHeight;
let ctx = document.getElementById("canvas").getContext("2d");

// Game variables
let balloonFill = 100;
let houseHeight = 0;
let grassPos = 0;
let mountainPos = 0.1;
let parallax = false;
let numOfPumps = 0;
let counter = 0;
let popped = false;
let firstClick = true;

resizeCanvas();
window.requestAnimationFrame(gameLoop);

function gameLoop() {
    tick();
    render();
    window.requestAnimationFrame(gameLoop);
}

function tick() {
    if (!buttonHeld || buttonHeld) {
        return;
    }
    balloonFill += 0.1;

    if (parallax) {
        grassPos += 0.5;
        mountainPos += 0.2;
        if (houseHeight > window.innerHeight / 20) {
            houseHeight -= 0.1;
        }
    } else {
        houseHeight += 0.5;
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
    console.log("Testing");
}

function pageReleased() {
    buttonHeld = false;
    console.log("Testing over");
}

function handleMotion(event) {
    document.getElementById("testText").style.display = "block";
    if (buttonHeld) {
        trackPumps(event.acceleration.z);
    }
}

function trackPumps(value, precision = 1) {
    if (value < -25) {
        if (counter > numOfPumps) {
            popped = true;
            console.log("The balloon popped!");
        } else {
            counter++;
            if (!buttonHeld) {
                return;
            }
            balloonFill += 0.1;
        
            if (parallax) {
                grassPos += 0.5;
                mountainPos += 0.2;
                if (houseHeight > window.innerHeight / 20) {
                    houseHeight -= 0.1;
                }
            } else {
                houseHeight += 0.5;
            }
        }
    }
}

document.getElementById("begin").onclick = function (e) {
    console.log("The begin button was pressed");
    e.preventDefault();

    if (
        DeviceMotionEvent &&
        typeof DeviceMotionEvent.requestPermission === "function"
    ) {
        DeviceMotionEvent.requestPermission();
    }
    counter = 0;
    numOfPumps = Math.floor(Math.random() * 70) + 20;
};