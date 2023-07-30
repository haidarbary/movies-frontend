import React, { useState } from "react";
import { Grid, TextField, Select, MenuItem } from "@material-ui/core";
import MovieCard from "./movieCard";
import { ImagesDirectory } from "../config.json";

const Watchlist = ({ watchlist, genres, handleAddMovieClick, handleRemoveMovieClick }) => {

    const [searchText, setSearchText] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [sortOption, setSortOption] = useState("title"); // New state for sort option

    const handleSearchChange = (e) => {
      setSearchText(e.target.value);
    };
  
    const handleGenreChange = (e) => {
      setSelectedGenre(e.target.value);
    };
  
    const handleSortChange = (e) => {
      setSortOption(e.target.value);
    };
  
    const filteredMovies = watchlist.filter((movie) => {
      if (selectedGenre === "All") {
        return movie.title.toLowerCase().includes(searchText.toLowerCase());
      } else {
        return (
          movie.title.toLowerCase().includes(searchText.toLowerCase()) &&
          movie.genre.toLowerCase() === selectedGenre.toLowerCase()
        );
      }
    });
  
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
    <Grid container>
      <Grid item xs={12} sm={5} md={2} style={{ padding: "5px" }}>
        <div
          style={{
            padding: "10px",
            margin: "5px",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            flex: "1",
            minWidth: "160px",
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
      <Grid item xs={12} sm={7} md={10}>
      {filteredMovies.length > 0 ? ( // Check if there are movies in the watchlist
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
                addedToWatchlist={true}
                style={{ flex: "0 0 calc(33.33% - 20px)", maxWidth: "calc(33.33% - 20px)" }}
              />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          No movies are saved in Watchlist! <i class="far fa-grin-tongue"></i>
        </div>
      )}
      </Grid>
    </Grid>
  );
};

export default Watchlist;
