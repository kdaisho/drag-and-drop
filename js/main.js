const dd = {};

dd.setOrder = () => {
    dd.lastPosition && dd.spots[dd.lastPosition].classList.remove("hovered");
    dd.tags = document.querySelectorAll(".tag");
};

dd.dragStart = function () {
    dd.currentTag = this;
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
    for (let i = 0; i < dd.tags.length; i++) {
        dd.tags[i].classList.remove("up", "down");
    }
};

dd.dragDrop = function () {
    this.classList.remove("hovered");
    dd.removeUpDownFromTags();
    dd.dropTags(parseInt(this.getAttribute("data-position")));
    this.append(dd.currentTag);
    setTimeout(() => dd.setOrder(), 0);
};

dd.dropTags = indexTo => {
    dd.indexFrom < indexTo ? appendTags(dd.indexFrom + 1, indexTo, -1) : appendTags(indexTo, dd.indexFrom - 1, 1);

    function appendTags (initialIndex, endIndex, offset) {
        for (let i = initialIndex; i <= endIndex; i++) {
            dd.spots[i + offset].append(dd.tags[i]);
        }
    }
};

dd.pushTags = downwards => {
    downwards ? addClassName("up", dd.indexFrom + 1, dd.indexTo) : addClassName("down", dd.indexTo, dd.indexFrom - 1);

    function addClassName (className, initialIndex, endIndex) {
        for (let i = initialIndex; i <= endIndex; i++) {
            dd.tags[i].classList.add(className);
        }
    }
}

dd.init = () => {
    dd.spots = document.getElementsByClassName("spot");
    dd.tags = "";
    dd.currentTag = "";
    dd.indexFrom = "";
    dd.indexTo = "";
    dd.setOrder();
    for (let i = 0; i < dd.tags.length; i++) {
        dd.tags[i].addEventListener('dragstart', dd.dragStart);
        dd.tags[i].addEventListener('dragend', dd.dragEnd);
    }
    for (let i = 0; i < dd.spots.length; i++) {
        dd.spots[i].addEventListener('dragover', dd.dragOver);
        dd.spots[i].addEventListener('dragenter', dd.dragEnter);
        dd.spots[i].addEventListener('dragleave', dd.dragLeave);
        dd.spots[i].addEventListener('drop', dd.dragDrop);
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

dd.removeUpDownFromTags = () => {
    for (let i = 0; i < dd.tags.length; i++) {
        dd.tags[i].classList.remove("up", "down");
    }
}

dd.touchStart = function (event) {
    dd.indexFrom = dd.getPosition(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
    dd.lastPosition = parseInt(this.parentElement.getAttribute("data-position"));
    dd.initialX = event.targetTouches[0].pageX;
    dd.initialY = event.targetTouches[0].pageY;
};

dd.touchMove = function (event) {
    if (event.cancelable) event.preventDefault();
    if (!dd.hasMoved) {
        dd.hasMoved = true;
        this.style.zIndex = 100;
    }
    this.style.transform = `translate(${event.targetTouches[0].pageX - dd.initialX}px, ${event.targetTouches[0].pageY - dd.initialY}px)`;
    dd.indexTo = dd.getPosition(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
    if (typeof dd.indexFrom === "number" && typeof dd.indexTo === "number") {
        dd.lastSpot = dd.indexTo;
        dd.spots[dd.indexTo].classList.add("hovered");
        dd.pushTags(dd.indexFrom < dd.indexTo);
        dd.wasInside = true;
    }
    else if (dd.wasInside) {
        dd.spots[dd.lastSpot].classList.remove("hovered");
        dd.removeUpDownFromTags();
        dd.wasInside = false;
    }
};

dd.touchEnd = function () {
    if (!dd.hasMoved) return false;
    dd.removeUpDownFromTags();
    if (typeof dd.indexTo === "number") {
        dd.spots[dd.indexTo] && dd.spots[dd.indexTo].classList.remove("hovered");
        dd.dropTags(dd.indexTo);
        dd.spots[dd.indexTo].append(this);
        dd.hasMoved = false;
    }
    requestAnimationFrame(() => {
        this.removeAttribute("style");
        dd.setOrder();
    });
};

dd.initTouch = () => {
    dd.coordinates = [];
    dd.lastPosition = 0;
    dd.wasInside = false;
    dd.lastSpot = "";
    dd.hasMoved = false;

    for (let i = 0; i < dd.spots.length; i++) {
        dd.coordinates.push(dd.spots[i].getBoundingClientRect());
    }
    for (let i = 0; i < dd.tags.length; i++) {
        dd.tags[i].addEventListener("touchstart", dd.touchStart);
        dd.tags[i].addEventListener("touchmove", dd.touchMove, {passive: false});
        dd.tags[i].addEventListener("touchend", dd.touchEnd);
    }
};

window.onorientationchange = () => {
    dd.setOrder();
};

dd.initTouch();