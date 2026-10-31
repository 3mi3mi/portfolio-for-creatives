const images = [
  "./assets/project-1/guruguru.png",
  "./assets/project-1/pompom.png",
  "./assets/project-1/skully.png",
  "./assets/project-1/eyebow.png",
  "./assets/project-1/webstickers.png",
];

let lastUsedIndex = -1;
function getRandomIndex() {
  let index;
  do {
    index = Math.floor(Math.random() * images.length);
  } while (index === lastUsedIndex);
  lastUsedIndex = index;
  return index;
}

function placeImage(x, y) {
  const img = document.createElement("img");
  img.src = images[getRandomIndex()];
  img.classList.add("trail-img");
  img.style.left = x + "px";
  img.style.top = y + "px";
  document.body.appendChild(img);
}

const isMobile = () =>
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

// ─── Desktop: cursor trail ───────────────────────────────
let lastX = null;
let lastY = null;
const spacing = 50;

document.addEventListener("mousemove", (e) => {
  if (isMobile()) return;
  const x = e.clientX;
  const y = e.clientY;
  if (lastX === null) {
    lastX = x;
    lastY = y;
    placeImage(x, y);
    return;
  }
  const dx = x - lastX;
  const dy = y - lastY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist >= spacing) {
    placeImage(x, y);
    lastX = x;
    lastY = y;
  }
});

// ─── Mobile: random placement ────────────────────────────
function spawnRandom() {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  placeImage(x, y);
}

if (isMobile()) {
  for (let i = 0; i < 8; i++) {
    setTimeout(spawnRandom, i * 200);
  }
  setInterval(spawnRandom, 800);
}

document.addEventListener("click", () => {
  document.querySelectorAll(".trail-img").forEach((img) => img.remove());
});
