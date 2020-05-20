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

let title, artist, image;
let songs = [
  // "./assets/music/Believer.mp3",
  // "./assets/music/Toosie Slide.mp3",
  // "./assets/music/Closer.mp3",
  "./assets/music/DaBaby.mp3",
  // "./assets/music/Issues.mp3",
];

const getMetaData2 = async (file) => {
  return await id3.fromUrl(file);
};

const getMetaData = async (file) => {
  return await id3.fromFile(file);
};

const getSongImage = (arrayBuffer) => {
  let arrayBufferView = new Uint8Array(arrayBuffer);
  let blob = new Blob([arrayBufferView], { type: "image/jpeg" });
  let urlCreator = window.URL || window.webkitURL;
  return urlCreator.createObjectURL(blob);
};

const loadData = (songIndex) => {
  const result = getMetaData2(songs[Number(songIndex)]);
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
  // loadData(currentSongIndex);
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

song.src = songs[0];
let isPaused = true;
let currentSongIndex = 0;
loadData(0);

audioFile.addEventListener("change", (e) => {
  let files = e.target.files;
  for (const file of files) {
    const result = getMetaData(file);
    result.then((data) => {
      songs.push({
        title: data.title.slice(0, data.title.search(/-|\(/)).trim(),
        artist:
          data.artist.search(/\(/) === -1
            ? data.artist
            : data.artist.slice(0, data.artist.search(/\(/)).trim(),
        url: URL.createObjectURL(file),
        image: data.images[0].data,
        imageSrc: getSongImage(data.images[0].data),
      });
    });
  }
});

song.addEventListener("ended", () => changeSong("next"));

playButton.addEventListener("click", () => {
  playSong();
  progressBar.classList.toggle("progress__bar--show");
  progressBar.addEventListener("transitionend", () => {
    range.classList.toggle("range--show");
  });

  if (progressBar.classList.contains("progress__bar--show") === false) {
    range.classList.remove("range--show");
  }

  if (!isPaused) {
    artImg.classList.add("art__img--animate");
    drop.classList.add("drop--show");

    artImg.addEventListener("animationend", () => {
      artImg.classList.remove("art__img--animate");
    });
    drop.addEventListener("transitionend", () => {
      drop.classList.remove("drop--show");
    });
  }
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

setInterval(updateProgressBar, 500);
