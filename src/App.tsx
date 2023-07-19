import { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import NA from "/gr-stocks-q8P8YoR6erg-unsplash.jpg";
import { Player } from "@lottiefiles/react-lottie-player";
const apiKey = import.meta.env.VITE_API_KEY;
import loader from "./assets/movieLoadingAnimation.json";
import Rating from "./Rating";

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [toWatch, setToWatch] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  console.log(selectedMovie);

  useEffect(() => {
    async function fetchMovies() {
      setIsloading((crr) => !crr);
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
      );

      const data = await response.json();
      const { Search: search } = data;
      setMovies(search);
      setIsloading((curre) => !curre);
    }

    fetchMovies();
  }, [query]);

  return (
    <>
      <Navbar>
        <Logo />
        <Search queryValue={query} setQuery={setQuery} />
        <NumResults />
      </Navbar>
      <main className='main'>
        <Box>
          {isLoading ? (
            <Loader />
          ) : (
            <MoviesList setSelectedMovie={setSelectedMovie} movies={movies} />
          )}
        </Box>
        <Box>
          {selectedMovie ? (
            <PresentSelectedMovie
              setWatched={setWatched}
              selectedMovie={selectedMovie}
              setSelectedMovie={setSelectedMovie}
              setToWatch={setToWatch}
            />
          ) : (
            <>
              <Summary heading='Movies you watched' />
              <WatchedMovies watched={watched} />
            </>
          )}
        </Box>
        <Box>
          <>
            <Summary heading='Movies on your to watch list' />
            <MoviesToWatch toWatch={toWatch} />
          </>
        </Box>
      </main>
    </>
  );
}

export default App;

type NavbarProps = {
  children: ReactElement[];
};
function Navbar({ children }: NavbarProps) {
  return <nav className='nav-bar'>{children}</nav>;
}

function Logo() {
  return (
    <div className='logo'>
      <span>📽</span>
      <h1>watchList</h1>
    </div>
  );
}

type SearchProps = {
  queryValue: string;
  setQuery: (value: string) => void;
};
function Search({ queryValue, setQuery }: SearchProps) {
  function handleQuery(e: InputEvent) {
    setQuery(e.target.value);
  }
  return (
    <input
      type='text'
      className='search'
      value={queryValue}
      onChange={handleQuery}
      placeholder='search movie...'
    />
  );
}

function NumResults() {
  return <p className='num-results'>found 0 results</p>;
}

type BoxProps = {
  children: ReactElement | ReactElement[];
};
function Box({ children }: BoxProps) {
  const [isToggleOpen, setIsToggleOpen] = useState(true);
  return (
    <div className='box'>
      <button
        onClick={() => setIsToggleOpen((curr) => !curr)}
        className='btn-toggle'
      >
        {isToggleOpen ? "-" : "+"}
      </button>
      {isToggleOpen && children}
    </div>
  );
}

type MovieListProps = {
  movies: { imdbID: string; Year: string; Poster: string; Title: string }[];
  setSelectedMovie: (id: string) => void;
};

function MoviesList({ movies, setSelectedMovie }: MovieListProps) {
  return (
    <ul className='list list-movies'>
      {movies?.map((movie) => (
        <Movie
          key={movie.imdbID}
          movie={movie}
          setSelectedMovie={setSelectedMovie}
        />
      ))}
    </ul>
  );
}

type MovieProps = {
  movie: { Title: string; Poster: string; Year: string; imdbID: string };
  setSelectedMovie: (id: string) => void;
};
function Movie({ movie, setSelectedMovie }: MovieProps) {
  const {
    Poster: poster,
    Title: title,
    Year: releaseYear,
    imdbID: imdbId,
  } = movie;
  return (
    <li onClick={() => setSelectedMovie(imdbId)}>
      <img src={poster !== "N/A" ? poster : NA} alt={`movie ${title}`} />
      <h3>{title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{releaseYear}</span>
        </p>
      </div>
    </li>
  );
}

function Summary({ heading }) {
  return (
    <div className='summary'>
      <h2>{heading}</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{tempWatchedData.length}</span>
        </p>
        <p>
          <span> ⭐️</span>
          <span>7.45</span>
        </p>
        <p>
          <span> ⏳</span>
          <span>149.5 min</span>
        </p>
      </div>
    </div>
  );
}

type WatchedMoviesProps = {
  watched: {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
    imdbRating: number;
    userRating: number;
    runtime: number;
  }[];
};
function WatchedMovies({ watched }: WatchedMoviesProps) {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedMovie key={movie.imdbID} watchedMovie={movie} />
      ))}
    </ul>
  );
}

