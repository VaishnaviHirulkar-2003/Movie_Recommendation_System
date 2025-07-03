// ========= POPUP DESC FUNCTION ========= //
function getdesc(img, name, movie) {
  const parent = document.getElementById("imgplay");
  const imgtag = document.getElementById("imgt");
  const moviename = document.getElementById("moviename");
  const amovie = document.getElementById("movie");

  if (parent && imgtag && moviename && amovie) {
    imgtag.setAttribute("src", img);
    moviename.innerText = name;
    parent.style.display = "block";
    amovie.setAttribute("href", movie);
    amovie.setAttribute("target", "_blank");
  }
}

// ========= DYNAMIC SEARCH BAR ========= //
function getsearchbar() {
  const s = document.getElementById("s");
  if (!s) return;

  s.innerHTML = "";

  const h = document.createElement("input");
  h.setAttribute("type", "text");
  h.setAttribute("placeholder", "Search...");
  h.style.width = "100%";
  h.style.height = "30px";
  h.style.marginLeft = "10%";
  h.style.padding = "5px";
  h.style.border = "1px solid #ccc";
  h.style.borderRadius = "5px";
  h.style.backgroundColor = "#1111";
  h.style.color = "white";

  s.style.width = "60%";
  s.style.margin = "auto";
  s.style.marginTop = "1%";
  s.style.marginBottom = "1%";

  h.addEventListener("input", function () {
    getdata(this.value);
  });

  s.appendChild(h);
}

// ========= SLIDER INIT ========= //
function reinitializeUI() {
  const container = document.getElementById("moviediv");
  const leftBtn = document.getElementById("scroll-left");
  const rightBtn = document.getElementById("scroll-right");

  if (container && leftBtn && rightBtn) {
    leftBtn.addEventListener("click", () => {
      container.scrollBy({ left: -300, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
      container.scrollBy({ left: 300, behavior: "smooth" });
    });
  }
}

// ========= ORIGINAL STORAGE ========= //
let originalSim1Content = "";
let originalLatestContent = "";
let originalLmoviesContent = "";
let originalSliderContent = "";
let originalMarathiContent = "";
let originalH1Text = "";

let originalStyles = {
  h1: {},
  latest: {},
  lmovies: {},
  marathi: {}
};

window.addEventListener("DOMContentLoaded", () => {
  const sim1 = document.getElementById("sim1");
  const latest = document.getElementById("latest");
  const lmovies = document.getElementById("lmovies");
  const marathi = document.getElementById("marathi");
  const h1 = document.getElementById("h1");
  const slider = document.getElementById("slider");

  if (sim1) originalSim1Content = sim1.innerHTML;
  if (latest) originalLatestContent = latest.innerHTML;
  if (lmovies) originalLmoviesContent = lmovies.innerHTML;
  if (slider) originalSliderContent = slider.outerHTML;
  if (marathi) originalMarathiContent = marathi.innerHTML;

  if (h1) {
    originalH1Text = h1.innerHTML;
    originalStyles.h1 = { ...h1.style };
  }
  if (latest) originalStyles.latest = { ...latest.style };
  if (lmovies) originalStyles.lmovies = { ...lmovies.style };
  if (marathi) originalStyles.marathi = { ...marathi.style };

  reinitializeUI();
});

// ========= SEARCH & RESTORE ========= //
function getdata(str) {
  const sim1 = document.getElementById("sim1");
  const latest = document.getElementById("latest");
  const marathi = document.getElementById("marathi");
  const slider = document.getElementById("slider");
  const lmovies = document.getElementById("lmovies");
  const h1 = document.getElementById("h1");

  if (!lmovies || !latest) return;

  if (str.trim() === "") {
    if (sim1) sim1.innerHTML = originalSim1Content;

    // Restore slider
    if (slider) {
      const newSlider = document.createElement("div");
      newSlider.innerHTML = originalSliderContent;
      const parent = slider.parentNode;
      if (parent) {
        const replacedSlider = newSlider.firstElementChild;
        parent.replaceChild(replacedSlider, slider);
        replacedSlider.style.display = "block";
        replacedSlider.style.height = "340px";
      }
    }

    if (marathi) {
      marathi.innerHTML = originalMarathiContent;
      Object.assign(marathi.style, originalStyles.marathi);
    }

    if (lmovies) {
      lmovies.innerHTML = originalLmoviesContent;
      Object.assign(lmovies.style, originalStyles.lmovies);
    }

    if (latest) {
      Object.assign(latest.style, originalStyles.latest);
    }

    if (h1) {
      h1.innerHTML = originalH1Text;
      Object.assign(h1.style, originalStyles.h1);
    }

    document.querySelectorAll(".search-wrapper, .search-result").forEach(el => el.remove());

    reinitializeUI();
    return;
  }

  // KEEP SLIDER VISIBLE
  // if (slider) slider.style.display = "none"; ← REMOVED

  if (marathi) marathi.style.display = "none";

  if (h1) {
    h1.innerHTML = "Your Favourite ❤️";
    h1.style.marginTop = "0px";
    h1.style.marginBottom = "10px";
    h1.style.marginLeft = "10px";
  }

  fetch(`/user/search?name=${encodeURIComponent(str)}`)
    .then(res => res.text())
    .then(html => {
      if (lmovies) {
        lmovies.innerHTML = html;
        lmovies.style.display = "flex";
      }
    })
    .catch(err => console.error("Search fetch error:", err));
}
