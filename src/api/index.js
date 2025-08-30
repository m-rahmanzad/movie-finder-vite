// src/api/index.js
import axios from 'axios';

// خواندن کلید API از فایل .env
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";
const OMDB_BASE_URL = "https://www.omdbapi.com/";

export const DISCOVERSEARCH = `${BASE_URL}/discover/movie?api_key=${API_KEY}`;
export const SEARCHAPI = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=`;


export const getMovies = async (url) => {
  try {
    const res = await axios.get(url);
    return res.data.results;
  } catch (err) {
    console.error("Error fetching movies:", err);
    return [];
  }
};

export const getGenres = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    return res.data.genres;
  } catch (err) {
    console.error("Error fetching genres:", err);
    return [];
  }
};

export const findMovie = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching movie:", err);
    return {};
  }
};

export const getRecommended = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}`);
    return res.data.results;
  } catch (err) {
    console.error("Error fetching recommended movies:", err);
    return [];
  }
};

export const getCast = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
    return res.data.cast;
  } catch (err) {
    console.error("Error fetching cast:", err);
    return [];
  }
};

export const getImdbRating = async (tmdbId) => {
    try {
        // مرحله ۱: دریافت IMDb ID از TMDb
        const externalIdsRes = await axios.get(`${BASE_URL}/movie/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`);
        const imdbId = externalIdsRes.data.imdb_id;

        // اگر IMDb ID وجود نداشت، null برگردان
        if (!imdbId) {
            return null;
        }

        // مرحله ۲: دریافت امتیاز IMDb از OMDb
        const omdbRes = await axios.get(`${OMDB_BASE_URL}?i=${imdbId}&apikey=${OMDB_API_KEY}`);
        
        // اگر امتیاز وجود داشت، آن را برگردان
        if (omdbRes.data && omdbRes.data.imdbRating !== "N/A") {
            return omdbRes.data.imdbRating;
        }
        
        return null;
    } catch (err) {
        console.error("Error fetching IMDb rating:", err);
        return null;
    }
};