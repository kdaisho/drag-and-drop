const dd = {};

dd.setOrder = function () {
    dd.fills = document.querySelectorAll(".fill");
    console.log("After setting order:", dd.fills[0], dd.fills[1], dd.fills[2], dd.fills[3], dd.fills[4]);
};

dd.dragStart = function () {
    dd.grabbed = this;
    setTimeout(() => this.classList.add("invisible"), 0);
    dd.indexFrom = parseInt(this.parentElement.getAttribute("data-position"));
};

dd.dragEnd = function () {
    this.classList.remove("invisible");
};

dd.dragOver = function (event) {
    event.preventDefault();
    this.classList.add("hovered");
}

dd.dragEnter = function () {
    event.preventDefault();
    dd.indexTo = parseInt(this.getAttribute("data-position"));
    setTimeout(() => dd.adjustTop(dd.indexFrom < dd.indexTo ? "up" : "down"), 0);
};

dd.dragLeave = function () {
    this.classList.remove("hovered");
    dd.adjustTop();
};

dd.dragDrop = function () {
    this.classList.remove("hovered");
    dd.appendAll(parseInt(this.getAttribute("data-position")));
    this.append(dd.grabbed);
    setTimeout(() => dd.setOrder(), 0);
};

dd.appendAll = function (indexTo) {
    if (dd.indexFrom < indexTo) {
        console.log("Up");
        for (let i = dd.indexFrom + 1; i <= indexTo; i++) {
            dd.empties[i - 1].append(dd.fills[i]);
        }
    }
    else {
        console.log("Down");
        for (let i = dd.indexFrom - 1; i >= indexTo; i--) {
            dd.empties[i + 1].append(dd.fills[i]);
        }
    }
    for (let i = 0; i < dd.fills.length; i++) {
        dd.fills[i].classList.remove("up", "down");
    }
};

dd.adjustTop = function (operator) {
    if (operator === "up") {
        for (let i = dd.indexFrom + 1; i <= dd.indexTo; i++) {
            dd.fills[i].classList.add("up");
        }
    }
    else if (operator === "down") {
        for (let i = dd.indexTo; i <= dd.indexFrom; i++) {
            dd.fills[i].classList.add("down");
        }
    }
    else {
        for (let i = 0; i < dd.fills.length; i++) {
            dd.fills[i].classList.remove("up", "down");
        }
    }
}

dd.init = function () {
    dd.empties = document.getElementsByClassName("empty");
    dd.fills = "";
    dd.grabed = "";
    dd.indexFrom = "";
    dd.indexTo = "";
    dd.hoverOn = "";
    dd.setOrder();
    for (let i = 0; i < dd.fills.length; i++) {
        dd.fills[i].addEventListener('dragstart', dd.dragStart);
        dd.fills[i].addEventListener('dragend', dd.dragEnd);
    }
    for (let i = 0; i < dd.empties.length; i++) {
        dd.empties[i].addEventListener('dragover', dd.dragOver);
        dd.empties[i].addEventListener('dragenter', dd.dragEnter);
        dd.empties[i].addEventListener('dragleave', dd.dragLeave);
        dd.empties[i].addEventListener('drop', dd.dragDrop);
    }
};

dd.init();

//touch device
// const coordinates = [];
// for (let i = 0; i < empties.length; i++) {
//     coordinates.push(empties[i].getBoundingClientRect());
// }
// console.log(coordinates);

// for (let i = 0; i < fills.length; i++) {
//     fills[i].addEventListener("touchstart", touchStart);
//     fills[i].addEventListener("touchmove", touchMove, {passive: false});
//     fills[i].addEventListener("touchend", touchEnd);
// }

// // let offsetX = 0;
// // let offsetY = 0;
// let lastPosition = 0;

// const height = 0;
// const width = 0;

// function getPosition (coordinates, x, y) {
//     for (let i = 0; i < coordinates.length; i++) {
//         if ((x >= coordinates[i].x && x <= coordinates[i].right) && (y >= coordinates[i].y && y <= coordinates[i].bottom)) {
//             return i;
//         }
//     }
// }

// function touchStart (event) {
//     const initialLocation = event.targetTouches[0];
//     console.log("initial location", initialLocation.pageX, initialLocation.pageY);

//     indexFrom = getPosition(coordinates, initialLocation.pageX, initialLocation.pageY);
//     console.log('HYA', indexFrom);

//     this.style.position = "relative";
//     this.style.zIndex = 100;
//     // offsetX = this.getBoundingClientRect().x;
//     // offsetY = this.getBoundingClientRect().y;
//     // this.style.left = (initialLocation.pageX - offsetX) + 'px';
//     this.style.left = (initialLocation.pageX) + 'px';
//     // this.style.top = (initialLocation.pageY - offsetY) + 'px';
//     this.style.top = (initialLocation.pageY) + 'px';
//     lastPosition = this.parentElement.getAttribute("data-position");
// }

// function touchMove (event) {
//     event.preventDefault();
//     const touchLocation = event.targetTouches[0];
//     // this.style.left = (touchLocation.pageX - offsetX) + 'px';
//     this.style.left = (touchLocation.pageX) + 'px';
//     this.style.top = (touchLocation.pageY) + 'px';

//     //brought from desktop logic
//     //indexFrom and indexTo cannot be used because dragstart doesn't exist in mobile land
//     //you need to create onw indexFrom and indexTo

//     indexTo = getPosition(coordinates, touchLocation.pageX, touchLocation.pageY);

//     console.log("MOB FROM AND TO", indexFrom, indexTo)
//     let operator = indexFrom < indexTo ? "-" : "+";
//     // adjustTop(indexFrom, indexTo, 42, operator);

//     //when leave set top 0
// }

// function touchEnd (event) {
//     console.log("TOUCH END");
//     appendAll(indexFrom, indexTo);
//     adjustTop(indexFrom, indexTo, 0);
//     empties[indexTo].append(this);
//     // const x = this.getBoundingClientRect().left + (width / 2);
//     // const y = this.getBoundingClientRect().top + (height / 2);

//     // for (let i = 0; i < coordinates.length; i++) {
//     //     if (x > coordinates[i].left && x < coordinates[i].right && y > coordinates[i].top && y < coordinates[i].bottom) {
//     //         empties[i].append(this);
//     //         this.style.left = "5px";
//     //         this.style.top = 0;
//     //         return false;
//     //     }
//     //     empties[lastPosition].append(this);
//     //     this.style.left = "5px";
//     //     this.style.top = 0;
//     // }
// }