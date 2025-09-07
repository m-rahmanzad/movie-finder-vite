import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./ActorPage.module.css";
import Nullimage from "../Movies/no-image.webp"; // مسیر را بررسی کنید

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function ActorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => setActor(data))
      .catch(() => setActor(null));

    fetch(
      `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_KEY}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => setMovies(data.cast || []))
      .catch(() => setMovies([]));
  }, [id]);

  if (!actor) return <p>Loading...</p>;

  function checkImageExists(image) {
    return image ? `https://image.tmdb.org/t/p/w300${image}` : Nullimage;
  }

  return (
    <div className={styles.container}>
      {/* دکمه بازگشت */}
      <div className={styles.back}>
        <button onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Go Back
        </button>
      </div>
      <div className={styles.actorContainer}>
        <div className={styles.profileContainer}>
          <img
            src={checkImageExists(actor.profile_path)}
            alt={actor.name}
            className={styles.profile}
          />
        </div>
        <div className={styles.details}>
          <h1 className={styles.name}>{actor.name}</h1>
          <p className={styles.biography}>
            {actor.biography || "No biography available."}
          </p>
          <div className={styles.infoRow}>
            <span className={styles.infoItem}>
              <strong>Born:</strong> {actor.birthday || "-"}
            </span>
            {actor.deathday && (
              <span className={styles.infoItem}>
                <strong>Died:</strong> {actor.deathday}
              </span>
            )}
            <span className={styles.infoItem}>
              <strong>Place of Birth:</strong> {actor.place_of_birth || "-"}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.recommendedOuter}>
        <h3>Famous Movies</h3>
        <div className={styles.recommendedContainer}>
          {movies.slice(0, 8).map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className={styles.recommendedMovie}>
                <img
                  src={checkImageExists(movie.poster_path)}
                  alt={movie.title}
                />
                <div className={styles.recommendedMovie}>
                  <h3>{movie.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
