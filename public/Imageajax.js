// function getdesc(img, name,movie) {
//     let parent = document.getElementById("imgplay");
//     let imgtag = document.getElementById("imgt");
//     let moviename = document.getElementById("moviename");

//     // Set image and movie name
//     imgtag.setAttribute("src", img);
//     moviename.innerText = name;
//     // Show the popup box
//     parent.style.display = "block";

//     let amovie=document.getElementById("movie");
//     amovie.setAttribute("href",movie);
//     amovie.setAttribute("target","_blank")
// }

// //for search page

// function getsearchbar() {
// //   alert("hello");
  
//   const s = document.getElementById("s");
//   s.innerHTML="";
//   if (!s) {
//     console.error("Element with ID 's' not found!");
//     return;
//   }

//   const h = document.createElement("input");
//   h.setAttribute("type", "text");
//   h.setAttribute("placeholder", "Search...");

//   // Styling the input
//   s.style.width="60%";
//   s.style.margin="auto";
//   s.style.marginTop="1%"
//   s.style.marginBottom="1%";
//  h.style.width = "100%";
//   h.style.height = "30px";
//   h.style.marginLeft = "10%";
//   h.style.padding = "5px";
//   h.style.border = "1px solid #ccc";
//   h.style.borderRadius = "5px";
//   h.style.backgroundColor="#1111"
//   h.style.color="white";
//   // Attach event listener correctly
//   h.addEventListener("input", function () {
//     getdata(this.value);  // pass value to your getdata function
//   });
//   s.appendChild(h);
// }


// //for marathi movie slider


//   const container = document.getElementById("moviediv");

//   function scrollLeft() {
//     container.scrollBy({
//       left: -300,
//       behavior: "smooth"
//     });
//   }

//   function scrollRight() {
//     container.scrollBy({
//       left: 300,
//       behavior: "smooth"
//     });
//   }



// //for search movie

// function getdata(str) {
//     console.log(document.getElementById("marathi"));

//     // Clear content of all relevant sections
//     document.getElementById("sim1").innerHTML = "";
//     document.getElementById("latest").innerHTML = "";
//     document.getElementById("slider").innerHTML = "";

//     const c = document.getElementById("marathi");

//     if (c) {
//         c.innerHTML = ""; // Clear marathi section
//         // You can optionally show a loading message
//         // container.innerHTML = "<p>Loading...</p>";

//         // Now you can fetch new data via AJAX (optional)
//         // fetch(`/search?query=${str}`).then(...);
//     } else {
//         console.error("Element with ID 'marathi' not found");
//     }
// }


// ========= POPUP DESC FUNCTION ========= //
function getdesc(img, name, movie) {
  let parent = document.getElementById("imgplay");
  let imgtag = document.getElementById("imgt");
  let moviename = document.getElementById("moviename");
  let amovie = document.getElementById("movie");

  if (parent && imgtag && moviename && amovie) {
    imgtag.setAttribute("src", img);
    moviename.innerText = name;
    parent.style.display = "block";
    amovie.setAttribute("href", movie);
    amovie.setAttribute("target", "_blank");
  } else {
    console.error("Some elements not found for popup!");
  }
}

// ========= DYNAMIC SEARCH BAR ========= //
function getsearchbar() {
  const s = document.getElementById("s");
  if (!s) {
    console.error("Element with ID 's' not found!");
    return;
  }

  s.innerHTML = ""; // Clear previous input (if any)

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

  // Live input listener
  h.addEventListener("input", function () {
    getdata(this.value);
  });

  s.appendChild(h);
}

// ========= MARATHI MOVIE SLIDER BUTTONS ========= //
// NOTE: Don't redeclare `const container` if this script runs multiple times.

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("moviediv");

  if (!container) {
    console.error("Slider container #moviediv not found!");
    return;
  }

  // Attach only if buttons exist
  const leftBtn = document.getElementById("scroll-left");
  const rightBtn = document.getElementById("scroll-right");

  if (leftBtn && rightBtn) {
    leftBtn.addEventListener("click", () => {
      container.scrollBy({ left: -300, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
      container.scrollBy({ left: 300, behavior: "smooth" });
    });
  }
});


//to restore the original data before clear

 let originalSim1Content = "";
  let originalLatestContent = "";
  let originalSliderContent = "";
  let originalMarathiContent = "";

  window.addEventListener("DOMContentLoaded", () => {
    const sim1 = document.getElementById("sim1");
    const latest = document.getElementById("latest");
    const slider = document.getElementById("slider");
    const marathi = document.getElementById("marathi");

    if (sim1) originalSim1Content = sim1.innerHTML;
    if (latest) originalLatestContent = latest.innerHTML;
    if (slider) originalSliderContent = slider.innerHTML;
    if (marathi) originalMarathiContent = marathi.innerHTML;
  });


// ========= CLEAR SECTIONS FOR SEARCH ========= //
function getdata(str) {
  const lmovies = document.getElementById("lmovies"); // ✅ correct id
  const sim1 = document.getElementById("sim1");
  const slider = document.getElementById("slider");
  const marathi = document.getElementById("marathi");

  if (!lmovies) {
    console.error("Missing #lmovies container");
    return;
  }

  if (str.trim() === "") {
    // Restore original content
    if (sim1) sim1.innerHTML = originalSim1Content;
    if (lmovies) lmovies.innerHTML = originalLatestContent;  // <-- optional
    if (slider) slider.innerHTML = originalSliderContent;
    if (marathi) marathi.innerHTML = originalMarathiContent;
    return;
  }

  // Clear only child containers
  if (sim1) sim1.innerHTML = "";
  if (slider) slider.innerHTML = "";
  if (marathi) marathi.innerHTML = "";
  document.getElementById("h1").innerHTML="Your Serach Movies";
  document.getElementById("h1").style.marginTop="-70px";
   document.getElementById("h1").style.marginBottom="5px";
  document.getElementById("latest").style.marginTop="0px";
  lmovies.innerHTML = ""; // only clear child!
  // Load search results and inject into lmovies
  fetch(`/user/search?name=${encodeURIComponent(str)}`)
    .then(res => res.text())
    .then(html => {
      lmovies.innerHTML = html;
    })
    .catch(err => console.error("Search load error:", err));
}
