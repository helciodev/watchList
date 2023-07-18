import { ReactElement, useState } from "react";

const apiKey = import.meta.env.VITE_API_KEY;
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

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
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState(tempWatchedData);
  const [query, setQuery] = useState("");

  function handleSearchMovie(e) {
    setQuery(e.target.value);
  }
  return (
    <>
      <Navbar>
        <Logo />
        <Search queryValue={query} setQuery={setQuery} />
        <NumResults />
      </Navbar>
      <main className='main'>
        <Box>
          <MoviesList movies={movies} />
        </Box>
        <Box>
          <WatchedMovies watched={watched} />
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

function Search() {
  return <input type='text' className='search' placeholder='search movie...' />;
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
};

function MoviesList({ movies }: MovieListProps) {
  return (
    <ul className='list list-movies'>
      {movies.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

type MovieProps = {
  movie: { Title: string; Poster: string; Year: string };
};
function Movie({ movie }: MovieProps) {
  const { Poster: poster, Title: title, Year: releaseYear } = movie;
  return (
    <li>
      <img src={poster} alt={`movie ${title}`} />
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

function Summary() {
  return (
    <div className='summary'>
      <h2>movies you watched</h2>
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
  const {
    Poster: poster,
    Title: title,
    imdbRating,
    userRating,
    runtime,
  } = watchedMovie;
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