type WatchedMovieProps = {
  watchedMovie: {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
    imdbRating: number;
    userRating: number;
    runtime: number;
  };
};
function WatchedMovie({ watchedMovie }: WatchedMovieProps) {
  console.log(watchedMovie);

  const { poster, title, imdbRating, userRating, runtime } = watchedMovie;
  return (
    <li>
      <img src={poster} alt={`${title} poster`} />
      <h3>{title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{runtime} min</span>
        </p>
        <button className='btn-delete'>X</button>
      </div>
    </li>
  );
}

function Loader() {
  return (
    <Player
      style={{ width: "350px", height: "350px" }}
      loop
      autoplay
      src={loader}
    />
  );
}

type PresentSelectedMovieProps = {
  selectedMovie: string;
};
function PresentSelectedMovie({
  selectedMovie,
  setWatched,
  setSelectedMovie,
  setToWatch,
}: PresentSelectedMovieProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedSelectedMovie, setFetchedSelectedMovie] = useState({});
  const [userRating, setUserRating] = useState(0);
  const [watchedMovie, setWatchedMovie] = useState(false);

  const {
    Poster: poster,
    Actors: actors,
    Plot: plot,
    imdbRating,
    Released: released,
    Runtime: runtime,
    Title: title,
    Genre: genre,
    Director: director,
  } = fetchedSelectedMovie;

  function handleAddWatched() {
    const newWatchedMovie = {
      title,
      runtime,
      userRating,
      imdbRating,
      poster,
    };

    setWatched((currentWatched) => [...currentWatched, newWatchedMovie]);
    setSelectedMovie(null);
  }

  function handleToWatch() {
    const newMovieToWatch = {
      title,
      runtime,
      userRating,
      imdbRating,
      poster,
    };

    setToWatch((current) => [...current, newMovieToWatch]);
  }

  useEffect(() => {
    async function fetchSelectedMovie() {
      setIsLoading(true);
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${apiKey}&i=${selectedMovie}`
      );

      const data = await response.json();

      setFetchedSelectedMovie(data);
      setIsLoading(false);
    }

    fetchSelectedMovie();
  }, [selectedMovie]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className='details'>
      <header>
        <button className='btn-back'>&larr;</button>
        <img src={poster} alt={`${title} poster`} />
        <div className='details-overview'>
          <h2>{title}</h2>
          <p>
            <span>{released}</span>
            <span>{runtime}</span>
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐️</span> <span>{imdbRating} IMDB rating</span>
          </p>
        </div>
      </header>
      <section>
        <div>
          <button onClick={() => setWatchedMovie(true)}>watched</button>
          <button onClick={handleToWatch}>to watch</button>
        </div>
        {watchedMovie && (
          <div className='rating'>
            <Rating
              maxRating={10}
              onRating={setUserRating}
              color='#FCC419'
              textColor='#b68c0e'
              size={16}
            />
            {userRating ? (
              <button onClick={handleAddWatched} className='btn-add'>
                Add watched movie
              </button>
            ) : (
              ""
            )}
          </div>
        )}

        <p>
          {" "}
          <em>{plot}</em>
        </p>
        <p>Starring: {actors}</p>
        {director !== "N/A" ? <p>Directed by: {director}</p> : ""}
      </section>
    </div>
  );
}

function MoviesToWatch({ toWatch }) {
  return (
    <ul>
      {toWatch?.map((movie) => (
        <WatchedMovie watchedMovie={movie} />
      ))}
    </ul>
  );
}
