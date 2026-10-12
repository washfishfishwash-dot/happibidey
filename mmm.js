const slides = document.querySelectorAll(".slide");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const loadingScreen = document.getElementById("loadingScreen");
const clickSound = document.getElementById("clickSound");
const sufferImage = document.getElementById("sufferImage");
const endingVideo = document.getElementById("endingVideo");
const secretButtons = document.querySelectorAll(".secret");
const photoPopup = document.getElementById("photoPopup");
const secretPhoto = document.getElementById("secretPhoto");
const photoCaption = document.getElementById("photoCaption");
const closePopup = document.getElementById("closePopup");

let currentPage = 0;
const sufferPage = slides.length - 2;
const videoPage = slides.length - 1;
let loadingFinished = false;

function playClick() {
  if (!clickSound) return;

  clickSound.currentTime = 0;

  const soundPromise = clickSound.play();

  if (soundPromise) {
    soundPromise.catch(function() {});
  }
}

function showPage() {
  slides.forEach(function(slide, index) {
    slide.classList.toggle("active", index === currentPage);
  });

  backBtn.hidden = currentPage === 0;
  nextBtn.hidden =
    currentPage === sufferPage ||
    currentPage === videoPage;
}

function finishLoading() {
  if (loadingFinished) return;

  loadingFinished = true;
  loadingScreen.style.display = "none";
  showPage();
}

function openVideoPage() {
  if (currentPage === videoPage) return;

  playClick();
  currentPage = videoPage;
  showPage();

  const videoPromise = endingVideo.play();

  if (videoPromise) {
    videoPromise.catch(function() {});
  }
}

function nextPage() {
  if (currentPage >= videoPage) return;

  if (currentPage === sufferPage) {
    openVideoPage();
    return;
  }

  playClick();
  currentPage++;
  showPage();
}

function backPage() {
  if (currentPage <= 0) return;

  playClick();

  if (currentPage === videoPage) {
    endingVideo.pause();
    endingVideo.currentTime = 0;
  }

  currentPage--;
  showPage();
}

function openPhoto(button) {
  const photoFile = button.dataset.photo;
  const caption = button.dataset.caption || "";

  secretPhoto.src = photoFile;
  secretPhoto.alt = caption || "A hidden memory";
  photoCaption.textContent = caption;

  photoPopup.hidden = false;
  photoPopup.setAttribute("aria-hidden", "false");
  closePopup.focus();
}

function closePhoto() {
  photoPopup.hidden = true;
  photoPopup.setAttribute("aria-hidden", "true");
  secretPhoto.removeAttribute("src");
}

backBtn.addEventListener("click", backPage);
nextBtn.addEventListener("click", nextPage);
sufferImage.addEventListener("click", openVideoPage);

[backBtn, nextBtn].forEach(function(button) {
  button.addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (button === backBtn) {
        backPage();
      } else {
        nextPage();
      }
    }
  });
});

secretButtons.forEach(function(button) {
  button.addEventListener("click", function(event) {
    event.stopPropagation();
    playClick();
    openPhoto(button);
  });
});

closePopup.addEventListener("click", function() {
  playClick();
  closePhoto();
});

photoPopup.addEventListener("click", function(event) {
  if (event.target === photoPopup) {
    closePhoto();
  }
});

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && !photoPopup.hidden) {
    closePhoto();
  }
});

window.addEventListener("error", function(event) {
  console.error("Website error:", event.message);
});

showPage();

window.setTimeout(finishLoading, 4000);
