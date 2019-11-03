const dd = {};

dd.setOrder = function (element) {
    element && element.removeAttribute("style");
    dd.lastPos && dd.empties[dd.lastPos].classList.remove("hovered");
    dd.fills = document.querySelectorAll(".fill");
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
        for (let i = dd.indexFrom + 1; i <= indexTo; i++) {
            dd.empties[i - 1].append(dd.fills[i]);
        }
    }
    else {
        for (let i = dd.indexFrom - 1; i >= indexTo; i--) {
            dd.empties[i + 1].append(dd.fills[i]);
        }
    }
};

dd.adjustTop = function (operator) {
    if (operator === "up") {
        for (let i = dd.indexFrom + 1; i <= dd.indexTo; i++) {
            dd.fills[i].classList.add("up");
        }
    }
    else if (operator === "down") {
        for (let i = dd.indexTo; i < dd.indexFrom; i++) {
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
dd.getPosition = function (x, y) {
    for (let i = 0; i < dd.coordinates.length; i++) {
        if ((x >= dd.coordinates[i].x && x <= dd.coordinates[i].right) && (y >= dd.coordinates[i].y && y <= dd.coordinates[i].bottom)) {
            return i;
        }
    }
}

dd.removeUpDownFromFills = function () {
    for (let i = 0; i < dd.fills.length; i++) {
        dd.fills[i].classList.remove("up", "down");
    }
}

dd.touchStart = function (event) {
    dd.indexFrom = dd.getPosition(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
    dd.lastPosition = parseInt(this.parentElement.getAttribute("data-position"));
    dd.initialX = event.targetTouches[0].pageX;
    dd.initialY = event.targetTouches[0].pageY;
    this.style.zIndex = 100;
    console.log(dd.initialX, dd.initialY);
};

dd.touchMove = function (event) {
    event.cancelable ? event.preventDefault() : "";
    window.requestAnimationFrame(() => {
        this.style.transform = `translate(${event.targetTouches[0].pageX - dd.initialX}px, ${event.targetTouches[0].pageY - dd.initialY}px)`;
        dd.indexTo = dd.getPosition(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
        if (typeof dd.indexFrom === "number" && typeof dd.indexTo === "number") {
            if (!dd.gotIn) {
                dd.lastPos = dd.indexTo;
                dd.empties[dd.indexTo].classList.add("hovered");
                dd.adjustTop(dd.indexFrom < dd.indexTo ? "up" : "down");
                dd.gotIn = true;
            }
        }
        else {
            if (dd.gotIn) {
                dd.empties[dd.lastPos].classList.remove("hovered");
                dd.removeUpDownFromFills();
                dd.gotIn = false;
            }
        }
    });
};

dd.touchEnd = function () {
    this.removeAttribute("style");
    dd.removeUpDownFromFills();
    if (typeof dd.indexTo === "number") {
        dd.empties[dd.indexTo].classList.remove("hovered");
        dd.appendAll(dd.indexTo);
        dd.empties[dd.indexTo].append(this);
        dd.currentSpot = dd.indexTo;
    }
    console.log("end fired");
    setTimeout(() => {
        dd.setOrder(this);
    }, 100);
};

dd.initTouch = function () {
    dd.coordinates = [];
    dd.lastPosition = 0;
    dd.initialLocation;
    dd.currentSpot;
    dd.gotIn;
    dd.lastPos;

    for (let i = 0; i < dd.empties.length; i++) {
        dd.coordinates.push(dd.empties[i].getBoundingClientRect());
    }
    for (let i = 0; i < dd.fills.length; i++) {
        dd.fills[i].addEventListener("touchstart", dd.touchStart);
        dd.fills[i].addEventListener("touchmove", dd.touchMove, {passive: false});
        dd.fills[i].addEventListener("touchend", dd.touchEnd);
    }
};

window.onorientationchange = () => {
    dd.setOrder();
};

dd.initTouch();