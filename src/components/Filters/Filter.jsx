import React from "react";
import styles from "./Filter.module.css";

const Filter = ({
  genres,
  handleGenreChange,
  handleSortChange,
  handleYearChange,
  handleMediaTypeChange,
  handleLanguageChange,
  handleImdbScoreChange,
  getState
}) => {
  return (
    <div id="filter" className={styles.toolbar}>
      {/* انتخاب بین فیلم و سریال */}
      <div className={styles.filterSection}>
        Type:
        <select
          value={getState.mediaType}
          onChange={(e) => handleMediaTypeChange(e.target.value)}
        >
          <option value="movie">Movie</option>
          <option value="tv">TV Series</option>
        </select>
      </div>

      {/* فیلتر ژانر */}
      <div className={styles.filterSection}>
        Genres:
        <select
          className={styles.genres}
          value={getState.genre}
          onChange={(e) => handleGenreChange(e.target.value)}
        >
          <option value="" className={styles.genre}>
            All Genres
          </option>
          {genres
            ? genres.map((genre, i) => (
                <option key={i} className={styles.genres} value={genre.id}>
                  {genre.name}
                </option>
              ))
            : ""}
        </select>
      </div>

      {/* فیلتر زبان */}
      <div className={styles.filterSection}>
        Language:
        <select
          value={getState.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
        >
          <option value="">All Languages</option>
          <option value="en">English</option>
          <option value="fa">Persian</option>
          <option value="de">German</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      {/* فیلتر سال */}
      <div className={styles.filterSection}>
        Year:
        <input
          className={styles.year}
          name="year"
          value={getState.year}
          onChange={(e) => handleYearChange(e.target.value)}
          type="number"
          min="1900"
          max="2099"
          step="1"
          placeholder="Year..."
        />
      </div>

      {/* فیلتر مرتب‌سازی */}
      <div className={styles.filterSection}>
        Sort By:
        <select
          className={styles.sortby}
          value={getState.sort}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option className={styles.sort} value="popularity.desc">
            Popularity ▼
          </option>
          <option className={styles.sort} value="popularity.asc">
            Popularity ▲
          </option>
          <option className={styles.sort} value="release_date.desc">
            Release Date ▼
          </option>
          <option className={styles.sort} value="release_date.asc">
            Release Date ▲
          </option>
          <option className={styles.sort} value="revenue.desc">
            Earnings ▼
          </option>
          <option className={styles.sort} value="revenue.asc">
            Earnings ▲
          </option>
        </select>
      </div>

      {/* فیلتر امتیاز IMDb (به صورت نمره دقیق) */}
      <div className={styles.filterSection}>
        IMDb Score: {getState.imdbScore}
        <input
          type="range"
          min="5"
          max="10"
          step="0.5"
          value={getState.imdbScore}
          onChange={(e) => handleImdbScoreChange(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
};

export default Filter;