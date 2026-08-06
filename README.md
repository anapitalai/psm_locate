# PSM Location AR

A static, location-based augmented reality app for GitHub Pages. Open the page, tap **Start AR**, allow camera and location access, and virtual markers appear over each permanent survey mark (PSM) within range in the live camera view.

## How it works

- Uses A-Frame and AR.js (location-based GPS mode) from CDNs.
- Reads PSM coordinates from `window.PSM_LOCATIONS` in `psm-data.js`.
- Places a virtual marker (ring, post, and pin billboard) at each PSM's real-world GPS position.
- Markers within 200 m of the device become visible and show live distance.
- Runs as plain static files with no build step or package manager.

## Test it

1. Open the app from GitHub Pages or serve this folder locally.
2. Tap **Start AR** and allow camera and location permissions.
3. Point the camera toward a nearby PSM. A colored ring/post/pin marker appears over its position, with a distance label.
4. Tap **Show PSM list** to see all configured PSMs and their coordinates.

## Local preview

Any static server works, for example:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Note that camera/GPS permissions require HTTPS on most mobile devices, so full AR testing should happen on GitHub Pages or another HTTPS host.

## Notes

- Edit `psm-data.js` to add, remove, or correct PSM coordinates (WGS84 decimal latitude/longitude).
- PSM data currently includes the PNGUoT Taraka Campus provisional coordinates from `psms/PNGUoT_Taraka_Campus_Coordinates_provisional_20251201.gpx`.
- Replace `images/pin.jpeg` to change the marker pin image.

