const home = document.getElementById("home");
const photoViewer = document.getElementById("photo-viewer");
const openCameraButton = document.getElementById("open-camera");
const closePhotosButton = document.getElementById("close-camera");
const photoStrip = document.getElementById("photo-strip");
const photoItems = document.querySelectorAll(".photo-item");

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

openCameraButton.addEventListener("click", openPhotos);
closePhotosButton.addEventListener("click", closePhotos);

photoItems.forEach((photo) => {
  photo.addEventListener("click", () => {
    const wasExpanded = photo.classList.contains("expanded");

    photoItems.forEach((item) => {
      item.classList.remove("expanded");
    });

    if (!wasExpanded) {
      photo.classList.add("expanded");
      photoStrip.classList.add("has-expanded");

      photo.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    } else {
      photoStrip.classList.remove("has-expanded");
    }
  });
});

document.addEventListener("keydown", (event) => {
  const photoIsOpen = photoViewer.classList.contains("open");

  if (!photoIsOpen) return;

  if (event.key === "Escape") {
    closePhotos();
  }

  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    const current = document.querySelector(".photo-item.expanded");

    if (!current) return;

    const currentIndex = Number(current.dataset.index);

    const nextIndex = event.key === "ArrowRight"
      ? (currentIndex + 1) % photoItems.length
      : (currentIndex - 1 + photoItems.length) % photoItems.length;

    photoItems.forEach((item) => {
      item.classList.remove("expanded");
    });

    photoItems[nextIndex].classList.add("expanded");

    photoItems[nextIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  }
});