import React, { useState } from "react";
import { Grid, TextField, Select, MenuItem } from "@material-ui/core";
import MovieCard from "./movieCard";
import { ImagesDirectory } from "../config.json";
import _ from "lodash";

const PopularMovies = ({ movies, watchlist, genres, handleLoadMoreClick, handleAddMovieClick, handleRemoveMovieClick, remaining, searchText, selectedGenre, sortOption, setSearchText, setSelectedGenre, setSortOption }) => {

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setSearchText("");
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const filteredMovies = movies;

  // Sort the movies based on the selected sort option
  if (sortOption === "release_date") {
    filteredMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  } else if (sortOption === "title"){
    filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
  }
  else {
    filteredMovies.sort((a, b) => b.popularity - a.popularity);
  }

  return (
    <Grid container style={{justifyContent:"start"}}>
      <Grid item xs={12} sm={5} md={2} style={{ padding: "5px" }}>
        <div
          style={{
            padding: "10px",
            margin: "5px",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            flex: "1",
            minWidth: "156px",
            justifyContent:"start"
          }}
        >
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={searchText}
            onChange={handleSearchChange}
          />
          <Select
            fullWidth
            variant="outlined"
            value={selectedGenre}
            onChange={handleGenreChange}
            style={{ marginTop: "12px" }}
          >
            <MenuItem value="All" style={{ margin: "0" }}>All genres</MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id} style={{ margin: "0" }}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
          <Select // Sort dropdown element
            fullWidth
            variant="outlined"
            value={sortOption}
            onChange={handleSortChange}
            style={{ marginTop: "12px" }}
          >
            <MenuItem value="title">Sort by Title</MenuItem>
            <MenuItem value="release_date">Sort by Release Date</MenuItem>
          </Select>
        </div>
      </Grid>
      <Grid item xs={12} sm={8} md={10}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                overview={movie.overview}
                release_date={movie.release_date}
                poster_path={ImagesDirectory + movie.poster_path}
                handleAddMovieClick={() => handleAddMovieClick(movie)}
                handleRemoveMovieClick={() => handleRemoveMovieClick(movie.id)} 
                addedToWatchlist={movie.addedToWatchlist}
                watchlist={watchlist}
                style={{ flex: "0 0 calc(33.33% - 20px)", maxWidth: "calc(33.33% - 20px)" }}
              />
          ))}
        </div>
        {remaining !== 0 && (
          <button
            className="btn btn-primary"
            style={{
              margin: "20px auto",
              display: "block",
              width: "20rem",
              borderRadius: "12px"
            }}
            onClick={handleLoadMoreClick}
          >
            Load more
          </button>
        )}
      </Grid>
    </Grid>
  );
};

export default PopularMovies;
