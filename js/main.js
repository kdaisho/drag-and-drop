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
    dd.removeUpDownFromFills();
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
};

dd.adjustTop = function (operator) {
    console.log("Adjusting", operator);
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


// ************************ TOUCH ***********
//touch devices

dd.getPosition = function (x, y) {
    for (let i = 0; i < dd.coordinates.length; i++) {
        if ((x >= dd.coordinates[i].x && x <= dd.coordinates[i].right) && (y >= dd.coordinates[i].y && y <= dd.coordinates[i].bottom)) {
            return i;
        }
    }
}

dd.isIn = function (x, y) {
    console.log("is in", x, y);
    for (let i = 0; i < dd.coordinates.length; i++) {
        if ((x >= dd.coordinates[i].x && x <= dd.coordinates[i].right) && (y >= dd.coordinates[i].y && y <= dd.coordinates[i].bottom)) {
            console.log("IN");
            return i;
        }
    }
};

dd.removeUpDownFromFills = function () {
    for (let i = 0; i < dd.fills.length; i++) {
        dd.fills[i].classList.remove("up", "down");
    }
}

dd.touchStart = function (event) {
    dd.indexFrom = dd.getPosition(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
    dd.lastPosition = parseInt(this.parentElement.getAttribute("data-position"));
    dd.initialX = this.getBoundingClientRect().x;
    dd.initialY = this.getBoundingClientRect().y;
    console.log(dd.initialX, dd.initialY);
};

dd.touchMove = function (event) {
    console.log("TOUICH MOVE FIRED", event);
    event.cancelable ? event.preventDefault() : "";
    this.style.left = (event.targetTouches[0].pageX - dd.initialX) + "px";
    this.style.top = (event.targetTouches[0].pageY - dd.initialY) + "px";

    dd.indexTo = dd.getPosition(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
    //when dd.indexTo is undefined, fill is outside
    console.log("It's in", dd.indexTo);
    //isIN function is not needed
    if (typeof dd.indexFrom === "number" && typeof dd.indexTo === "number") {
        dd.adjustTop(dd.indexFrom < dd.indexTo ? "up" : "down");
    }
    else {
        dd.removeUpDownFromFills();
    }
};

dd.touchEnd = function (event) {
    console.log("TOUCH END", typeof dd.indexTo);
    this.style.left = "5px";
    this.style.top = 0;

    this.removeAttribute("style");
    //when dd.indexTo is undefined, up, down class won't be removed
    //so remove them here
    dd.removeUpDownFromFills();

    if (typeof dd.indexTo === "number" && dd.currentSpot !== dd.indexTo) {
        dd.appendAll(dd.indexTo);
        dd.empties[dd.indexTo].append(this);
        dd.currentSpot = dd.indexTo;
    }
    setTimeout(() => dd.setOrder(), 0);
};

dd.initTouch = function () {
    dd.coordinates = [];
    dd.lastPosition = 0;
    dd.height = 0;
    dd.width = 0;
    dd.initialLocation;
    dd.currentSpot;

    for (let i = 0; i < dd.empties.length; i++) {
        dd.coordinates.push(dd.empties[i].getBoundingClientRect());
    }
    for (let i = 0; i < dd.fills.length; i++) {
        dd.fills[i].addEventListener("touchstart", dd.touchStart);
        dd.fills[i].addEventListener("touchmove", dd.touchMove, {passive: false});
        dd.fills[i].addEventListener("touchend", dd.touchEnd);
    }
    console.log(dd.coordinates);
};

dd.initTouch();