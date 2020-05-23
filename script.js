import * as id3 from "//unpkg.com/id3js@^2/lib/id3.js";

const body = document.getElementsByTagName("body")[0];
const player = document.querySelector(".player");
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
const audioFile = document.querySelector(".audio_files");
const fileList = document.querySelector(".filelist");
const fileItem = document.querySelector(".filelist__item");

let songs = [];
let isPaused = true;
let currentSongIndex = 0;

const getMetaData = async (file) => {
  return await id3.fromFile(file);
};

const getSongImage = (arrayBuffer) => {
  let arrayBufferView = new Uint8Array(arrayBuffer);
  let blob = new Blob([arrayBufferView], { type: "image/jpeg" });
  let urlCreator = window.URL || window.webkitURL;
  return urlCreator.createObjectURL(blob);
};

const playSong = () => {
  if (isPaused) {
    song.play();
    progressBar.classList.add("progress__bar--show");
    playIcon.classList.add("fa-pause");
    artImg.classList.add("art__img--animate");
    drop.classList.add("drop--show");
    playIcon.classList.remove("fa-play");
    progressBar.addEventListener("transitionend", () => {
      range.classList.add("range--show");
    });
    artImg.addEventListener("animationend", () => {
      artImg.classList.remove("art__img--animate");
    });
    drop.addEventListener("transitionend", () => {
      drop.classList.remove("drop--show");
    });
    isPaused = false;
  } else {
    song.pause();
    isPaused = true;
    playIcon.classList.add("fa-play");
    progressBar.classList.remove("progress__bar--show");
    playIcon.classList.remove("fa-pause");
    range.classList.remove("range--show");
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
  isPaused = !isPaused;
  song.src = nextSong.url;
  artImg.setAttribute("src", nextSong.imageSrc);
  songTitle.innerText = nextSong.title;
  songSubTitle.innerText = nextSong.artist;
  playSong();
  artImg.classList.add("art__img--animate");
  artImg.addEventListener("animationend", () => {
    artImg.classList.remove("art__img--animate");
  });
};

const updateProgressBar = () => {
  progressBar.max = song.duration;
  progressBar.value = song.currentTime;
  let width = (progressBar.value / progressBar.max) * 100;
  range.style.width = `${width}%`;
};

const changeStyles = (songIndex) => {
  if (songIndex % 2 === 0) {
    body.style.backgroundImage = `var(--gradient-pink)`;
    player.style.boxShadow = `var(--box-shadow-pink)`;
  } else {
    body.style.backgroundImage = `var(--gradient-blue)`;
    player.style.boxShadow = `var(--box-shadow-blue)`;
  }
};

const startPlaying = () => {
  let currentSong = songs[currentSongIndex];
  song.src = currentSong.url;
  artImg.setAttribute("src", currentSong.imageSrc);
  songTitle.innerText = currentSong.title;
  songSubTitle.innerText = currentSong.artist;
  playSong();
};

//================== Event Listeners =============================
audioFile.addEventListener("change", (e) => {
  let files = e.target.files;
  const initialSongsLength = songs.length;
  for (const file of files) {
    const result = getMetaData(file);
    result
      .then((data) => {
        console.log(getSongImage(data.images[0].data));
        let title = data.title
          .slice(0, data.title.search(/ft|FT|fT|Ft|-|\(/))
          .trim()
          .toLowerCase();
        let artist =
          data.artist.search(/\(/) === -1
            ? data.artist
            : data.artist.slice(0, data.artist.search(/\(/)).trim();
        songs.push({
          title,
          artist,
          url: URL.createObjectURL(file),
          imageSrc: getSongImage(data.images[0].data),
        });
        currentSongIndex = songs.length - 1;
        fileList.insertAdjacentHTML(
          "beforeend",
          `<li class="filelist__item" id=${songs.length - 1}>${title}</li>`
        );
      })
      .then(() => {
        if (initialSongsLength + Object.keys(files).length === songs.length) {
          isPaused = true;
          startPlaying();
        }
      });
  }
});

song.addEventListener("ended", () => changeSong("next"));

playButton.addEventListener("click", () => {
  startPlaying();
});

nextButton.addEventListener("click", () => {
  changeStyles(Number(currentSongIndex));
  changeSong("next");
});

previousButton.addEventListener("click", () => {
  changeStyles(Number(currentSongIndex));
  changeSong("prev");
});

progressBar.addEventListener("change", () => {
  song.currentTime = progressBar.value;
});

fileList.addEventListener("click", (e) => {
  currentSongIndex = Number(e.target.id);
  isPaused = true;
  startPlaying();
});

setInterval(updateProgressBar, 500);
