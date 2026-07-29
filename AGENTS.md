# Agent Instructions
## Project Aim

- Use  location and marker based augmented reality to locate missing permanent survey marks using ntrip services for precision in milimeters.

- This is a static single-page app for GitHub Pages; there is no build step or package manager.
- The app uses A-Frame and AR.js from CDNs for location-based augmented reality.
- PSM coordinate data lives in `psm-data.js` as `window.PSM_LOCATIONS`.

## Working guidelines

- Keep the app deployable as plain static files from the repository root.
- Do not add a framework, bundler, or package manager unless the user explicitly asks.
- Keep generated code minimal, idiomatic, and browser-native.
- Edit PSM locations in `psm-data.js` using WGS84 decimal latitude/longitude.
- Browser camera and geolocation APIs require a secure context; GitHub Pages provides HTTPS.

## Validation

- Syntax-check JavaScript with `node --check app.js` and `node --check psm-data.js` when Node.js is available.
- For runtime validation, serve the folder locally or deploy to GitHub Pages and test on a mobile device with camera/location permissions.

