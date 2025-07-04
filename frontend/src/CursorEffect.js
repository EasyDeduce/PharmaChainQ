document.addEventListener("DOMContentLoaded", () => {
  const cursorTrail = document.createElement("div");
  cursorTrail.style.position = "fixed";
  cursorTrail.style.width = "8px";
  cursorTrail.style.height = "80px";
  cursorTrail.style.background = "linear-gradient(to bottom, red, purple)";
  cursorTrail.style.transformOrigin = "top center";
  cursorTrail.style.pointerEvents = "none";
  cursorTrail.style.transition = "transform 0.1s, top 0.05s, left 0.05s";
  cursorTrail.style.zIndex = "9999";
  document.body.appendChild(cursorTrail);

  document.addEventListener("mousemove", (e) => {
    const angle = Math.atan2(e.movementY, e.movementX) * 180 / Math.PI;
    cursorTrail.style.left = `${e.clientX}px`;
    cursorTrail.style.top = `${e.clientY}px`;
    cursorTrail.style.transform = `rotate(${angle}deg)`;
  });
});

