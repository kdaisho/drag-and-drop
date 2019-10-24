const empties = document.querySelectorAll(".empty");
var fills = "";

function setOrder () {
    fills = document.querySelectorAll(".fill");
    for (let i = 0; i < fills.length; i++) {
        fills[i].addEventListener('dragstart', dragStart);
        fills[i].addEventListener('dragend', dragEnd);
    }
    console.log('Set order:', fills[0], fills[1], fills[2], fills[3], fills[4]);
}

for (let i = 0; i < empties.length; i++) {
    empties[i].addEventListener('dragover', dragOver);
    empties[i].addEventListener('dragenter', dragEnter);
    empties[i].addEventListener('dragleave', dragLeave);
    empties[i].addEventListener('drop', dragDrop);
}

setOrder();

let grabbed = "";
let indexFrom = "";
let hoverOn = "";
let indexTo = "";

function dragStart () {
    this.classList.add("hold");
    grabbed = this;
    // setTimeout(() => this.className = "invisible", 0);
    setTimeout(() => this.className = "invisible", 0);
    indexFrom = parseInt(this.parentElement.getAttribute("data-position"));
    console.log("start indexFrom", indexFrom);
}

function dragEnd () {
    console.log("end");
    this.className = "fill";
}

function dragOver (event) {
    event.preventDefault();
    this.classList.add("hovered");
}

function dragEnter () {
    event.preventDefault();
    indexTo = parseInt(this.getAttribute("data-position"));
    // adjustTop(indexFrom, indexTo, -42);
    let operator = indexFrom < indexTo ? "-" : "+";

    adjustTop(indexFrom, indexTo, 42, operator);
}

function dragLeave () {
    this.className = "empty";
    adjustTop(indexFrom, indexTo, 0);
}

function dragDrop () {
    this.className = "empty";

    indexTo = parseInt(this.getAttribute("data-position"));
    pushAll(indexFrom, indexTo);
    this.append(grabbed);
    adjustTop(indexFrom, indexTo, 0);
    setTimeout(() => setOrder(), 0);
}

function pushAll (indexFrom, indexTo) {
    console.log('PUSH:', indexFrom, indexTo);
    if (indexFrom < indexTo) {
        console.log("Up");
        for (let i = indexFrom + 1; i <= indexTo; i++) {
            empties[i - 1].append(fills[i]);
        }
    }
    else {
        console.log("Down");
        for (let i = indexFrom - 1; i >= indexTo; i--) {
            empties[i + 1].append(fills[i]);
        }
    }
}

function adjustTop (indexFrom, indexTo, amount, operator) {
    console.log("OPE:", operator);
    if (operator === "-") {
        for (let i = indexFrom + 1; i <= indexTo; i++) {
            fills[i].style.top = fills && fills[i] ? operator + amount + "px" : "";
        }
    }
    else if (operator === "+") {
        console.log('Kochi', indexTo, amount);
        for (let i = indexTo; i <= indexFrom; i++) {
            fills[i].style.top = fills && fills[i] ? amount + "px" : "";
        }
    }
    else {
        console.log("RESET TOP", amount);
        for (let i = indexFrom + 1; i <= indexTo; i++) {
            fills[i].style.top = fills && fills[i] ? operator + amount + "px" : "";
            console.log(fills[i].style.top);
        }
        fills.forEach((fill) => {
            fill.style.top = 0;
        });
    }
}

function decide (grabbed, hoverOn) {
    for (let i = 0; i < hoverOn; i++) {
        console.log(fills[i]);
    }
}


//touch device
const coordinates = [];
for (let i = 0; i < empties.length; i++) {
    coordinates.push(empties[i].getBoundingClientRect());
}
console.log(coordinates);

for (let i = 0; i < fills.length; i++) {
    fills[i].addEventListener("touchstart", touchStart);
    fills[i].addEventListener("touchmove", touchMove, {passive: false});
    fills[i].addEventListener("touchend", touchEnd);
}

let offsetX = 0;
let offsetY = 0;
let lastPosition = 0;

const height = 0;
const width = 0;

function touchStart (event) {
    const initialLocation = event.targetTouches[0];
    this.style.position = "relative";
    this.style.zIndex = 100;
    offsetX = this.getBoundingClientRect().x;
    offsetY = this.getBoundingClientRect().y;
    this.style.left = (initialLocation.pageX - offsetX) + 'px';
    this.style.top = (initialLocation.pageY - offsetY) + 'px';
    lastPosition = this.parentElement.getAttribute("data-position");
}

function touchMove (event) {
    event.preventDefault();
    const touchLocation = event.targetTouches[0];
    this.style.left = (touchLocation.pageX - offsetX) + 'px';
    this.style.top = (touchLocation.pageY - offsetY) + 'px';

    //brought from desktop logic
    //indexFrom and indexTo cannot be used because dragstart doesn't exist in mobile land
    //you need to create onw indexFrom and indexTo
    indexFrom = 4, indexTo = 3;
    console.log("MOB FROM AND TO", indexFrom, indexTo)
    let operator = indexFrom < indexTo ? "-" : "+";
    adjustTop(indexFrom, indexTo, 42, operator);
}

function touchEnd (event) {
    console.log("TOUCH END");
    const x = this.getBoundingClientRect().left + (width / 2);
    const y = this.getBoundingClientRect().top + (height / 2);

    for (let i = 0; i < coordinates.length; i++) {
        if (x > coordinates[i].left && x < coordinates[i].right && y > coordinates[i].top && y < coordinates[i].bottom) {
            empties[i].append(this);
            this.style.left = "5px";
            this.style.top = 0;
            return false;
        }
        empties[lastPosition].append(this);
        this.style.left = "5px";
        this.style.top = 0;
    }
}