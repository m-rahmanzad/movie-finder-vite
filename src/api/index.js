// src/api/index.js
import axios from 'axios';

// خواندن کلید API از فایل .env
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

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
