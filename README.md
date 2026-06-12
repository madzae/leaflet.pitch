# Leaflet.Pitch

A lightweight Leaflet plugin that adds **camera pitch (tilt)** to any Leaflet map using CSS 3D perspective.

Combined with [Leaflet-Rotate](https://github.com/Raruto/leaflet-rotate), you get the full **MapLibre / Mapbox GL experience** (pitch + bearing rotation) on a standard Leaflet map.

---

## Demo

> Tilt + rotate working together on a real navigation app: [rupabumi.com](https://rupabumi.com)

---

## Installation

### CDN

```html
<script src="https://cdn.jsdelivr.net/gh/madzae/leaflet-pitch/leaflet.pitch.js"></script>
```

### Manual

Download `leaflet.pitch.js` and include it after `leaflet.js`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
<script src="leaflet.pitch.js"></script>
```

---

## Usage

### Basic

```js
const map = L.map('map').setView([-6.2, 106.8], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Set pitch to 40 degrees
map.setPitch(40);
```

### Remove pitch (fully unwraps the container)

```js
map.removePitch();
```

### Get current pitch

```js
map.getPitch(); // returns number, default 0
```

---

## API

| Method | Arguments | Description |
|---|---|---|
| `setPitch(deg, options)` | `deg`: 0–85, `options`: see below | Set pitch angle. Initializes the plugin on first call. |
| `getPitch()` | — | Returns current pitch in degrees. |
| `removePitch()` | — | Fully removes pitch and unwraps the container back to its original state. |

### Options (passed to `setPitch` on first call)

| Option | Default | Description |
|---|---|---|
| `perspective` | `1000` | CSS perspective depth in px. Lower = more aggressive tilt effect. |
| `perspectiveOrigin` | `'50% 30%'` | Vanishing point of the perspective. |
| `background` | `'#e8e6e1'` | Background color shown in the sliver above the tilted map. Match your basemap sky color. |
| `overscan` | `0.4` | How much to enlarge the map container (40% each side) to avoid blank corners when tilted. |
| `transition` | `'transform 0.15s ease-out'` | CSS transition for smooth pitch animation. |
| `keepBuffer` | `6` | Extra tile buffer to pre-load tiles at the far edge of the tilted view. |

---

## Combine with Leaflet-Rotate for full MapLibre-style experience

Install [Leaflet-Rotate](https://github.com/Raruto/leaflet-rotate) alongside this plugin to get **both pitch and bearing rotation** — the same experience as MapLibre GL or Mapbox GL, but on a standard Leaflet raster/vector map.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
<script src="leaflet-rotate-src.js"></script>
<script src="leaflet.pitch.js"></script>
```

```js
const map = L.map('map', {
    center: [-6.2, 106.8],
    zoom: 15,
    rotate: true,
    touchRotate: false,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Pitch (this plugin)
map.setPitch(40);

// Bearing rotation (leaflet-rotate)
map.setBearing(45);
```

This combination is ideal for **navigation apps** — tilt the map for a driving perspective and rotate it to match the user's heading, just like Google Maps or Waze.

```js
// Example: navigation mode
function startNavigation(heading) {
    map.setPitch(40);
    map.setBearing(-heading);
}

function stopNavigation() {
    map.removePitch();
    map.setBearing(0);
}
```

---

## How it works

On the first `setPitch()` call, the plugin wraps the Leaflet map container in a `div.leaflet-pitch-wrapper` that applies CSS `perspective`. The map container itself is enlarged via `overscan` so that the projected trapezoid still covers the full wrapper area at high tilt angles — no black corners.

`removePitch()` reverses this entirely: it unwraps the container, resets all inline styles, and clears all internal plugin state so the map returns to its flat default and the plugin can be re-initialized cleanly on the next `setPitch()` call.

---

## License

MIT
