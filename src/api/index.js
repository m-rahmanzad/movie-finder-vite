// src/api/index.js
import axios from "axios";

// کلیدها از env
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";
const OMDB_BASE_URL = "https://www.omdbapi.com/";

export const DISCOVERSEARCH = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}`;
export const SEARCHAPI = `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=`;

// دریافت لیست فیلم‌ها (جستجو یا دیسکاور)
export const getMovies = async (url) => {
  try {
    const res = await axios.get(url);
    return res.data.results;
  } catch (err) {
    console.error("Error fetching movies:", err);
    return [];
  }
};

// دریافت ژانرها
export const getGenres = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
    );
    return res.data.genres;
  } catch (err) {
    console.error("Error fetching genres:", err);
    return [];
  }
};

// دریافت جزئیات یک فیلم
export const findMovie = async (id) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching movie:", err);
    return {};
  }
};

// دریافت پیشنهادات فیلم
export const getRecommended = async (id) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/movie/${id}/recommendations?api_key=${TMDB_API_KEY}`
    );
    return res.data.results;
  } catch (err) {
    console.error("Error fetching recommended movies:", err);
    return [];
  }
};

// دریافت بازیگران
export const getCast = async (id) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}`
    );
    return res.data.cast;
  } catch (err) {
    console.error("Error fetching cast:", err);
    return [];
  }
};

// گرفتن فقط امتیاز IMDb
export const getImdbRating = async (tmdbId) => {
  try {
    const externalIdsRes = await axios.get(
      `${BASE_URL}/movie/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`
    );
    const imdbId = externalIdsRes.data.imdb_id;

    if (!imdbId) return null;

    const omdbRes = await axios.get(
      `${OMDB_BASE_URL}?i=${imdbId}&apikey=${OMDB_API_KEY}`
    );

    if (omdbRes.data && omdbRes.data.imdbRating !== "N/A") {
      return omdbRes.data.imdbRating;
    }

    return null;
  } catch (err) {
    console.error("Error fetching IMDb rating:", err);
    return null;
  }
};

// گرفتن امتیازات اضافی (IMDb + Rotten Tomatoes)
export const getExtraRatings = async (tmdbId) => {
  try {
    const externalIdsRes = await axios.get(
      `${BASE_URL}/movie/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`
    );
    const imdbId = externalIdsRes.data.imdb_id;

    if (!imdbId) return null;

    const omdbRes = await axios.get(
      `${OMDB_BASE_URL}?i=${imdbId}&apikey=${OMDB_API_KEY}`
    );

    if (omdbRes.data && omdbRes.data.Response === "True") {
      return {
        imdb:
          omdbRes.data.imdbRating !== "N/A" ? omdbRes.data.imdbRating : null,
        rottenTomatoes:
          omdbRes.data.Ratings.find((r) => r.Source === "Rotten Tomatoes")
            ?.Value || null,
      };
    }

    return null;
  } catch (err) {
    console.error("Error fetching ratings:", err);
    return null;
  }
};
