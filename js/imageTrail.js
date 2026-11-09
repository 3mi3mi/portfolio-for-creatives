// CUSTOMIZE THESE

const images = [
  "./assets/project-1/guruguru.png",
  "./assets/project-1/pompom.png",
  "./assets/project-1/skully.png",
  "./assets/project-1/eyebow.png",
  "./assets/project-1/webstickers.png",
  "./assets/project-1/ika.png",
  "./assets/project-1/skulltwin.png",
  "./assets/project-1/speaker.png",
];

const spacing = 60; // Distance between images on desktop
const maxImages = 200; // Maximum number of images on screen
const imageSize = 80; // Maximum image width and height in pixels

// IMAGE TRAIL CONSTRAINED TO HERO

const hero = document.querySelector(".hero");

if (hero) {
  // Preload images
  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  let lastUsedIndex = -1;
  let imageCount = 0;

  // Select a random image without consecutive repeats
  function getRandomIndex() {
    if (images.length < 2) return 0;

    let index;

    do {
      index = Math.floor(Math.random() * images.length);
    } while (index === lastUsedIndex);

    lastUsedIndex = index;
    return index;
  }

  // Create and place an image
  function placeImage(x, y) {
    const img = document.createElement("img");

    img.src = images[getRandomIndex()];
    img.alt = "";
    img.classList.add("trail-img");

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.maxWidth = `${imageSize}px`;
    img.style.maxHeight = `${imageSize}px`;

    hero.appendChild(img);

    imageCount++;

    // Remove oldest image when limit is reached
    if (imageCount > maxImages) {
      hero.querySelector(".trail-img").remove();
      imageCount--;
    }
  }

  // Detect touch-based devices
  const isMobile = () =>
    window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  // Desktop: cursor trail
  let lastX = null;
  let lastY = null;

  hero.addEventListener("mousemove", (e) => {
    if (isMobile()) return;

    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (lastX === null) {
      lastX = x;
      lastY = y;
      placeImage(x, y);
      return;
    }

    const dx = x - lastX;
    const dy = y - lastY;
    const dist = Math.hypot(dx, dy);

    if (dist >= spacing) {
      placeImage(x, y);
      lastX = x;
      lastY = y;
    }
  });

  // Reset cursor position when leaving hero
  hero.addEventListener("mouseleave", () => {
    lastX = null;
    lastY = null;
  });

  // Mobile: random placement
  function spawnRandom() {
    const x = Math.random() * hero.clientWidth;
    const y = Math.random() * hero.clientHeight;

    placeImage(x, y);
  }

  let mobileInterval = null;

  if (isMobile()) {
    for (let i = 0; i < 8; i++) {
      setTimeout(spawnRandom, i * 200);
    }

    mobileInterval = setInterval(spawnRandom, 800);
  }

  // Pause mobile spawning when page is hidden
  document.addEventListener("visibilitychange", () => {
    if (!isMobile()) return;

    if (document.hidden) {
      clearInterval(mobileInterval);
      mobileInterval = null;
    } else if (mobileInterval === null) {
      mobileInterval = setInterval(spawnRandom, 800);
    }
  });

  // Click: clear images
  hero.addEventListener("click", () => {
    hero.querySelectorAll(".trail-img").forEach((img) => img.remove());
    imageCount = 0;
  });
}
