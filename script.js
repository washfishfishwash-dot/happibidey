const slides = document.querySelectorAll(".slide");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const loadingScreen = document.getElementById("loadingScreen");
const loadingGif = document.getElementById("loadingGif");
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

function playClick() {
  clickSound.currentTime = 0;
  clickSound.play().catch(function(error) {
    console.log("Click sound could not play:", error);
  });
}

function showPage() {
  slides.forEach(function(slide) {
    slide.classList.remove("active");
  });

  slides[currentPage].classList.add("active");
  backBtn.hidden = currentPage === 0;
  nextBtn.hidden =
    currentPage === sufferPage ||
    currentPage === videoPage;
}

function openVideoPage() {
  if (currentPage === videoPage) return;

  playClick();
  currentPage = videoPage;
  showPage();

  endingVideo.play().catch(function(error) {
    console.log("Press Play to start the video:", error);
  });
}

sufferImage.addEventListener("click", openVideoPage);

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

backBtn.addEventListener("click", backPage);
nextBtn.addEventListener("click", nextPage);

backBtn.addEventListener("keydown", function(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    backPage();
  }
});

nextBtn.addEventListener("keydown", function(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    nextPage();
  }
});

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

secretButtons.forEach(function(button) {
  button.addEventListener("click", function(event) {
    event.stopPropagation();
    playClick();
    openPhoto(button);
  });
});

function closePhoto() {
  photoPopup.hidden = true;
  photoPopup.setAttribute("aria-hidden", "true");
  secretPhoto.removeAttribute("src");
}

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

const loadingDuration = 4000;
let loadingStarted = false;

function startLoading() {
  if (loadingStarted) return;

  loadingStarted = true;

  setTimeout(function() {
    loadingScreen.style.display = "none";
    showPage();
  }, loadingDuration);
}

loadingGif.addEventListener("load", startLoading);

if (loadingGif.complete && loadingGif.naturalWidth > 0) {
  startLoading();
}

loadingGif.addEventListener("error", function() {
  loadingScreen.style.display = "none";
  showPage();
});

showPage();
