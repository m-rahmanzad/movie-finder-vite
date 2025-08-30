import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";

import { Header, Filter, Search, Movies, Footer, MoviePage } from "./components";
import { getMovies, getGenres } from "./api";

const DISCOVERSEARCH = "https://api.themoviedb.org/3/discover/movie?api_key=YOUR_API_KEY";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=YOUR_API_KEY&query=";

function MoviePageWrapper() {
  const { id } = useParams();
  return <MoviePage id={id} />;
}

function App() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("popularity.desc");
  const [year, setYear] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const moviesData = await getMovies(DISCOVERSEARCH);
      const genresData = await getGenres();
      setMovies(moviesData);
      setGenres(genresData);
      setHasMore(moviesData.length > 0);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Header />
      <Router>
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
                  handleYearChange={setYear}
                  getState={{ movies, genre, sort, year, search }}
                />
                <Movies movies={movies} hasMore={hasMore} />
              </>
            }
          />
          <Route path="/movie/:id" element={<MoviePageWrapper />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
