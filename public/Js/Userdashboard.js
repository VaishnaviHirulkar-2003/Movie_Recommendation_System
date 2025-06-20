
            const videos = document.querySelectorAll(".trailer .vidclick");
            let current = 0;

            function playCurrentVideo() {
              if (videos.length === 0) return;

              videos.forEach((video, index) => {
                video.pause();
                video.style.opacity = 0;
              });

              const currentVideo = videos[current];
              currentVideo.currentTime = 0;
              currentVideo.muted = true;
              currentVideo.style.opacity = 1;
              currentVideo.play().catch(e => console.log(e));

              currentVideo.onended = () => {
                current = (current + 1) % videos.length;
                playCurrentVideo();
              };
            }

            // Start with the first video
            playCurrentVideo();

            // Unmute on click
            videos.forEach(video => {
              video.addEventListener("click", function () {
                videos.forEach(v => v.muted = true);
                this.muted = false;
                this.play();
              });
            });

            document.getElementById("unmuteBtn").addEventListener("click", () => {
              const currentVideo = videos[current];
              videos.forEach(v => v.muted = true);
              currentVideo.muted = false;
              currentVideo.play();
            });


            function addToWatchlist(movieId) {
              fetch(`/user/addwatchlist?mid=${movieId}`)
                .then(response => response.json())
                .then(data => {
                  if (data.success) {
                    const movieDiv = document.getElementById(`movie-${movieId}`);
                    const msgSpan = movieDiv.querySelector(".added-msg");

                    msgSpan.style.display = "inline"; // Show message

                    // Hide it after 2 seconds
                    setTimeout(() => {
                      msgSpan.style.display = "none";
                    }, 1000);
                  } else {
                    alert(data.message);
                  }
                })
                .catch(err => console.error("Error adding to watchlist:", err));
            }

const track = document.getElementById("sliderTrack");
let scrollInterval;
let isPaused = false;

// Function to scroll the slider
function scrollSlider() {
  if (isPaused) return;

  const firstItem = track.firstElementChild;
  const itemWidth = firstItem.offsetWidth + 20;

  track.style.transition = "transform 0.5s linear";
  track.style.transform = `translateX(-${itemWidth}px)`;

  setTimeout(() => {
    track.style.transition = "none";
    track.appendChild(firstItem);
    track.style.transform = "translateX(0)";
  }, 500);
}

// Start scrolling
function startAutoScroll() {
  stopAutoScroll(); // clear previous interval if any
  scrollInterval = setInterval(scrollSlider, 2000);
}
// Stop scrolling
function stopAutoScroll() {
  clearInterval(scrollInterval);
  scrollInterval = null;
}
//here we deleetd the code which is paste in the motepad
const overlay = document.querySelector(".imgplay");
document.querySelectorAll(".slide-item img").forEach(img => {
  img.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent body click
    isPaused = true;
    stopAutoScroll();
    overlay.style.display = "block"; // ✅ only show it
  });
});
document.body.addEventListener("click", () => {
  overlay.style.display = "none";
  isPaused = false;
  startAutoScroll();
});


// Initial scroll start
startAutoScroll();


// When image is clicked: show overlay + pause scroll
document.querySelectorAll(".slide-item img").forEach(img => {
  img.addEventListener("click", (e) => {
    e.stopPropagation(); // stop from bubbling to body

    const overlay = document.querySelector(".imgplay");
    // overlay.innerHTML = "▶ Trailer Playing..."; // optional content
    overlay.style.display = "block";
    isPaused = true;
    stopAutoScroll();
  });
});

// Clicking anywhere else on body hides overlay & resumes scroll
document.body.addEventListener("click", () => {
  const overlay = document.querySelector(".imgplay");
  overlay.style.display = "none";
//   overlay.innerHTML = "";
  isPaused = false;
  startAutoScroll();
});

