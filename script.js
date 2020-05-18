const previousButton = document.querySelector(".btn--previous");
const playButton = document.querySelector(".btn--play");
const nextButton = document.querySelector(".btn--next");
const song = document.querySelector("#song");
const playIcon = document.querySelector(".play");
const progressBar = document.querySelector(".progress__bar");
const artImg = document.querySelector(".art__img");
const range = document.querySelector(".range");

const songs = [
  "./assets/music/Believer.mp3",
  "./assets/music/Closer.mp3",
  "/assets/music/Good Life.mp3",
  "./assets/music/Issues.mp3",
];

let playing = false;
let currentSongIndex = 0;

const playSong = () => {
  if (!playing) {
    song.play();
    playIcon.classList.add("fa-pause");
    playIcon.classList.remove("fa-play");
    playing = true;
  } else {
    song.pause();
    playIcon.classList.remove("fa-pause");
    playIcon.classList.add("fa-play");
    playing = false;
  }
};

const changeSong = (action) => {
  let nextSong;
  if (action === "next") {
    nextSong =
      currentSongIndex === songs.length - 1
        ? songs[0]
        : songs[currentSongIndex + 1];
    currentSongIndex = songs.indexOf(nextSong);
  } else if (action === "prev") {
    nextSong = currentSongIndex === 0 ? songs[0] : songs[currentSongIndex - 1];
    currentSongIndex = songs.indexOf(nextSong);
  }
  playing = false;
  song.src = nextSong;
  playSong();
};

const updateProgressBar = () => {
  progressBar.max = song.duration;
  progressBar.value = song.currentTime;
  let width = (progressBar.value / progressBar.max) * 100;
  range.style.width = `${width}%`;
};

song.addEventListener("ended", () => changeSong("next"));

playButton.addEventListener("click", () => {
  playSong("playBtn");
  // progressBar.classList.toggle("progress__bar--show");
  artImg.classList.toggle("art__img--animate");
});

nextButton.addEventListener("click", () => changeSong("next"));

previousButton.addEventListener("click", () => changeSong("prev"));

progressBar.addEventListener("change", () => {
  song.currentTime = progressBar.value;
});

setInterval(updateProgressBar, 500);
