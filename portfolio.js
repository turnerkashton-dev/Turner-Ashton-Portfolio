


function changeVideoSource(src, poster = 'images/all_card_1_up') {
  // Update the video source and poster
  videoPlayer.src = src;
  videoPlayer.poster = poster;
 
  classlist.add(hover-card-1)

  // Load the new source and play
  videoPlayer.load();
  videoPlayer.play().catch(error => {
    console.error("Auto-play failed:", error);
    // Browser block auto-play without user interaction
  });
}




// SCRIPTING FOR 2ND CLICK ON PACK WHEN IN pack1.html

document.addEventListener("DOMContentLoaded", () => {
  const secondImage = document.querySelector(".image-two-card-1");
  const checkbox = document.querySelector(".image-toggler-card-1 input");

  secondImage.addEventListener("click", () => {
    // Only redirect if it's actually in the "checked" state
    if (checkbox.checked) {
      window.location.href = "cards1.html";
    }
  });
});

// SCRIPTING FOR 2ND CLICK ON PACK WHEN IN pack2.html

document.addEventListener("DOMContentLoaded", () => {
  const secondImage = document.querySelector(".image-two-card-2");
  const checkbox = document.querySelector(".image-toggler-card-2 input");

  secondImage.addEventListener("click", () => {
    // Only redirect if it's actually in the "checked" state
    if (checkbox.checked) {
      window.location.href = "cards2.html";
    }
  });
});

// SCRIPTING FOR 2ND CLICK ON PACK WHEN IN pack3.html

document.addEventListener("DOMContentLoaded", () => {
  const secondImage = document.querySelector(".image-two-card-3");
  const checkbox = document.querySelector(".image-toggler-card-3 input");

  secondImage.addEventListener("click", () => {
    // Only redirect if it's actually in the "checked" state
    if (checkbox.checked) {
      window.location.href = "cards3.html";
    }
  });
});

// SCRIPTING FOR 2ND CLICK ON PACK WHEN IN pack4.html

document.addEventListener("DOMContentLoaded", () => {
  const secondImage = document.querySelector(".image-two-card-4");
  const checkbox = document.querySelector(".image-toggler-card-4 input");

  secondImage.addEventListener("click", () => {
    // Only redirect if it's actually in the "checked" state
    if (checkbox.checked) {
      window.location.href = "cards4.html";
    }
  });
});

// SCRIPTING FOR 2ND CLICK ON PACK WHEN IN pack5.html

document.addEventListener("DOMContentLoaded", () => {
  const secondImage = document.querySelector(".image-two-card-5");
  const checkbox = document.querySelector(".image-toggler-card-5 input");

  secondImage.addEventListener("click", () => {
    // Only redirect if it's actually in the "checked" state
    if (checkbox.checked) {
      window.location.href = "cards5.html";
    }
  });
});
