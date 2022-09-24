/*
Checks to see if button is held and prevents the text selection from popping up
*/
let button_held = false;
let inflate_button = document.getElementById("Inflate");
inflate_button.addEventListener("touchstart", (event) => {
  button_held = true;
  event.returnValue = false;
});
inflate_button.addEventListener("touchend", (event) => {
  button_held = false;
  event.returnValue = false;
});

let popped = false;
let numOfPumps = 0;
let counter = 0;
function trackPumps(value, precision = 1) {
  document.getElementById("counter").innerHTML = counter;
  if (value < -25) {
    if (counter > numOfPumps) {
      popped = true;
      document.getElementById("gameState").innerHTML = "You popped the balloon";
    } else {
      counter++;
    }
  }
}

function handleMotion(event) {
  if (button_held) {
    trackPumps(event.acceleration.z);
  }
}

let is_running = false;
let demo_button = document.getElementById("StartGame");
demo_button.onclick = function (e) {
  e.preventDefault();

  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission();
  }

  if (is_running) {
    counter = 0;
    document.getElementById("counter").innerHTML = "0";
    window.removeEventListener("devicemotion", handleMotion);
    demo_button.innerHTML = "Start demo";
    demo_button.classList.add("btn-success");
    demo_button.classList.remove("btn-danger");
    is_running = false;
  } else {
    counter = 0;
    numOfPumps = Math.floor(Math.random() * 50) + 20;
    document.getElementById("counter").innerHTML = "0";
    window.addEventListener("devicemotion", handleMotion);
    document.getElementById("StartGame").innerHTML = "End Game";
    demo_button.classList.remove("btn-success");
    demo_button.classList.add("btn-danger");
    is_running = true;
  }
};

let menu_button = document.getElementById("MainMenu");
menu_button.onclick = function (e) {
  e.preventDefault();
  //return to main menu
};
