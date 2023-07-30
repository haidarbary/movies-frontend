import React, { useState, useRef, useEffect } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import { Link } from "react-router-dom";
import _ from "lodash";
import { addMovieToWatchlist } from "../services/moviesService";

const MovieCard = ({
  id,
  title,
  overview,
  release_date,
  poster_path,
  handleAddMovieClick,
  handleRemoveMovieClick,
  addedToWatchlist,
  watchlist
}) => {

  const [isInWatchlist, setIsInWatchlist] = useState(addedToWatchlist);

  const trimOverview = (overview) => {
    const maxLength = 250;
    if (overview.length > maxLength) {
      return overview.substr(0, maxLength) + "...";
    }
    return overview;
  };

  const handleToggleWatchlist = () => {
    if (isInWatchlist) {
      handleRemoveMovieClick(id);
    } else {
      handleAddMovieClick({
        id: id,
        title: title,
        overview: overview,
        release_date: release_date,
        poster_path: poster_path,
      });
    }
    setIsInWatchlist(!isInWatchlist);
  };

  const cardRef = useRef(null);

  return (
    <div
      className="card"
      style={{
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link key={id} to={`/movie/${id}`}>
        <img
          className="card-img-top"
          src={poster_path}
          alt={title}
          style={{
            width: "100%",
            height: "auto",
            flex: "1 0 auto",
            cursor: "pointer",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        />
      </Link>
      <div className="card-body">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            cursor: "pointer",
            marginBottom: "8px",
            transition: "transform 0.2s",
          }}
        >
          <div onClick={handleToggleWatchlist}>
            {isInWatchlist ? (
              <CheckCircleIcon style={{ fontSize: 32, color: "#4CAF50" }} />
            ) : (
              <AddCircleOutlineIcon style={{ fontSize: 32, color: "#2196F3" }} />
            )}
          </div>
          <Link key={id} to={`/movie/${id}`}>
            <div style={{ marginLeft: "8px" }}>
              <InfoIcon style={{ fontSize: 28, color: "#2196F3" }} />
            </div>
          </Link>
        </div>
        <b className="card-title" style={{ fontSize: "1.4rem", marginTop: "0", marginBottom: "8px" }}>
          {title}
        </b>
        <p>{release_date}</p>
        <p
          className="card-text"
          style={{
            height: "14rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "0.8rem",
          }}
        >
          {trimOverview(overview)}
        </p>
      </div>
    </div>
  );
}

export default MovieCard;

