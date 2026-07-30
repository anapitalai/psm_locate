const MARKER_VISIBILITY_RANGE_METERS = 200;
const DEFAULT_MARKER_COLOR = "#69f0ae";

const state = {
  started: false,
  currentPosition: null,
  markers: new Map(),
};

const els = {
  startPanel: document.querySelector("#start-panel"),
  startButton: document.querySelector("#start-ar"),
  toggleList: document.querySelector("#toggle-list"),
  closeList: document.querySelector("#close-list"),
  drawer: document.querySelector("#psm-drawer"),
  psmList: document.querySelector("#psm-list"),
  scene: document.querySelector("#ar-scene"),
  hud: document.querySelector("#hud"),
  statusText: document.querySelector("#status-text"),
  accuracy: document.querySelector("#accuracy"),
  visibleCount: document.querySelector("#visible-count"),
  nearestPsm: document.querySelector("#nearest-psm"),
  addCurrent: document.querySelector("#add-current"),
  recenter: document.querySelector("#recenter"),
};

function getPsmLocations() {
  return Array.isArray(window.PSM_LOCATIONS) ? window.PSM_LOCATIONS : [];
}

function setStatus(message) {
  els.statusText.textContent = message;
}

function formatDistance(meters) {
  if (!Number.isFinite(meters)) {
    return "--";
  }

  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  return `${(meters / 1000).toFixed(2)} km`;
}

function distanceMeters(origin, target) {
  const earthRadiusMeters = 6371000;
  const lat1 = origin.latitude * Math.PI / 180;
  const lat2 = target.latitude * Math.PI / 180;
  const deltaLat = (target.latitude - origin.latitude) * Math.PI / 180;
  const deltaLon = (target.longitude - origin.longitude) * Math.PI / 180;

  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c;
}

function isValidCoordinate(psm) {
  return Number.isFinite(psm.latitude)
    && Number.isFinite(psm.longitude)
    && Math.abs(psm.latitude) <= 90
    && Math.abs(psm.longitude) <= 180;
}

function psmName(psm) {
  return String(psm.name || psm.id || "PSM");
}

function markerColor(psm) {
  const color = String(psm.color || "").trim();
  return /^#[0-9a-f]{3,8}$/i.test(color) ? color : DEFAULT_MARKER_COLOR;
}

function createAframeElement(tagName, attributes = {}) {
  const element = document.createElement(tagName);

  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, String(value));
  }

  return element;
}

function createVirtualMarker(psm) {
  const color = markerColor(psm);
  const marker = document.createElement("a-entity");
  const content = document.createElement("a-entity");
  const billboard = document.createElement("a-entity");

  marker.setAttribute("gps-new-entity-place", `latitude: ${psm.latitude}; longitude: ${psm.longitude}`);
  marker.setAttribute("data-psm-id", psm.id || psm.name || "psm");
  marker.setAttribute("data-psm-name", psmName(psm));

  content.setAttribute("data-role", "virtual-psm-marker");
  content.setAttribute("scale", "8 8 8");

  content.appendChild(createAframeElement("a-ring", {
    color,
    "radius-inner": 0.35,
    "radius-outer": 0.55,
    rotation: "-90 0 0",
    position: "0 0.03 0",
    opacity: 0.95,
  }));

  content.appendChild(createAframeElement("a-cylinder", {
    color,
    radius: 0.08,
    height: 0.14,
    position: "0 0.08 0",
  }));

  content.appendChild(createAframeElement("a-cylinder", {
    color,
    radius: 0.025,
    height: 2.1,
    position: "0 1.1 0",
    opacity: 0.75,
    transparent: true,
  }));

  billboard.setAttribute("look-at", "[gps-new-camera]");
  billboard.appendChild(createAframeElement("a-image", {
    src: "#pin-marker-image",
    width: 1.15,
    height: 1.15,
    position: "0 2.35 0",
    transparent: true,
  }));
  billboard.appendChild(createAframeElement("a-triangle", {
    color,
    "vertex-a": "0 -0.35 0",
    "vertex-b": "-0.22 0.1 0",
    "vertex-c": "0.22 0.1 0",
    position: "0 1.72 0",
  }));
  billboard.appendChild(createAframeElement("a-text", {
    value: psmName(psm),
    align: "center",
    color: "#ffffff",
    width: 5,
    position: "0 3.05 0",
  }));
  billboard.appendChild(createAframeElement("a-text", {
    value: "Waiting for GPS",
    align: "center",
    color: color,
    width: 4.2,
    position: "0 2.72 0",
    "data-distance-label": "true",
  }));

  content.appendChild(billboard);
  marker.appendChild(content);

  return marker;
}

function renderMarkers() {
  const psms = getPsmLocations().filter(isValidCoordinate);

  for (const marker of state.markers.values()) {
    marker.remove();
  }

  state.markers.clear();

  for (const psm of psms) {
    const marker = createVirtualMarker(psm);
    marker.setAttribute("visible", "false");
    state.markers.set(psm.id, marker);
    els.scene.appendChild(marker);
  }

  updateMarkerVisibility();
  updateNearestPsm();
}

