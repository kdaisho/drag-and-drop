const dd = {};

dd.setOrder = element => {
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
    setTimeout(() => dd.pushTags(dd.indexFrom < dd.indexTo), 0);
};

dd.dragLeave = function () {
    this.classList.remove("hovered");
    for (let i = 0; i < dd.fills.length; i++) {
        dd.fills[i].classList.remove("up", "down");
    }
};

dd.dragDrop = function () {
    this.classList.remove("hovered");
    dd.removeUpDownFromFills();
    dd.dropTags(parseInt(this.getAttribute("data-position")));
    this.append(dd.grabbed);
    setTimeout(() => dd.setOrder(), 0);
};

dd.dropTags = indexTo => {
    dd.indexFrom < indexTo ? appendTags(dd.indexFrom + 1, indexTo, -1) : appendTags(indexTo, dd.indexFrom - 1, 1);

    function appendTags (initialIndex, endIndex, offset) {
        for (let i = initialIndex; i <= endIndex; i++) {
            dd.empties[i + offset].append(dd.fills[i]);
        }
    }
};

dd.pushTags = downwards => {
    downwards ? addClassName("up", dd.indexFrom + 1, dd.indexTo) : addClassName("down", dd.indexTo, dd.indexFrom - 1);

    function addClassName (className, initialIndex, endIndex) {
        for (let i = initialIndex; i <= endIndex; i++) {
            dd.fills[i].classList.add(className);
        }
    }
}

dd.init = () => {
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
dd.getPosition = (x, y) => {
    for (let i = 0; i < dd.coordinates.length; i++) {
        if ((x >= dd.coordinates[i].x && x <= dd.coordinates[i].right) && (y >= dd.coordinates[i].y && y <= dd.coordinates[i].bottom)) {
            return i;
        }
    }
}

dd.removeUpDownFromFills = () => {
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
                dd.pushTags(dd.indexFrom < dd.indexTo);
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
        dd.dropTags(dd.indexTo);
        dd.empties[dd.indexTo].append(this);
        dd.currentSpot = dd.indexTo;
    }
    setTimeout(() => {
        dd.setOrder(this);
    }, 100);
};

dd.initTouch = () => {
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