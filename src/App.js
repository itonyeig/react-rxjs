import React, { useState, useEffect } from "react";

import MoviesList from "./components/MoviesList";

import { ajax } from "rxjs/ajax";
import { map, catchError, tap } from "rxjs/operators";
import "./App.css";

const movies$ = ajax.getJSON("https://swapi.dev/api/films/").pipe(
  map((data) => {
    const { results } = data;
    const movieData = results.map((movieData) => ({
      id: movieData.episode_id,
      title: movieData.title,
      openingText: movieData.opening_crawl,
      releaseDate: movieData.release_date,
    }));
    return movieData;
  }),
  tap(console.log)
  // catchError((error) => {
  //   console.log(error);
  //   return EMPTY;
  // })
);
function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState("");
  function fetchMovies() {
    setIsLoading(true);
    setInfo("loading...");
    movies$.subscribe({
      next: (res) => setMovies(res),
      error: (err) => {
        setInfo("Error occured, check console");
        console.log(err);
      },
      complete: () => setIsLoading(false),
    });
  }
  // useEffect(() => {
  //   const subscription = movies$.subscribe(setMovies);
  //   return () => subscription.unsubscribe();
  // }, []);

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section>
        {isLoading && <p>{info}</p>}
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;
