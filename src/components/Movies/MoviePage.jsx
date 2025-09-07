import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./MoviePage.module.css";
import imdb from "./imdb.png";
import background from "./background.jpg";
import Nullimage from "./no-image.webp";
import { findMovie, getRecommended, getCast, getExtraRatings } from "../../api";

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
  const [ratings, setRatings] = useState({ imdb: null, rottenTomatoes: null });

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

      // گرفتن امتیازها (IMDb + Rotten Tomatoes)
      const extraRatings = await getExtraRatings(id);
      if (extraRatings) {
        setRatings(extraRatings);
      }

      // تغییر عنوان تب
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
          <button onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i> Go Back
          </button>
        </div>

        {movie && Object.keys(movie).length > 0 ? (
          <div className={styles.movieContainer}>
            {/* Poster */}
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

              {movie.overview ? <h3>Overview:</h3> : ""}
              <p className={styles.overview}>{movie.overview}</p>

              <div className={styles.infoRow}>
                <h3>Genre:</h3>
                <p className={styles.infoItem}>
                  {movie.genres &&
                    movie.genres.map((genre) => genre.name).join(", ")}
                </p>
              </div>

              {/* IMDb + Rotten Tomatoes */}
              {movie.imdb_id && (
                <div className={styles.imdbContainer}>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  >
                    <img src={imdb} width="70" alt="imdb" />
                  </a>
                  {ratings.imdb && (
                    <span className={styles.imdbScore}>
                      <strong>&nbsp;IMDb Rate:</strong> {ratings.imdb} ⭐
                    </span>
                  )}

                  {ratings.rottenTomatoes && (
                    <span className={styles.imdbRatingText}>
                      <strong>&nbsp;Rotten Tomatoes:</strong>{" "}
                      {ratings.rottenTomatoes} 🍅
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
        {/* Cast */}
        <div className={styles.castOuter}>
          {cast && cast.length > 0 && (
            <h3 className={styles.castTitle}>Cast:</h3>
          )}
          <div className={styles.castContainer}>
            {cast &&
              cast.length > 0 &&
              cast.slice(0, 8).map((member, i) => (
                <Link
                  key={member.id}
                  to={`/actor/${member.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    alt={member.name}
                    title={member.name}
                    className={styles.castMember}
                  >
                    <img
                      className={styles.poster}
                      src={checkImageExists(member.profile_path)}
                      alt={member.name}
                    />
                    <div className={styles.movieinfo}>
                      <h3>{member.name}</h3>
                      <h3 className={styles.character}>{member.character}</h3>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Recommended Movies */}
        <div className={styles.recommendedOuter}>
          <h3>Recommended:</h3>
          {recommended.length > 0 && (
            <div className={styles.recommendedContainer}>
              {recommended.slice(0, 8).map((recMovie) => (
                <Link to={`/movie/${recMovie.id}`} key={recMovie.id}>
                  <div className={styles.recommendedMovie}>
                    <img
                      src={checkImageExists(recMovie.poster_path)}
                      alt={recMovie.title}
                    />
                    <div className={styles.recommendedMovie}>
                      <h3>{recMovie.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
