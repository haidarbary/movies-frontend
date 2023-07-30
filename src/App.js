import "./App.css";
import { useState, useEffect } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import _ from "lodash";
import {
  getMovies,
  searchMovies,
  getGenres,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  getWatchlist,
} from "./services/moviesService";
import NavBar from "./components/navBar";
import NotFound from "./components/notFound";
import PopularMovies from "./components/popularMovies";
import Watchlist from "./components/watchlist";
import Loading from "./components/loading";
import MovieDetails from "./components/movieDetails";

function App() {
  const [movies, setMovies] = useState(null);
  const [watchlist, setWatchlist] = useState(null);
  const [page, setPage] = useState(1);
  const [remaining, setRemaining] = useState(39259); // total number of pages at start
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortOption, setSortOption] = useState("title");

  useEffect(() => {
    getMoviesData();
  }, [searchText, selectedGenre, watchlist]);

  const getMoviesData = async () => {
    try {
      // Get the movie genres from Movie-DB API
      let { data: genresData } = await getGenres();
      let { genres: genres } = genresData;

      // Get the movie Watchlist from .NET Backend API
      let { data: watchlistData } = await getWatchlist();
      let watchlist = watchlistData || [];

      let newMovies;

      if (searchText !== "") {
        // Get the movies using the Movie-DB Search endpoint
        let { data: moviesData } = await searchMovies(1, searchText);
        let { results: movies } = moviesData;
        newMovies = movies;
      } else {
        // Get the movies using the Movie-DB Discover endpoint and apply filter and sort queries
        let apiParams = constructApiParams(); // filter and sort queries
        let { data: moviesData } = await getMovies(1, apiParams);
        let { results: movies } = moviesData;
        newMovies = movies;
      }

      // Checks if movies are in watchlist
      let updatedMovies = _.cloneDeep(newMovies);
      if (watchlist && watchlist.length > 0) {
        updatedMovies = updatedMovies.map((movie) => {
          let isInWatchlist = _.some(watchlist, { id: movie.id });
          return {
            ...movie,
            addedToWatchlist: isInWatchlist,
          };
        });
      }

      let newRemaining = 39259 - 1; // For Load more movies

      setGenres(genres);
      setMovies(updatedMovies);
      setWatchlist(watchlist);
      setPage(2);
      setRemaining(newRemaining);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies data:", error);
      setLoading(false);
    }
  };

  // Constructs the parameters to be passed with the API call to Movie-DB (language, sort_by, with_genres)
  const constructApiParams = () => {
    let apiParams = "&language=en&sort_by=popularity.desc";

    if (selectedGenre !== "All") {
      apiParams = apiParams + "&with_genres=" + selectedGenre;
    }
    return apiParams;
  };

  // Gets more movies from Movie-DB using the current filters
  const handleLoadMoreClick = async () => {
    try {
      let apiParams = constructApiParams();

      let { data: moviesData } = await getMovies(page, apiParams);
      let { results: newMovies } = moviesData;

      let updatedMovies = [...movies, ...newMovies];
      let newPage = page + 1;
      let newRemaining = remaining - 1;

      setMovies(updatedMovies);
      setPage(newPage);
      setRemaining(newRemaining);
    } catch (error) {
      console.error("Error loading more movies:", error);
    }
  };

  // Adds the movie to the Watchlist using the Add Endpoint of the Backend .NET API
  const handleAddMovieClick = async (movie) => {
    try {
      let result = await addMovieToWatchlist(movie);

      // Update the state
      let updatedMovies = movies.map((m) =>
        m.id === movie.id ? { ...m, addedToWatchlist: true } : m
      );
      setMovies(updatedMovies);

      // Update the Watchlist
      let newWatchlist = [...watchlist, movie];
      setWatchlist(newWatchlist);
    } catch (error) {
      console.error("Error adding movie to watchlist:", error);
    }
  };

  // Removes the movie from the Watchlist using the Remove Endpoint of the Backend .NET API
  const handleRemoveMovieClick = async (movieID) => {
    try {
      let result = await removeMovieFromWatchlist(movieID);

      // Update the state
      let updatedMovies = movies.map((m) =>
        m.id === movieID ? { ...m, addedToWatchlist: false } : m
      );
      setMovies(updatedMovies);

      // Update the Watchlist
      let newWatchlist = watchlist.filter((movie) => movie.id !== movieID);
      setWatchlist(newWatchlist);
    } catch (error) {
      console.error("Error removing movie from watchlist:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <NavBar />
      </header>
      <main className="container App-body">
        {loading === false ? (
          <Switch>
            <Route
              path="/movies"
              render={(props) => (
                <PopularMovies
                  {...props}
                  movies={movies}
                  genres={genres}
                  remaining={remaining}
                  handleLoadMoreClick={handleLoadMoreClick}
                  searchText={searchText}
                  selectedGenre={selectedGenre}
                  sortOption={sortOption}
                  setSearchText={setSearchText}
                  setSelectedGenre={setSelectedGenre}
                  setSortOption={setSortOption}
                  handleAddMovieClick={handleAddMovieClick}
                  handleRemoveMovieClick={handleRemoveMovieClick}
                />
              )}
            />
            <Route
              path="/movie/:id/"
              render={(props) => (
                <MovieDetails
                  {...props}
                  watchlist={watchlist}
                  handleAddMovieClick={handleAddMovieClick}
                  handleRemoveMovieClick={handleRemoveMovieClick}
                />
              )}
            />
            <Route
              path="/watchlist"
              render={(props) => (
                <Watchlist
                  {...props}
                  watchlist={watchlist}
                  genres={genres}
                  handleAddMovieClick={handleAddMovieClick}
                  handleRemoveMovieClick={handleRemoveMovieClick}
                />
              )}
            />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/movies" />
            <Redirect to="/not-found" />
          </Switch>
        ) : (
          <Loading />
        )}
      </main>
    </div>
  );
}

export default App;
