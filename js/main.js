const fill = document.querySelector(".fill");
const empties = document.querySelectorAll(".empty");

fill.addEventListener("dragstart", dragStart);
fill.addEventListener("dragend", dragEnd);

for(let i = 0; i < empties.length; i++) {
    empties[i].addEventListener('dragover', dragOver);
    empties[i].addEventListener('dragenter', dragEnter);
    empties[i].addEventListener('dragleave', dragLeave);
    empties[i].addEventListener('drop', dragDrop);
}

function dragStart () {
    this.classList.add("hold");
    setTimeout(() => this.className = "invisible", 0);
}

function dragEnd () {
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