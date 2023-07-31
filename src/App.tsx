import { ReactElement, useEffect, useRef, useState } from "react";
import NA from "/gr-stocks-q8P8YoR6erg-unsplash.jpg";
import { Player } from "@lottiefiles/react-lottie-player";
const apiKey = import.meta.env.VITE_API_KEY;
import loader from "./assets/movieLoadingAnimation.json";
import Rating from "./Rating";
import useLocalStorageState from "./useLocalStorageState";

function averageCalc(arr: any[] | undefined): number {
  return arr.reduce(
    (acc: number, cur: number, arr: string | any[]) => acc + cur / arr.length,
    0
  );
}

type ToWatchMovie = {
  imdbId: string;
  imdbRating: string;
  plot: string;
  poster: string;
  runtime: string;
  title: string;
  userRating?: number;
};

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

interface Data {
  Search: Movie[];
  totalResults: string;
  Response: string;
}
function App() {
  const [movies, setMovies] = useState([]);

  const [toWatch, setToWatch] = useLocalStorageState([], "toWatch");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const numMoviesResults = movies?.length;
  console.log(movies);

  function handleCloseSelected() {
    setSelectedMovie(null);
  }

  function handleDeleteMovieToWatch(id: string) {
    setToWatch((curr: ToWatchMovie[]) =>
      curr.filter((movie: { imdbId: string }) => movie.imdbId !== id)
    );
  }

  function handleDeleteWatchedMovie(id: string) {
    setWatched((current: ToWatchMovie[]) =>
      current.filter((movie: { imdbId: string }) => movie.imdbId !== id)
    );
  }

  useEffect(() => {
    async function fetchMovies(): Promise<void> {
      try {
        setIsLoading((crr) => !crr);
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
        );

        const data = await response.json();

        const { Search: search } = data;

        setMovies(search);
        setIsLoading((curre) => !curre);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMovies();
  }, [query]);

  return (
    <>
      <Navbar>
        <Logo />
        <Search
          queryValue={query}
          setQuery={setQuery}
          onCloseSelected={handleCloseSelected}
        />
        <NumResults numMoviesResults={numMoviesResults} />
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
              watched={watched}
              setWatched={setWatched}
              selectedMovie={selectedMovie}
              setSelectedMovie={setSelectedMovie}
              setToWatch={setToWatch}
              onCloseSelected={handleCloseSelected}
              toWatch={toWatch}
            />
          ) : (
            <>
              <SummaryWatched
                heading='Movies you watched'
                watchedList={watched}
              />
              <WatchedMovies
                watched={watched}
                onDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
        <Box>
          <>
            <SummaryToWatch
              heading='Movies on your to watch list'
              toWatchList={toWatch}
            />
            <MoviesToWatch
              toWatch={toWatch}
              onDeleteMovieToWatch={handleDeleteMovieToWatch}
            />
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
function Search({ queryValue, setQuery, onCloseSelected }: SearchProps) {
  const inputRef = useRef(null);
  function handleQuery(e: InputEvent) {
    setQuery(e.target.value);
  }

  useEffect(() => {
    const enterKeyEvent = (e: React.KeyboardEvent) => {
      if (e.code === "Enter") {
        inputRef.current.focus();
        setQuery("");
        onCloseSelected();
      }
    };
    document.addEventListener("keydown", enterKeyEvent);
    console.log("inside event");

    return function () {
      document.removeEventListener("keydown", enterKeyEvent);
    };
  }, [onCloseSelected]);
  return (
    <input
      type='text'
      className='search'
      value={queryValue}
      onChange={handleQuery}
      placeholder='search movie...'
      ref={inputRef}
    />
  );
}
type NumResultsProps = {
  numMoviesResults: number;
};
function NumResults({ numMoviesResults }: NumResultsProps) {
  return (
    numMoviesResults && (
      <p className='num-results'> Found {numMoviesResults} movies</p>
    )
  );
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
    <li
      onClick={() =>
        setSelectedMovie((currentSelected: string) =>
          currentSelected === imdbId ? null : imdbId
        )
      }
    >
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

type SummaryProps = {
  heading: string;
  watchedList: {
    title: string;
    runtime: string;
    userRating: number;
    imdbRating: string;
    poster: string;
    imdbId: string;
  }[];
  toWatchList?: {
    title: string;
    runtime: string;
    imdbRating: string;
    poster: string;
    plot: string;
    imdbId: string;
  }[];
};

function SummaryWatched({ heading, watchedList }: SummaryProps) {
  const averageUserRating = averageCalc(
    watchedList?.map((el) => Number(el.userRating))
  );

  const averageUserWatchedMin = averageCalc(
    watchedList?.map((movie) => Number(movie.runtime.split(" ")[0]))
  );

  return (
    <div className='summary'>
      <h2>{heading}</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watchedList?.length}</span>
        </p>

        <p>
          <span> 🌟 </span>
          <span>{averageUserRating.toFixed(2)}</span>
        </p>

        <p>
          <span> ⏳</span>
          <span>{averageUserWatchedMin.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function SummaryToWatch({ heading, toWatchList }: SummaryProps) {
  const averageImdbRating = averageCalc(
    toWatchList?.map((movie) => Number(movie.imdbRating))
  );

  const averageToWatchMin = averageCalc(
    toWatchList?.map((movie) => Number(movie.runtime.split(" ")[0]))
  );

  return (
    <div className='summary'>
      <h2>{heading}</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{toWatchList?.length}</span>
        </p>

        <p>
          <span>⭐️</span>
          <span>{averageImdbRating.toFixed(2)}</span>
        </p>

        <p>
          <span> ⏳</span>
          <span>{averageToWatchMin.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}
type WatchedMoviesProps = {
  watched: {
    title: string;
    runtime: string;
    userRating: number;
    imdbRating: string;
    poster: string;
    imdbId: string;
  }[];
  onDeleteWatchedMovie: () => void;
};

function WatchedMovies({ watched, onDeleteWatchedMovie }: WatchedMoviesProps) {
  return (
    <ul className='list'>
      {watched?.map((movie) => (
        <WatchedMovie
          key={movie.imdbId}
          watchedMovie={movie}
          onDeleteWatchedMovie={onDeleteWatchedMovie}
        />
      ))}
    </ul>
  );
}

type WatchedMovieProps = {
  watchedMovie: {
    title: string;
    runtime: string;
    userRating: number;
    imdbRating: string;
    poster: string;
    imdbId: string;
  };
  onDeleteWatchedMovie: (id: string) => void;
};
function WatchedMovie({
  watchedMovie,
  onDeleteWatchedMovie,
}: WatchedMovieProps) {
  const { poster, title, imdbRating, userRating, runtime, imdbId } =
    watchedMovie;

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
          <span>{runtime}</span>
        </p>
        <button
          onClick={() => onDeleteWatchedMovie(imdbId)}
          className='btn-delete'
        >
          X
        </button>
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
  watched: {
    imdbId: string;
    Title: string;
    Year: string;
    Poster: string;
    imdbRating: number;
    userRating: number;
    runtime: number;
  }[];
  setWatched: () => void;
  setSelectedMovie: () => void;
  setToWatch: () => void;
  onCloseSelected: () => void;
  toWatch: {
    title: string;
    runtime: string;
    imdbRating: string;
    poster: string;
    plot: string;
    imdbId: string;
  }[];
};

type FetchedSelectedMovie = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: [{ Source: string; Value: string }];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  Production: string;
  Website: string;
  Response: string;
};
function PresentSelectedMovie({
  selectedMovie,
  setWatched,
  setSelectedMovie,
  setToWatch,
  watched,
  onCloseSelected,
  toWatch,
}: PresentSelectedMovieProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedSelectedMovie, setFetchedSelectedMovie] =
    useState<FetchedSelectedMovie>({});
  const [userRating, setUserRating] = useState(0);
  const [watchedMovie, setWatchedMovie] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(null);
  const [movieToWatch, setMovieToWatch] = useState(null);

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
    imdbID: imdbId,
  } = fetchedSelectedMovie;
  console.log(fetchedSelectedMovie);

  function handleAddWatched() {
    const newWatchedMovie = {
      title,
      runtime,
      userRating,
      imdbRating,
      poster,
      plot,
      imdbId,
    };

    const wasWatched = watched.find(
      (movie) => movie.imdbId === newWatchedMovie.imdbId
    );
    if (wasWatched) {
      setAlreadyRated(wasWatched);
      setUserRating(0);
      return;
    }

    setWatched((currentWatched: any) => [...currentWatched, newWatchedMovie]);
    setSelectedMovie(null);
  }

  function handleToWatch() {
    const newMovieToWatch = {
      title,
      runtime,
      imdbRating,
      poster,
      plot,
      imdbId,
    };

    setToWatch((current: any) => [...current, newMovieToWatch]);
    onCloseSelected();
  }

  useEffect(() => {
    function keyDownEvent(e: React.KeyboardEvent) {
      console.log(e);

      if (e.code === "Escape") onCloseSelected();
    }
    document.addEventListener("keydown", keyDownEvent);

    return function () {
      document.removeEventListener("keydown", keyDownEvent);
    };
  }, [onCloseSelected]);

  useEffect(() => {
    const wasWatched = watched?.find((movie) => movie.imdbId === selectedMovie);
    setAlreadyRated(wasWatched);

    const isToWatch = toWatch.find((movie) => movie.imdbId === selectedMovie);
    setMovieToWatch(isToWatch);
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
  }, [selectedMovie, watched, toWatch]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className='details'>
      <header>
        <button onClick={onCloseSelected} className='btn-back'>
          &larr;
        </button>
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
      {alreadyRated ? (
        <section>
          <div className='rating'>
            you already rated this movie {alreadyRated.userRating}
          </div>
        </section>
      ) : movieToWatch ? (
        <section>
          <div className='rating'>
            {movieToWatch.title} is already on your watch list
          </div>
        </section>
      ) : (
        <section>
          {!watchedMovie && (
            <div className='watch-watched'>
              <button
                className='btn-watched'
                onClick={() => setWatchedMovie(true)}
              >
                watched
              </button>
              <button className='btn-to-watch' onClick={handleToWatch}>
                to watch
              </button>
            </div>
          )}
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
      )}
    </div>
  );
}

type MoviesToWatchProps = {
  toWatch: {
    title: string;
    runtime: string;
    imdbRating: string;
    poster: string;
    plot: string;
    imdbId: string;
  }[];
  onDeleteMovieToWatch: (id: string) => void;
};

function MoviesToWatch({ toWatch, onDeleteMovieToWatch }: MoviesToWatchProps) {
  return (
    <ul className='list'>
      {toWatch?.map((movie) => (
        <MovieToWatch
          movieToWatch={movie}
          onDeleteMovieToWatch={onDeleteMovieToWatch}
          key={movie.imdbId}
        />
      ))}
    </ul>
  );
}

type MovieToWatchProps = {
  movieToWatch: {
    title: string;
    runtime: string;
    imdbRating: string;
    poster: string;
    plot: string;
    imdbId: string;
  };
  onDeleteMovieToWatch: (id: string) => void;
};

function MovieToWatch({
  movieToWatch,
  onDeleteMovieToWatch,
}: MovieToWatchProps) {
  const [showMore, setShowMore] = useState(false);
  const { poster, title, imdbRating, runtime, plot, imdbId } = movieToWatch;
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
          <span>⏳</span>
          <span>{runtime}</span>
        </p>
        <button
          className='btn-plot'
          onClick={() => setShowMore((currentState) => !currentState)}
        >
          ...{!showMore ? "more" : "less"}
        </button>
        <button
          onClick={() => onDeleteMovieToWatch(imdbId)}
          className='btn-delete'
        >
          X
        </button>
      </div>
      {showMore && (
        <p
          style={{
            width: "100%",

            gridColumn: "1/ -1",
            marginTop: "20px",
          }}
        >
          {plot}
        </p>
      )}
    </li>
  );
}
