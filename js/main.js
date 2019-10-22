const fill = document.querySelector(".fill");
const empties = document.querySelectorAll(".empty");

fill.addEventListener("dragstart", dragStart);
fill.addEventListener("dragend", dragEnd);

for (let i = 0; i < empties.length; i++) {
    empties[i].addEventListener('dragover', dragOver);
    empties[i].addEventListener('dragenter', dragEnter);
    empties[i].addEventListener('dragleave', dragLeave);
    empties[i].addEventListener('drop', dragDrop);
}

function dragStart () {
    console.log('start');
    // this.classList.add("hold");
    // setTimeout(() => this.className = "invisible", 0);
}

function dragEnd () {
    console.log('end');
    this.className = "fill";
}

function dragOver (event) {
    event.preventDefault();
}

function dragEnter () {
    event.preventDefault();
    this.classList.add("hovered");
}

function dragLeave () {
    this.className = "empty";
}

function dragDrop () {
    this.className = "empty";
    this.append(fill);
}

//touch device
const coordinates = [];
for (let i = 0; i < empties.length; i++) {
    coordinates.push(empties[i].getBoundingClientRect());
}
console.log(coordinates);

fill.addEventListener("touchstart", touchStart);
fill.addEventListener("touchmove", touchMove, {passive: false});
fill.addEventListener("touchend", touchEnd);

let offsetX = 100;
let offsetY = 150;
let lastPosition = 0;

const height = 150;
const width = 150;

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
}

function touchEnd (event) {
    const x = this.getBoundingClientRect().left + (width / 2);
    const y = this.getBoundingClientRect().top + (height / 2);

    for (let i = 0; i < coordinates.length; i++) {
        if (x > coordinates[i].left && x < coordinates[i].right && y > coordinates[i].top && y < coordinates[i].bottom) {
            empties[i].append(this);
            this.style.left = "5px";
            this.style.top = "5px";
            return false;
        }
        empties[lastPosition].append(this);
        this.style.left = "5px";
        this.style.top = "5px";
    }
}