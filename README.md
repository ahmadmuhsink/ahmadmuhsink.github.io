# ahmadmuhsink.github.io

The personal portfolio of Ahmad Muhsin Kurnia, at https://ahmadmuhsink.github.io/.

The site is plain HTML, CSS and JavaScript. It has no build step and no dependencies, except two fonts from Google Fonts.

## Run the site on your computer

1. Open a terminal in the repository folder.
2. Start a local web server:

   ```sh
   python3 -m http.server 8000
   ```

3. Open http://localhost:8000 in a browser.

## Publish a change

GitHub Pages serves the `main` branch from the repository root. If you push to `main`, the live site updates after about one minute.

## Files

- `index.html` holds all the content.
- `style.css` holds the layout, the light and dark themes, and the animations.
- `script.js` runs the prize wheel, the stamp card, the coupons, the typing text, and the Konami code.
- `favicon.svg` is the robot icon in the browser tab.
- `logos/` holds the company logos of the journey stops.

The site respects the `prefers-reduced-motion` setting of the operating system. If this setting is on, the site shows no animations.
