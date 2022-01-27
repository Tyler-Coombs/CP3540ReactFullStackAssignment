import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import { Home, AddReview, Whoops404 } from "./pages";



function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
  fetch('./api/movies')
    .then((response) => response.json())
    .then(setMovies)
  }, []);
  console.log(movies);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home movies={movies} setMovies={setMovies} />} />
        <Route path="addreview" element={<AddReview movies={movies} setMovies={setMovies} />} />
        <Route path="*" element={<Whoops404 />} />
      </Routes>
    </div>
  );
}



export default App;
