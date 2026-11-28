
const home = document.getElementById("home");
const photoViewer = document.getElementById("photo-viewer");
const openCameraButton = document.getElementById("open-camera");
const closePhotosButton = document.getElementById("close-camera");
const photoStrip = document.getElementById("photo-strip");
const photoItems = document.querySelectorAll(".photo-item");

const clock = document.getElementById("clock");
const timezone = document.getElementById("timezone");

function updateClock() {
  const now = new Date();
  const timeZone = "America/Los_Angeles";

  clock.textContent = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(now);

  timezone.textContent = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short"
  }).formatToParts(now).find(part => part.type === "timeZoneName").value;
}

function openPhotos() {
  home.classList.add("hidden");
  photoViewer.classList.add("open");
  photoViewer.setAttribute("aria-hidden", "false");
}

function closePhotos() {
  home.classList.remove("hidden");
  photoViewer.classList.remove("open");
  photoViewer.setAttribute("aria-hidden", "true");

  photoItems.forEach((photo) => {
    photo.classList.remove("expanded");
  });

  photoStrip.classList.remove("has-expanded");
}

function scrollToPhoto(photo) {
  const isMobile = window.matchMedia("(max-width: 700px)").matches;

  photo.scrollIntoView({
    behavior: "smooth",
    block: isMobile ? "center" : "nearest",
    inline: isMobile ? "nearest" : "center"
  });
}

function expandPhoto(photo) {
  const wasExpanded = photo.classList.contains("expanded");

  photoItems.forEach((item) => {
    item.classList.remove("expanded");
  });

  if (!wasExpanded) {
    photo.classList.add("expanded");
    photoStrip.classList.add("has-expanded");
    scrollToPhoto(photo);
  } else {
    photoStrip.classList.remove("has-expanded");
  }
}

function navigatePhotos(direction) {
  const current = document.querySelector(".photo-item.expanded");

  if (!current) return;

  const currentIndex = Number(current.dataset.index);
  const nextIndex = (
    currentIndex + direction + photoItems.length
  ) % photoItems.length;

  photoItems.forEach((item) => {
    item.classList.remove("expanded");
  });

  const nextPhoto = photoItems[nextIndex];

  nextPhoto.classList.add("expanded");
  scrollToPhoto(nextPhoto);
}

updateClock();
setInterval(updateClock, 1000);

openCameraButton.addEventListener("click", openPhotos);
closePhotosButton.addEventListener("click", closePhotos);

photoItems.forEach((photo) => {
  photo.addEventListener("click", () => {
    expandPhoto(photo);
  });
});

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

document.addEventListener("dragstart", (event) => {
  if (event.target.tagName === "IMG") {
    event.preventDefault();
  }
});

document.addEventListener("keydown", (event) => {
  const photoIsOpen = photoViewer.classList.contains("open");

  if (!photoIsOpen) return;

  if (event.key === "Escape") {
    closePhotos();
    return;
  }

  const isMobile = window.matchMedia("(max-width: 700px)").matches;

  if (isMobile) {
    if (event.key === "ArrowDown") {
      navigatePhotos(1);
    }

    if (event.key === "ArrowUp") {
      navigatePhotos(-1);
    }
  } else {
    if (event.key === "ArrowRight") {
      navigatePhotos(1);
    }

    if (event.key === "ArrowLeft") {
      navigatePhotos(-1);
    }
  }
});
