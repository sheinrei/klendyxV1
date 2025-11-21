let isDragging = false;
let offsetX = 0;
let offsetY = 0;


function onMouseMove(e) {
    if (!isDragging) return;
    const modal = $(".event-modale")[0];
    modal.style.left = e.clientX - offsetX + "px";
    modal.style.top = e.clientY - offsetY + "px";
}

function onMouseUp() {
    isDragging = false;
    $(document).off("mousemove", onMouseMove);
    $(document).off("mouseup", onMouseUp);
}

$(document).on("mousedown", ".event-modale", function (e) {
    const modal = this;
    isDragging = true;
    offsetX = e.clientX - modal.offsetLeft;
    offsetY = e.clientY - modal.offsetTop;

    $(document).on("mousemove", onMouseMove);
    $(document).on("mouseup", onMouseUp);
});