#  Giri's MovieHub

A simple, responsive movie discovery web app focused on Tamil/Indian cinema. Search for any movie, browse a curated list of popular titles, view full details in a modal, and save your favorites — all saved locally in your browser.

##  Features

- **Home Dashboard** – A featured movie hero banner plus quick stats (favorites count, etc.)
- **Search** – Look up any movie by name using the OMDb API
- **Popular** – A pre-loaded grid of popular Tamil/Indian (and a few global) movies
- **Favorites** – Add/remove movies to a favorites list that persists using `localStorage`
- **Movie Details Modal** – Click any movie card to see poster, rating, cast, and full plot, plus a quick link to search the trailer on YouTube
- **Responsive UI** – Built with Bootstrap 5, works on mobile and desktop

##  Tech Stack

| Tech | Purpose |
|---|---|
| **HTML5** | Page structure |
| **CSS3** | Custom styling (dark theme, animations, hover effects) |
| **JavaScript (Vanilla)** | App logic, DOM manipulation, API calls |
| **Bootstrap 5** | Layout, grid system, responsive components, modal |
| **Google Fonts (Iceberg)** | Custom typography |
| **OMDb API** | Movie data (search, details, posters, ratings) |
| **localStorage** | Saving favorites without a backend/database |

No build tools, frameworks, or backend required — it's a pure static site that runs directly in the browser.

##  Project Structure

```
moviehub/
├── index.html      # Page layout & sections (Home, Search, Popular, Favorites)
├── script.js        # App logic: API calls, rendering, favorites, navigation
└── style.css        # Custom dark theme styling
```
