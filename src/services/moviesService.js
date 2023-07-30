import http from "./httpService";
import {  } from "../config.json";
import {  } from "../config.json";
import {  } from "../config.json";
import { ExternalAPIUrl, InternalAPIUrl, AddMovieEndpoint, RemoveMovieEndpoint, DiscoverMoviesEndPoint, SearchMoviesEndPoint, MovieDetailsEndPoint, MovieCreditsEndPoint, MovieVideosEndPoint, GenresEndpoint, WatchlistEndpoint } from "../config.json";
import _ from "lodash";

// Gets the list of Genres ids
export function getGenres() {  
  return http.get(ExternalAPIUrl + GenresEndpoint,{headers: {'Authorization': "Bearer " + process.env.REACT_APP_MOVIE_DB_KEY}});
}

// Gets the popular movies through the Movie-DB API "Discover" endpoint which permits more querying (sort by popularity included in params)
export function getMovies(page, params) {  
  return http.get(ExternalAPIUrl + DiscoverMoviesEndPoint + "?page=" + page + params,{headers: {'Authorization': "Bearer " + process.env.REACT_APP_MOVIE_DB_KEY}});
}

// Gets movies that meets the search query through the Movie-DB API API "Search" endpoint 
export function searchMovies(page, params) {  
  return http.get(ExternalAPIUrl + SearchMoviesEndPoint + "?page=" + page + "&query=" + params,{headers: {'Authorization': "Bearer " + process.env.REACT_APP_MOVIE_DB_KEY}});
}

// Gets the selected Movie basic details through the Movie-DB API
export function getMovieBasicDetails(id) {  
  return http.get(ExternalAPIUrl + MovieDetailsEndPoint + id,{headers: {'Authorization': "Bearer " + process.env.REACT_APP_MOVIE_DB_KEY}});
}

// Gets the selected Movie credits (actors, directors...etc) through the Movie-DB API
export function getMovieCredits(id) {  
  return http.get(ExternalAPIUrl + MovieDetailsEndPoint + id + MovieCreditsEndPoint,{headers: {'Authorization': "Bearer " + process.env.REACT_APP_MOVIE_DB_KEY}});
}

// Gets the selected Movie videos (trailer ..etc) through the Movie-DB API
export function getMovieVideos(id) {  
  return http.get(ExternalAPIUrl + MovieDetailsEndPoint + id + MovieVideosEndPoint,{headers: {'Authorization': "Bearer " + process.env.REACT_APP_MOVIE_DB_KEY}});
}

// Adds the movie to the watchlist through the Backend API
export function addMovieToWatchlist(movie) {
  return http.post (process.env.REACT_APP_BACKEND_URL + AddMovieEndpoint, movie, {headers: {'Authorization': "Bearer " + process.env.REACT_APP_BACKEND_KEY}, 'Content-Type': 'application/json'});
}

// Removes the movie from the watchlist through the Backend API
export function removeMovieFromWatchlist(movieID) {
  return http.delete (process.env.REACT_APP_BACKEND_URL + RemoveMovieEndpoint + movieID,{headers: {'Authorization': "Bearer " + process.env.REACT_APP_BACKEND_KEY}});
}

// Gets the Watchlist Movies from the Backend API
export function getWatchlist() {  
  return http.get(process.env.REACT_APP_BACKEND_URL + WatchlistEndpoint,{headers: {'Authorization': "Bearer " + process.env.REACT_APP_BACKEND_KEY}});
}
