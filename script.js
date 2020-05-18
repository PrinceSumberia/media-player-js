const previousButton = document.querySelector(".btn--previous");
const playButton = document.querySelector(".btn--play");
const nextButton = document.querySelector(".btn--next");

const song = document.querySelector("#song"); // audio object
let playing = false;
playButton.addEventListener("click", (e) => {
  e.target.classList.toggle("fa-play");
  e.target.classList.toggle("fa-pause");

  if (!playing) {
    song.play();
    playing = true;
  } else {
    song.pause();
    playing = false;
  }
});
