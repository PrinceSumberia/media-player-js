import * as id3 from "//unpkg.com/id3js@^2/lib/id3.js";

const songTitle = document.querySelector(".header__title");
const songSubTitle = document.querySelector(".header__subtitle");
const previousButton = document.querySelector(".btn--previous");
const playButton = document.querySelector(".btn--play");
const nextButton = document.querySelector(".btn--next");
const song = document.querySelector("#song");
const playIcon = document.querySelector(".play");
const progressBar = document.querySelector(".progress__bar");
const artImg = document.querySelector(".art__img");
const range = document.querySelector(".range");
const drop = document.querySelector(".drop");

let title, artist, image;
const songs = [
  "./assets/music/Toosie Slide.mp3",
  "./assets/music/Believer.mp3",
  "./assets/music/Closer.mp3",
  "./assets/music/DaBaby.mp3",
  "/assets/music/Good Life.mp3",
  "./assets/music/Issues.mp3",
];

const getMetaData = async (url) => {
  return await id3.fromUrl(url);
};

const loadData = (songIndex) => {
  const result = getMetaData(songs[Number(songIndex)]);
  artImg.src = "images/cover.jpg";
  result.then((metaData) => {
    title = metaData.title;
    artist = metaData.artist;
    const newTitle = title.slice(0, title.search(/-|\(/));
    const newArtist = artist.slice(0, artist.search(/\(/));
    songTitle.innerText = newTitle;
    songSubTitle.innerText = newArtist;
    let imageUrl;
    try {
      image = metaData.images[0].data;
      let arrayBufferView = new Uint8Array(image);
      let blob = new Blob([arrayBufferView], { type: "image/jpeg" });
      let urlCreator = window.URL || window.webkitURL;
      imageUrl = urlCreator.createObjectURL(blob);
      artImg.setAttribute("src", imageUrl);
    } catch (e) {}
  });
};

const playSong = () => {
  loadData(currentSongIndex);
  if (isPaused) {
    song.play();
    playIcon.classList.add("fa-pause");
    playIcon.classList.remove("fa-play");
    isPaused = false;
  } else {
    song.pause();
    playIcon.classList.remove("fa-pause");
    playIcon.classList.add("fa-play");
    isPaused = true;
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
  song.src = nextSong;
  isPaused = !isPaused;
  playSong();
  artImg.classList.toggle("art__img--animate");
};

const updateProgressBar = () => {
  progressBar.max = song.duration;
  progressBar.value = song.currentTime;
  let width = (progressBar.value / progressBar.max) * 100;
  range.style.width = `${width}%`;
};

song.src = songs[0];
let isPaused = true;
let currentSongIndex = 0;
loadData(0);

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