function updateMarkerDistanceLabel(marker, distance) {
  const distanceLabel = marker.querySelector("[data-distance-label]");

  if (distanceLabel) {
    distanceLabel.setAttribute("value", `${formatDistance(distance)} away`);
  }
}

function updateMarkerVisibility() {
  let visibleCount = 0;

  for (const psm of getPsmLocations().filter(isValidCoordinate)) {
    const marker = state.markers.get(psm.id);
    if (!marker) {
      continue;
    }

    const distance = state.currentPosition
      ? distanceMeters(state.currentPosition.coords, psm)
      : Number.POSITIVE_INFINITY;
    const isVisible = distance <= MARKER_VISIBILITY_RANGE_METERS;

    marker.setAttribute("visible", String(isVisible));
    updateMarkerDistanceLabel(marker, distance);

    if (isVisible) {
      visibleCount += 1;
    }
  }

  els.visibleCount.textContent = `Visible PSMs: ${visibleCount}`;
}

function renderPsmList() {
  const psms = getPsmLocations();
  els.psmList.replaceChildren();

  if (!psms.length) {
    const empty = document.createElement("li");
    empty.textContent = "No PSM locations configured.";
    els.psmList.appendChild(empty);
    return;
  }

  for (const psm of psms) {
    const item = document.createElement("li");
    const distance = state.currentPosition && isValidCoordinate(psm)
      ? ` · ${formatDistance(distanceMeters(state.currentPosition.coords, psm))}`
      : "";

    item.innerHTML = `
      <strong>${escapeHtml(psmName(psm))}</strong>
      <span>${escapeHtml(psm.description || "No description")}${distance}</span>
      <span>${psm.latitude}, ${psm.longitude}</span>
    `;
    els.psmList.appendChild(item);
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function updateNearestPsm() {
  if (!state.currentPosition) {
    els.nearestPsm.textContent = "Nearest: --";
    return;
  }

  const nearest = getPsmLocations()
    .filter(isValidCoordinate)
    .map((psm) => ({
      psm,
      distance: distanceMeters(state.currentPosition.coords, psm),
    }))
    .sort((a, b) => a.distance - b.distance)[0];

  if (!nearest) {
    els.nearestPsm.textContent = "Nearest: --";
    return;
  }

  els.nearestPsm.textContent = `Nearest: ${psmName(nearest.psm)} (${formatDistance(nearest.distance)})`;
}

function watchLocation() {
  if (!("geolocation" in navigator)) {
    setStatus("Geolocation is not available on this device.");
    return;
  }

  navigator.geolocation.watchPosition(
    (position) => {
      state.currentPosition = position;
      els.accuracy.textContent = `Accuracy: ±${Math.round(position.coords.accuracy)} m`;
      updateMarkerVisibility();
      updateNearestPsm();
      renderPsmList();

      const nearestText = els.nearestPsm.textContent.replace("Nearest: ", "");
      setStatus(`AR is running. Virtual markers appear over marks within ${MARKER_VISIBILITY_RANGE_METERS} m. ${nearestText}`);
    },
    (error) => {
      setStatus(`Location error: ${error.message}`);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 15000,
    },
  );
}

async function startAr() {
  if (state.started) {
    return;
  }

  if (!window.isSecureContext) {
    setStatus("Use HTTPS to enable camera and precise location permissions.");
    return;
  }

  state.started = true;
  els.startPanel.classList.add("hidden");
  els.scene.classList.remove("hidden");
  els.hud.classList.remove("hidden");
  setStatus("Requesting camera and location permissions...");
  renderMarkers();
  watchLocation();
}

function addCurrentPsm() {
  if (!state.currentPosition) {
    setStatus("Current location is not available yet.");
    return;
  }

  const coords = state.currentPosition.coords;
  const newPsm = {
    id: `psm-${Date.now()}`,
    name: `New PSM ${getPsmLocations().length + 1}`,
    description: "Temporary virtual marker added on this device. Copy it into psm-data.js to publish it.",
    latitude: Number(coords.latitude.toFixed(7)),
    longitude: Number(coords.longitude.toFixed(7)),
    altitude: coords.altitude ? Number(coords.altitude.toFixed(2)) : 0,
    color: "#ff8a80",
  };

  window.PSM_LOCATIONS.push(newPsm);
  renderMarkers();
  renderPsmList();
  setStatus(`Added temporary PSM at ${newPsm.latitude}, ${newPsm.longitude}.`);
  console.info("Copy this PSM into psm-data.js:", JSON.stringify(newPsm, null, 2));
}

function bindEvents() {
  els.startButton.addEventListener("click", startAr);
  els.toggleList.addEventListener("click", () => els.drawer.classList.toggle("hidden"));
  els.closeList.addEventListener("click", () => els.drawer.classList.add("hidden"));
  els.addCurrent.addEventListener("click", addCurrentPsm);
  els.recenter.addEventListener("click", () => {
    renderMarkers();
    setStatus("Virtual markers refreshed.");
  });
}

renderPsmList();
bindEvents();
