console.log("Hello, this is javaScript");
let currentSong = new Audio();
let songs;

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/audios/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }
  return songs;
}

function playMusic(track) {
  currentSong.src = './audios/' + track + '.mp3';
  // currentSong.src = track;
  currentSong.play();
  document.querySelector(".play-pause").innerHTML = `<i id="pause" class="ri-pause-fill pointer"></i>`;
  document.querySelector(".song-player__song-name").innerHTML = decodeURI(
    track.replaceAll("-", " ")
  );
  // document.querySelector('.song-duration').innerHTML = '00:00/00:00';
}

async function main() {
  // Get the list of the songs
  songs = await getSongs();
  // playMusic(songs[0]);

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return '00:00';
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
                    .replace("http://127.0.0.1:3000/audios/", "")
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
    if (currentSong.paused) {
      currentSong.play();
      document.querySelector(
        ".play-pause"
      ).innerHTML = `<i id="pause" class="ri-pause-fill pointer"></i>`;
    } else {
      currentSong.pause();
      document.querySelector(".play-pause").innerHTML = `<i id="play" class="ri-play-fill pointer"></i>`;
    }
  });

  // Get time in minutes:seconds format mm:ss
  currentSong.addEventListener("timeupdate", () => {
    console.log(
      formatTime(currentSong.currentTime),
      formatTime(currentSong.duration)
    );
    
    // Update Song timing / duration
    document.querySelector(".song-duration").innerHTML = `${formatTime(
      currentSong.currentTime
    )}/${formatTime(currentSong.duration)}`;

    // Move seekbar circle
    document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    // Come back to original position when song is finished
    if (((currentSong.currentTime / currentSong.duration) * 100) > 99) {
      document.querySelector('.circle').style.left = 0 + '%';
      document.querySelector(".play-pause").innerHTML = `<i id="play" class="ri-play-fill pointer"></i>`;
    }
  });

  // add an Event listener to seek bar
  document.querySelector('.seek-bar').addEventListener('click', e => {
    console.log(e.target.getBoundingClientRect().width, e.offsetX);
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector('.circle').style.left = percent + '%';
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  })

  // Responsive left show on hamburger touch
  document.querySelector('.hamburger-icon').addEventListener('click', () => {
    document.querySelector('.left').style.left = '0%';
    document.querySelector('.left').style.width = '50%';
  })

  // Add an event listener to the close icon to close the left part in smaller devices
  document.querySelector('.close-icon').addEventListener('click', () => {
    document.querySelector('.left').style.left =  '-110%';
  })

  // Add and event listener to the previous icon
  previous.addEventListener('click', () => {

    console.log('Previous is clicked.');
    let index = songs.indexOf(currentSong.src);

    if ((index - 1) >= 0) {
      playMusic(songs[index - 1].replace('http://127.0.0.1:3000/audios/', '').replace('.mp3', ''));
      previous.style.opacity = '1';
      next.style.opacity = '1';
    }
    else if ((index - 1) < 0) {
      previous.style.opacity = '0.7';
    }
  })

  // Add and event listener to the next icon
  next.addEventListener('click', () => {

    console.log('next is clicked.');

    let index = songs.indexOf(currentSong.src);
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1].replace('http://127.0.0.1:3000/audios/', '').replace('.mp3', ''));
      previous.style.opacity = '1';
      next.style.opacity = '1';
    }
    else if ((index + 1) >= songs.length) {
      next.style.opacity = '0.7';
    }
  })

  // Add event listener to the range
  document.querySelector('.slider').addEventListener('change', (e) => {
    console.log('setting volume to ', e.target.value);
    currentSong.volume = parseInt(e.target.value) / 100;
  })
}

main();
