const VideoContainer = {
  setup (videoHolder, { source, poster, width, height }) {
    videoHolder.style.paddingBottom = height / width * 100 + '%';

    let videoElement = document.createElement('video');
    videoElement.src = source;
    videoElement.oncontextmenu = function () { return false; };
    videoHolder.appendChild(videoElement);

    let videoControl = document.createElement('div');
    videoControl.classList.add('video-control', 'center');
    videoControl.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, .9)), url(' + poster + ')';
    videoHolder.appendChild(videoControl);

    let videoControlButton = document.createElement('button');
    videoControlButton.classList.add('button', 'is-small', 'is-rounded', 'is-outlined', 'play');
    videoControlButton.innerHTML = `
      <span class="icon is-small">
        <i class="fas fa-play"></i>
      </span>
      <span>REPRODUZIR</span>
    `
    videoControl.appendChild(videoControlButton);

    let videoControlDownload = document.createElement('a');
    videoControlDownload.href = source;
    videoControlDownload.download = "true";
    videoControlDownload.classList.add('button', 'is-small', 'is-rounded', 'is-outlined', 'is-light');
    videoControlDownload.style.marginLeft = '1em';
    videoControlDownload.innerHTML = `
      <span class="icon is-small">
        <i class="fas fa-download"></i>
      </span>
      <span>DOWNLOAD</span>
    `
    videoControl.appendChild(videoControlDownload);

    let videoPosition = document.createElement('div');
    videoPosition.classList.add('video-position');
    videoHolder.appendChild(videoPosition);

    let videoControlBar = document.createElement('div');
    videoControlBar.classList.add('video-bar');
    videoPosition.appendChild(videoControlBar);

    videoControlButton.onclick = function (e) {
      videoHolder.classList.add('is-playing');
      videoElement.play();
      return true;
    }


    videoElement.addEventListener('ended', function (e) {
      videoHolder.classList.remove('is-playing');
      videoControlBar.style.width = '0%';
    })

    videoElement.addEventListener('timeupdate', function (e) {
      videoControlBar.style.width = videoElement.currentTime / parseFloat(videoElement.duration) * 100 + '%';
    })
  }
};

document.addEventListener('DOMContentLoaded', function (e) {
  const videoPlayers = document.querySelectorAll('.video-player');
  videoPlayers.forEach(player => {
    VideoContainer.setup(player, {
      source: player.dataset.source,
      poster: player.dataset.poster,
      width: player.dataset.width,
      height: player.dataset.height
    });
  });
});
