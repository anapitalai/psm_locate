const marker = document.querySelector("#hiro-marker");
const statusText = document.querySelector("#status-text");
const overlay = document.querySelector("#overlay");

function setStatus(message) {
  statusText.textContent = message;
}

function dimOverlay() {
  overlay.classList.add("compact");
}

function expandOverlay() {
  overlay.classList.remove("compact");
}

marker.addEventListener("markerFound", () => {
  setStatus("Marker found. The virtual image is displayed on the marker.");
  dimOverlay();
});

marker.addEventListener("markerLost", () => {
  setStatus("Marker lost. Point the camera back at the Hiro marker.");
  expandOverlay();
});

window.addEventListener("load", () => {
  setStatus("Camera starting. Show the Hiro marker to display the virtual image.");
});
