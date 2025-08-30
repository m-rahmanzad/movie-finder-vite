import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./MoviePage.module.css";
import cx from "classnames";
import imdb from "./imdb.png";
import background from "./background.jpg";
import Nullimage from "./no-image.webp";
import { findMovie, getRecommended, getCast, getImdbRating } from "../../api";

// Helper functions
function getClassByRate(vote) {
  if (vote >= 8) return "green";
  else if (vote >= 5) return "orange";
  else return "red";
}

function checkImageExists(image) {
  return image ? `https://image.tmdb.org/t/p/w1280${image}` : Nullimage;
}

function checkBackdropExists(image) {
  return image ? `https://image.tmdb.org/t/p/w1280${image}` : background;
}

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState({});
  const [recommended, setRecommended] = useState([]);
  const [cast, setCast] = useState([]);
  const [imdbRating, setImdbRating] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const [movieData, recommendedData, castData] = await Promise.all([
        findMovie(id),
        getRecommended(id),
        getCast(id),
      ]);

      setMovie(movieData);
      setRecommended(recommendedData);
      setCast(castData);

      document.title = `${movieData.title || "Invalid Movie"} | Z-Flix`;

      if (movieData.imdb_id) {
        try {
          const response = await fetch(
            `https://www.omdbapi.com/?i=${movieData.imdb_id}&apikey=${
              import.meta.env.VITE_OMDB_API_KEY
            }`
          );
          const omdbData = await response.json();
          if (omdbData.imdbRating && omdbData.imdbRating !== "N/A") {
            setImdbRating(omdbData.imdbRating);
          }
        } catch (error) {
          console.error("Error fetching IMDb rating:", error);
        }
      }

      window.onfocus = () => {
        document.title = `${movieData.title || "Invalid Movie"} | Z-Flix`;
      };

      window.onblur = () => {
        setTimeout(() => {
          document.title = `👋 You are missing out on great movies`;
        }, 30000);
      };
    }

    fetchData();
  }, [id]);

  return (
    <div className={styles.container}>
      <div
        className={styles.background}
        style={{
          backgroundImage: `url(${checkBackdropExists(movie.backdrop_path)})`,
        }}
      ></div>

      <div className={styles.foreground}>
        <div className={styles.back}>
          <Link
            onClick={() => navigate(-1)}
            style={{ textDecoration: "none" }}
            to="#"
          >
            <i className="fas fa-arrow-left"></i> Go Back
          </Link>
        </div>

        {movie && Object.keys(movie).length > 0 ? (
          <div className={styles.movieContainer}>
            {/* Poster + Rating */}
            <div className={styles.posterContainer}>
              <img
                className={styles.poster}
                src={checkImageExists(movie.poster_path)}
                alt={movie.title}
              />
            </div>

            {/* Movie Details */}
            <div className={styles.details}>
              <h1 className={styles.title}>{movie.title}</h1>
              <h4>
                {movie.release_date ? movie.release_date : ""}{" "}
                {movie.runtime ? `• ${movie.runtime}m` : ""}
              </h4>
              {/* overview */}
              {movie.overview ? <h3>Overview:</h3> : ""}
              <p className={styles.overview}>{movie.overview}</p>

              <div className={styles.infoRow}>
                {<h3>Genre:</h3>}
                <p className={styles.infoItem}>
                  {movie.genres &&
                    movie.genres.map((genre) => genre.name).join(", ")}
                </p>
              </div>

              {movie.imdb_id && (
                <div className={styles.imdbContainer}>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  >
                    <img src={imdb} width="70" alt="imdb" />
                  </a>
                  {imdbRating && (
                    <span className={styles.imdbRatingText}>
                      <strong>&nbsp;Rating:</strong> {imdbRating} ⭐
                    </span>
                  )}
                </div>
              )}

              {/* نمایش بخش Cast فقط در صورت وجود داده */}
              {cast.length > 0 && (
                <div className={styles.section}>
                  <h2>Cast</h2>
                  <div className={styles.castList}>
                    {cast.slice(0, 5).map((actor) => (
                      <div key={actor.id} className={styles.castMember}>
                        <img
                          src={checkImageExists(actor.profile_path)}
                          alt={actor.name}
                        />
                        <p>{actor.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* نمایش بخش Recommended فقط در صورت وجود داده */}
              {recommended.length > 0 && (
                <div className={styles.section}>
                  <h2>You might also like...</h2>
                  <div className={styles.recommendedList}>
                    {recommended.slice(0, 5).map((recMovie) => (
                      <Link to={`/movie/${recMovie.id}`} key={recMovie.id}>
                        <div className={styles.recommendedMovie}>
                          <img
                            src={checkImageExists(recMovie.poster_path)}
                            alt={recMovie.title}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}
