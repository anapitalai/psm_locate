# Marker Image AR

A static marker-based augmented reality app for GitHub Pages. Open the page, allow camera access, and point the camera at a Hiro marker to show the virtual image from `images/pin.jpeg`.

## How it works

- Uses A-Frame and AR.js from CDNs.
- Tracks the built-in AR.js Hiro marker.
- Renders a virtual image and ring directly on top of the detected marker.
- Runs as plain static files with no build step or package manager.

## Test it

1. Open the app from GitHub Pages or serve this folder locally.
2. Allow camera access when the browser asks.
3. Open or print the Hiro marker: <https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png>
4. Point the camera at the marker. The virtual image appears over it.

## Local preview

Any static server works, for example:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Notes

- Camera access requires HTTPS on most devices. GitHub Pages provides HTTPS.
- `psm-data.js` is kept only as a legacy placeholder; this version does not use GPS or PSM coordinates.
- Replace `images/pin.jpeg` to change the virtual image.
