console.log("Hello, this is javaScript");
let currentSong = new Audio();
const songs = [
  "/audios/aj-bazar-mein-pabajulaan.mp3",
  "/audios/aj-dil-k-qareen.mp3",
  "/audios/ap-ki-yad-aati-rahi.mp3",
  "/audios/aye-khuch-abrr.mp3",
  "/audios/dard-itna-tha.mp3",
  "/audios/dasht-e-tanhai-mein.mp3",
  "/audios/gar-mujhey-iska-yaqeen.mp3",
  "/audios/garmi-e-shoq-e-nazara.mp3",
  "/audios/gulon-mein-rang-bhary.mp3",
  "/audios/hijr-ki-raakh.mp3",
  "/audios/hum-jo-tareek-raahon-mein.mp3",
  "/audios/hum-ne-wo-sab.mp3",
  "/audios/hum-par-tumhari-chah-ka.mp3",
  "/audios/tum-aye-ho-na-shab-e-intazar.mp3",
];

let selectedSong = new Audio();

// async function getSongs() {
//   let a = await fetch("https://github.com/asimsaeed353/spotify-clone/tree/main/audios");
//   let response = await a.text();
//   let div = document.createElement("div");
//   div.innerHTML = response;
//   let as = div.getElementsByTagName("a");

//   let songs = [];
//   for (let index = 0; index < as.length; index++) {
//     const element = as[index];
//     if (element.href.endsWith(".mp3")) {
//       songs.push(element.href);
//     }
//   }
//   return songs;
// }

function playMusic(track) {
  // currentSong.src = './audios/' + track + '.mp3';
  selectedSong.src = "./audios/" + track + ".mp3";
  // currentSong.src = track;
  // currentSong.play();
  selectedSong.play();
  document.querySelector(
    ".play-pause"
  ).innerHTML = `<i id="pause" class="ri-pause-fill pointer"></i>`;
  document.querySelector(".song-player__song-name").innerHTML = decodeURI(
    track.replaceAll("-", " ")
  );
  // document.querySelector('.song-duration').innerHTML = '00:00/00:00';
}

async function main() {
  // // Get the list of the songs
  // songs = await getSongs();
  // playMusic(songs[0]);

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Pad the minutes and seconds with leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  // Adding content dynamically to the DOM
  // Listing all songs in the library
  let songUL = document
    .querySelector(".songs-list")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                    <div class="songs-list__left flex">
                  <i class="ri-music-fill"></i>
                  <div class="song-info">
                  <p class="song-name">${song
                    .replace("/audios/", "")
                    .replace(".mp3", "")
                    .replaceAll("-", " ")}</p>
                  <p class="artist-name">Faiz</p>
                </div>
                </div>
                <i class="ri-play-circle-line"></i>
              </li>`;
  }

  // Play song on clicking the song library
  Array.from(
    document.querySelector(".songs-list").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(
        e
          .querySelector(".song-info")
          .firstElementChild.innerHTML.replaceAll(" ", "-")
      );
      playMusic(
        e
          .querySelector(".song-info")
          .firstElementChild.innerHTML.replaceAll(" ", "-")
          .trim()
      );
    });
  });

  //Attach an event listener to play
  document.querySelector(".play-pause").addEventListener("click", () => {
    if (selectedSong.paused) {
      selectedSong.play();
      document.querySelector(
        ".play-pause"
      ).innerHTML = `<i id="pause" class="ri-pause-fill pointer"></i>`;
    } else {
      selectedSong.pause();
      document.querySelector(
        ".play-pause"
      ).innerHTML = `<i id="play" class="ri-play-fill pointer"></i>`;
    }
  });

  // Get time in minutes:seconds format mm:ss
  selectedSong.addEventListener("timeupdate", () => {
    console.log(
      formatTime(selectedSong.currentTime),
      formatTime(selectedSong.duration)
    );

    // Update Song timing / duration
    document.querySelector(".song-duration").innerHTML = `${formatTime(
      selectedSong.currentTime
    )}/${formatTime(selectedSong.duration)}`;

    // Move seekbar circle
    document.querySelector(".circle").style.left =
      (selectedSong.currentTime / selectedSong.duration) * 100 + "%";
    // Come back to original position when song is finished
    if ((selectedSong.currentTime / selectedSong.duration) * 100 > 99) {
      document.querySelector(".circle").style.left = 0 + "%";
      document.querySelector(
        ".play-pause"
      ).innerHTML = `<i id="play" class="ri-play-fill pointer"></i>`;
    }
  });

  // add an Event listener to seek bar
  document.querySelector(".seek-bar").addEventListener("click", (e) => {
    console.log(e.target.getBoundingClientRect().width, e.offsetX);
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    selectedSong.currentTime = (selectedSong.duration * percent) / 100;
  });

  // Responsive left show on hamburger touch
  document.querySelector(".hamburger-icon").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%";
    document.querySelector(".left").style.width = "50%";
  });

  // Add an event listener to the close icon to close the left part in smaller devices
  document.querySelector(".close-icon").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-110%";
  });

  // Add and event listener to the previous icon
  previous.addEventListener("click", () => {
    console.log("Previous is clicked.");
    let index = songs.indexOf(
      selectedSong.src.replace(
        "https://asimsaeed353.github.io/spotify-clone",
        ""
      )
    );

    console.log(
      "Previous is clicked so here is the index of song",
      selectedSong.src,
      selectedSong.src.replace(
        "https://asimsaeed353.github.io/spotify-clone",
        ""
      ),
      index
    );

    if (index - 1 >= 0) {
      playMusic(songs[index - 1].replace("/audios/", "").replace(".mp3", ""));
      previous.style.opacity = "1";
      next.style.opacity = "1";
    } else if (index - 1 < 0) {
      previous.style.opacity = "0.5";
    }
  });

  // Add and event listener to the next icon
  next.addEventListener("click", () => {
    console.log("next is clicked.");

    // let index = songs.indexOf(selectedSong.src);
    let index = songs.indexOf(
      selectedSong.src.replace(
        "https://asimsaeed353.github.io/spotify-clone",
        ""
      )
    );
    console.log(
      "Next is clicked so here is the index of song",
      selectedSong.src,
      selectedSong.src.replace(
        "https://asimsaeed353.github.io/spotify-clone",
        ""
      ),
      index
    );
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1].replace("/audios/", "").replace(".mp3", ""));
      previous.style.opacity = "1";
      next.style.opacity = "1";
    } else if (index + 1 >= songs.length) {
      next.style.opacity = "0.5";
    }
  });

  // Add event listener to the range
  document.querySelector(".slider").addEventListener("change", (e) => {
    console.log("setting volume to ", e.target.value);
    selectedSong.volume = parseInt(e.target.value) / 100;
  });
}

document.addEventListener("load", () => {
  playMusic(songs[0].replace("/audios/", "").replace(".mp3", ""));
})

main();
