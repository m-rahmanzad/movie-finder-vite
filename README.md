 Movie Finder App

Z-Flix is a modern React + Vite movie discovery web app that allows users to search for movies, view details, explore cast members, and discover recommended films. Data is fetched from The Movie Database (TMDB) API.
I modified from this source https://github.com/seyon123/movie-finder and add some filter and update libraries 
---
Features

🔍 Search movies by title.
🎬 View detailed movie information (poster, overview, genres, runtime, release date).
⭐ Display movie ratings with colored indicators based on scores.
👥 Explore main cast with profile pictures and character names.
🎯 Discover recommended movies based on the selected movie.
🌐 Direct links to TMDB and IMDb pages
🔄 Responsive design for desktop and mobile screens.
---
Screenshots

---
Technologies Used
React – Front-end library for building UI.
Vite – Fast build tool and development server.
React Router – For navigation between pages.
Axios – For fetching data from TMDB API.
CSS Modules – Component-level styling.
FontAwesome – Icons for UI elements.
---

Installation

1.Clone the repository:
```bash
git clone https://github.com/m-rahmanzad/movie-finder-vite.git
cd movie-finder-vite
```
2.Install dependencies:

```
npm install
```

3.Create a .env file in the root directory with your TMDB API key:

```
VITE_TMDB_API_KEY=your_api_key_here
```

4.Start the development server:
```
npm run dev
```

Open http://localhost:5173
 in your browser.
---

Folder Structure
```
movie-finder-vite/
├─ src/
│  ├─ api/           # API requests
│  ├─ components/    # React components
│  │  ├─ Movies/
│  │  │  ├─ MoviePage.jsx
│  │  │  ├─ MoviePage.module.css
│  │  │  └─ ...
│  │  └─ ...
│  ├─ App.jsx
│  └─ main.jsx
├─ public/
├─ .env
├─ package.json
└─ vite.config.js
```
---

Usage
On the home page, scroll to browse movies or search by name.
Click on any movie to view details, including cast and recommendations.
Click on recommended movies to navigate to their detail pages.
Use the back button to return to the previous page.

---

API Reference

TMDB API
 – Used for fetching movie data, cast, and recommendations.
---

Contributing
Contributions are welcome!
Fork the repository.
Create a new branch: git checkout -b feature-name
Make your changes and commit: git commit -m "Add feature"
Push to the branch: git push origin feature-name
Open a Pull Request.

---

License
This project is MIT Licensed.
