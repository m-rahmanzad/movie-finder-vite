import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import {
  Header,
  Filter,
  Search,
  Movies,
  Footer,
  MoviePage,
} from "./components";
import { getMovies, getGenres } from "./api";

function MoviePageWrapper() {
  const { id } = useParams();
  return <MoviePage id={id} />;
}

function App() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("popularity.desc");
  const [year, setYear] = useState({ min: "", max: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [mediaType, setMediaType] = useState("movie");
  const [language, setLanguage] = useState("");
  const [imdbScore, setImdbScore] = useState(5);

  const handleYearChange = (key, value) => {
    setYear((prevYear) => ({ ...prevYear, [key]: value }));
  };

  const handleImdbScoreChange = (score) => {
    setImdbScore(score);
  };

  const fetchMoreMovies = async () => {
    try {
      let nextPageUrl;
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

      if (search) {
        nextPageUrl = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${API_KEY}&query=${search}&page=${
          page + 1
        }`;
      } else {
        nextPageUrl = `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${API_KEY}&page=${
          page + 1
        }`;
        if (sort) nextPageUrl += `&sort_by=${sort}`;
        if (genre) nextPageUrl += `&with_genres=${genre}`;
        // تغییرات برای بازه سال
        if (year.min)
          nextPageUrl += `&primary_release_date.gte=${year.min}-01-01`;
        if (year.max)
          nextPageUrl += `&primary_release_date.lte=${year.max}-12-31`;
        // ...
        if (language) nextPageUrl += `&with_original_language=${language}`;
      }

      const newMovies = await getMovies(nextPageUrl);
      const filteredNewMovies = newMovies.filter((movie) => {
        if (imdbScore > 0) {
          return movie.vote_average >= imdbScore;
        }
        return true;
      });

      if (filteredNewMovies.length > 0) {
        setMovies((prevMovies) => [...prevMovies, ...filteredNewMovies]);
        setPage((prevPage) => prevPage + 1);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more movies:", error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const genresData = await getGenres();
      setGenres(genresData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const applyFilters = async () => {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      let finalUrl;

      if (search) {
        finalUrl = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${API_KEY}&query=${search}`;
      } else {
        finalUrl = `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${API_KEY}`;
        if (sort) finalUrl += `&sort_by=${sort}`;
        if (genre) finalUrl += `&with_genres=${genre}`;
        // تغییرات برای بازه سال
        if (year.min) finalUrl += `&primary_release_date.gte=${year.min}-01-01`;
        if (year.max) finalUrl += `&primary_release_date.lte=${year.max}-12-31`;
        // ...
        if (language) finalUrl += `&with_original_language=${language}`;
      }

      setPage(1);
      const moviesData = await getMovies(finalUrl);

      const filteredMovies = moviesData.filter((movie) => {
        if (imdbScore > 0) {
          return movie.vote_average >= imdbScore;
        }
        return true;
      });

      setMovies(filteredMovies);
      setHasMore(moviesData.length > 0);
    };

    applyFilters();
  }, [sort, genre, year, search, mediaType, language, imdbScore]);

  return (
    <div>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Search handleSearchChange={setSearch} />
              <Filter
                genres={genres}
                handleGenreChange={setGenre}
                handleSortChange={setSort}
                handleYearChange={handleYearChange}
                handleMediaTypeChange={setMediaType}
                handleLanguageChange={setLanguage}
                handleImdbScoreChange={handleImdbScoreChange}
                getState={{
                  movies,
                  genre,
                  sort,
                  year,
                  search,
                  mediaType,
                  language,
                  imdbScore,
                }}
              />
              <Movies
                movies={movies}
                fetchMoreMovies={fetchMoreMovies}
                hasMore={hasMore}
              />
            </>
          }
        />
        <Route path="/movie/:id" element={<MoviePageWrapper />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
