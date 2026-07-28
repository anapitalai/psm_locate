# PSM Location AR

A single-page, static web app for viewing precise PSM locations with AR.js location-based augmented reality. It is designed to run directly on GitHub Pages with no build step.

## Files

- `index.html` — the app shell and AR.js/A-Frame scene.
- `styles.css` — responsive interface styling.
- `app.js` — marker rendering, location watching, distance calculations, and UI behavior.
- `psm-data.js` — editable PSM coordinate data.

## Add real PSM locations

Edit `psm-data.js` and replace the sample locations:

```js
window.PSM_LOCATIONS = [
  {
    id: "psm-001",
    name: "PSM 001",
    description: "Short description",
    latitude: 40.689247,
    longitude: -74.044502,
    altitude: 12,
    color: "#69f0ae",
  },
];
```

Use WGS84 decimal latitude and longitude. For best results, use coordinates collected with survey-grade or high-accuracy GNSS equipment if the PSMs must be precise.

## Run locally

Because camera and geolocation APIs require a secure context, use either GitHub Pages or a local HTTP server. Some mobile browsers only allow full sensor access from HTTPS.

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000` for desktop testing. For real mobile AR testing, deploy to GitHub Pages.

## Deploy to GitHub Pages

1. Push these files to a GitHub repository.
2. In GitHub, go to **Settings → Pages**.
3. Set **Source** to the default branch and root folder.
4. Open the published `https://<user>.github.io/<repo>/` URL on a phone.
5. Allow camera, location, and device orientation permissions.

## Notes on precision

Browser GPS precision depends on the phone, sky view, local interference, and permission mode. AR.js can place markers at precise coordinates, but consumer-device GPS accuracy is often several meters. The HUD shows the browser-reported accuracy so users can judge reliability in the field.
