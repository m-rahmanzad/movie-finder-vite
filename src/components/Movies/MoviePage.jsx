import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./MoviePage.module.css";
import cx from "classnames";
import imdb from "./imdb.png";
import background from "./background.jpg";
import Nullimage from "./no-image.webp";
import { findMovie, getRecommended, getCast } from "../../api";

// helper functions
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

  useEffect(() => {
    async function fetchData() {
      const movieData = await findMovie(id);
      const recommendedData = await getRecommended(id);
      const castData = await getCast(id);

      setMovie(movieData);
      setRecommended(recommendedData);
      setCast(castData);

      document.title = `${movieData.title || "Invalid Movie"} | Z-Flix`;

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
        style={{ backgroundImage: `url(${checkBackdropExists(movie.backdrop_path)})` }}
      ></div>

      <div className={styles.foreground}>
        <div className={styles.back}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <i className="fas fa-arrow-left"></i> Go Back
          </button>
        </div>

        {movie && Object.keys(movie).length > 0 ? (
          <div className={styles.movieContainer}>
            <a
              href={`https://www.themoviedb.org/movie/${movie.id}`}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
            >
              <div className={styles.movie}>
                <span className={cx(getClassByRate(movie.vote_average), styles.span)}>
                  <i className="fas fa-star"></i> {movie.vote_average}
                </span>
              </div>
            </a>
          </div>
        ) : (
          <div>Loading...</div> // یا هر چیز دیگری برای نمایش وضعیت بارگذاری
        )}
      </div>
    </div>
  );
}