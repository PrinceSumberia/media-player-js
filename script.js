const previousButton = document.querySelector(".btn--previous");
const playButton = document.querySelector(".btn--play");
const nextButton = document.querySelector(".btn--next");
const song = document.querySelector("#song");
const playIcon = document.querySelector(".play");
const progressBar = document.querySelector(".progress__bar");
const artImg = document.querySelector(".art__img");
const range = document.querySelector(".range");
const drop = document.querySelector(".drop");

import * as id3 from "//unpkg.com/id3js@^2/lib/id3.js";

// let title,
const getMetaData = (url) => {
  id3.fromUrl(url).then((tags) => {
    console.log(tags);
  });
};

const songs = [
  "./assets/music/DaBaby.mp3",
  "./assets/music/Believer.mp3",
  "./assets/music/Toosie Slide.mp3",
  "./assets/music/Closer.mp3",
  "/assets/music/Good Life.mp3",
  "./assets/music/Issues.mp3",
];

song.src = songs[0];

// album: "Best of April 2020"
// artist: "Drake"
// comments: "www.SongsLover.com"
// composer: "Aubrey Graham & O. Yildirim"
// conductor: "www.SongsLover.com"
// content-group: "www.SongsLover.com"
// copyright: "www.SongsLover.com"
// encoder: "www.SongsLover.com"
// frames: (25) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// images: [{…}]
// kind: "v2"
// original-album: "www.SongsLover.com"
// original-artist: "www.SongsLover.com"
// original-writer: "www.SongsLover.com"
// publisher: "www.SongsLover.com"
// radio-name: "www.SongsLover.com"
// release-time: "www.SongsLover.com"
// remixer: "www.SongsLover.com"
// subtitle: "www.SongsLover.com"
// title: "Toosie Slide - SongsLover.com"
// track: "1/20"
// url-artist: "www.SongsLover.com"
// url-commercial: "www.SongsLover.com"
// url-file: "www.SongsLover.com"
// url-radio: "www.SongsLover.com"
// url-source: "www.SongsLover.com"
// version: (2) [3, 0]
// writer: "www.SongsLover.com"
// year: "2020"

let playing = false;
let currentSongIndex = 0;

const playSong = () => {
  getMetaData(songs[currentSongIndex]);
  artImg.classList.toggle("art__img--animate");
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
  playSong();
  progressBar.classList.toggle("progress__bar--show");
  drop.classList.toggle("drop--show");
  range.classList.toggle("range--show");
  setTimeout(() => {
    drop.classList.toggle("drop--hide");
  }, 900);
});

nextButton.addEventListener("click", () => changeSong("next"));

previousButton.addEventListener("click", () => changeSong("prev"));

progressBar.addEventListener("change", () => {
  song.currentTime = progressBar.value;
});

setInterval(updateProgressBar, 500);
