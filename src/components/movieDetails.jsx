import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { getMovieBasicDetails, getMovieCredits, getMovieVideos } from "../services/moviesService";
import { ImagesDirectory } from "../config.json";
import YoutubeEmbed from "./common/YouTubeEmbed";
import Loading from "./loading";
import _ from "lodash";

const MovieDetails = ({watchlist, handleAddMovieClick, handleRemoveMovieClick}) => {
  const [movieBasicDetails, setMovieBasicDetails] = useState(null);
  const [movieCast, setMovieCast] = useState([]);
  const [movieCrew, setMovieCrew] = useState([]);
  const [movieTrailer, setMovieTrailer] = useState("");
  const [isInWatchlist, setIsInWatchlist] = useState(false); 
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Checks whether the movie is part of the watchlist
        let isInWatchlist = _.some(watchlist, { id: parseInt(params.id) });
        setIsInWatchlist(isInWatchlist);

        // Gets movie basic details from Movie-DB
        let { data: basicDetails } = await getMovieBasicDetails(params.id);
        setMovieBasicDetails(basicDetails);

        // Gets movie credits info from Movie-DB
        let { data: creditsData } = await getMovieCredits(params.id);
        let { cast: cast, crew: crew } = creditsData;
        setMovieCast(cast);
        setMovieCrew(crew);

        // Gets movie videos (trailer) from Movie-DB
        let { data: videosData } = await getMovieVideos(params.id);
        let { results: videos } = videosData;
        let firstTrailer = videos.find((video) => video.type === "Trailer"); // Find the first video where type is "Trailer"
        setMovieTrailer(firstTrailer.key);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [params.id]);

  if (loading) {
    return <Loading />;
  } else {
    const {
      title,
      release_date,
      runtime,
      tagline,
      overview,
      genres,
      poster_path,
    } = movieBasicDetails;

    // Filter the movieCredits array to include only the roles we want to display
    const mainCast = movieCast.filter(
      (cast) => cast.order <= 11 && cast.profile_path 
    );

    // Get director and writer details from movieCredits
    const director = movieCrew.find(
      (crew) => crew.job && crew.job.toLowerCase() === "director"
    )?.name;
    const writer = movieCrew.find(
      (crew) => crew.job && crew.job.toLowerCase() === "writer"
    )?.name;

    const handleToggleWatchlist = () => {
      if (isInWatchlist) {
        handleRemoveMovieClick(parseInt(params.id));
      } else {
        handleAddMovieClick({
          id: parseInt(params.id),
          title: title,
          overview: overview,
          release_date: release_date,
          poster_path: poster_path,
        });
      }
      setIsInWatchlist(!isInWatchlist);
    };

    const formatMinutesToHoursAndMinutes = (minutes) => {
      if (typeof minutes !== 'number' || isNaN(minutes)) {
        return 'Invalid input';
      }
    
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
    
      let result = '';
      if (hours > 0) {
        result += `${hours}h`;
      }
      if (remainingMinutes > 0) {
        result += `${remainingMinutes}m`;
      }
    
      return result;
    }

    return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <img
              src={ImagesDirectory + poster_path}
              alt={title}
              style={{ width: "8rem", height: "14rem", marginRight: "20px", borderRadius: "12px" }}
            />
            <div
              style={{
                display: "block",
                justifyContent: "start",
                textAlign: "left",
                alignItems: "top",
                marginBottom: "10px"
              }}
            >
              <div style={{ fontSize: "1.4rem", fontWeight: "bold"}}>
                {title} ({release_date.substring(0, 4)}) 
              </div>
              <span style={{fontSize: "1.2rem", fontWeight: "normal"}}>
                  <i class="fa fa-clock-o" aria-hidden="true"></i> {formatMinutesToHoursAndMinutes(runtime)} 
                </span>
              <div>
                {tagline}
              </div>
              <div
                style={{
                  marginRight: "10px",
                  marginTop: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: isInWatchlist ? "green" : "#2196F3",
                }}
                onClick={handleToggleWatchlist}
              >
                {isInWatchlist ? (
                  <>
                    <DoneIcon style={{ fontSize: 24, marginRight: "5px"}} />
                    Added to watchlist
                  </>
                ) : (
                  <>
                    <AddCircleOutlineIcon
                      style={{ fontSize: 28, marginRight: "5px" }}
                    />
                    Add to watchlist
                  </>
                )}
              </div>
              <div style={{fontSize: "smaller", marginTop: "10px"}}>     
              {director && director + ", director"} {director && writer && " | "} {writer && writer + ", writer"}
              </div>
              <div style={{marginTop: "10px"}}>
                {/* Display genres as tags */}
                {genres.map((genre) => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    color="primary"
                    variant="outlined"
                    style={{ margin: "2px" }}
                    size="small"
                  />
                ))}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ marginBottom: "20px", marginTop: "20px" }}>
              <Typography variant="h5" style={{ fontWeight: "bold" }}>
                Overview
              </Typography>
              <Typography variant="body1">{overview}</Typography>
            </div>
            <div>
              <YoutubeEmbed embedId={movieTrailer}></YoutubeEmbed>
            </div>
            {/* Movie Credits Section */}
            <div style={{ marginBottom: "20px", marginTop: "20px" }}>
              <Typography variant="h5" style={{ fontWeight: "bold" }}>Cast</Typography>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {mainCast.map((cast) => (
                  <Card
                    key={cast.id}
                    style={{
                      width: "150px",
                      margin: "10px",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "12px",
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)"
                    }}
                  >
                    {cast.profile_path && ( // Only show if there's a profile image
                      <>
                        <CardMedia
                          component="img"
                          height="225"
                          image={ImagesDirectory + cast.profile_path}
                          alt={cast.name}
                          style={{ objectFit: "cover" }}
                        />
                        <CardContent>
                          <Typography
                            variant="subtitle1"
                            style={{
                              fontWeight: "bold",
                              color: cast.department
                                ? "#2196F3" // Apply different color for main roles
                                : "black",
                            }}
                          >
                            {cast.name}
                          </Typography>
                          <Typography variant="body2">
                            {cast.character}
                          </Typography>
                        </CardContent>
                      </>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default MovieDetails;
