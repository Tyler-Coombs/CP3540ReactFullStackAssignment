import React from "react";
import { useState, useRef } from 'react';
import {Link, useLocation, BrowserRoute as Router, Route, Switch} from "react-router-dom";
import navbar from "navbar.js";


export function Home({movies, setMovies}) {
    function Movie( {name, date, actors, poster, rating, onRemove = f => f} ) {
        return (
          <>
            <h2>{name}</h2>
            <img 
                src={process.env.PUBLIC_URL + poster} 
                alt={name + " Movie Poster"}>
            </img>
            <h3>Release Date: {date}</h3>
            <h3>Lead Actors: {(actors).join(", ")}</h3>
            <h3>Rating: {rating} Stars</h3>
            <button onClick={() => onRemove(name)}>Remove</button>
          </>
        );
    }

    function MovieList( { movies = [], onRemoveMovie = f => f}) {
        if (!movies.length) return <div>No movies available.</div>;
        return (
            <>
                {movies.map( movie => (
                    <Movie key={movie.name} {...movie} onRemove={onRemoveMovie} />
                ))}
            </>
        );
    }

    return (
        <>
            <Header />
            <MovieList 
                movies={movies} 
                onRemoveMovie={ name => {
                const newMovies = movies.filter(movie => movie.name !== name);
                setMovies(newMovies);
            }} />
            <Footer year={new Date().getFullYear()}/>
        </>
    );
}

export function AddReview({movies, setMovies}) {
    function AddReviewForm({onNewMovie = f => f}) {
        const txtName = useRef();
        const txtDate = useRef();
        const txtActors = useRef();
        let [poster, setPoster] = useState("");
        const txtRating = useRef();
    
        const submit = e => {
            e.preventDefault();
            const name = txtName.current.value;
            const date = txtDate.current.value;
            const actors = txtActors.current.value;
            const rating = txtRating.current.value;
    
            onNewMovie(name, date, actors.split(", "), poster, rating);
            txtName.current.value = "";
            txtDate.current.value = "";
            txtActors.current.value = [];
            setPoster("");
            txtRating.current.value = 0;
        }

        return (
            <>
                <form onSubmit={submit}>
                    <div>
                        <label>Movie Title:<input ref={txtName} type="text" required /></label>
                    </div>
                    <div>
                        <label>Release Date:<input ref={txtDate} type="text" required /></label>
                    </div>
                    <div>
                        <label>Lead Cast:<input ref={txtActors} type="text" required /></label>
                    </div>
                    <div>
                        <label>Movie Poster:<input type="file" accept=".png,.jfif,.jpg,.jpeg"
                        onChange = {e => setPoster(URL.createObjectURL(e.target.files[0]))} required /></label>
                    </div>
                    <div>
                    <label>Rating:<input ref={txtRating} type="text" required/></label>
                    </div>
                    <div>
                        <input type="submit" value="Submit"></input>
                    </div>
                </form>
            </>
        );
    }

    return (
        <>
            <h1>Add A Review</h1>
            <NavBar />
            <br></br>
            <AddReviewForm onNewMovie={(name, date, actors, poster, rating) => {
                const newMovies= [...movies, {name, date, actors, poster, rating}];
                setMovies(newMovies)
            }}
            />
        </>
    );
}

function NavBar() {
    return(
        <>
        <Router>
            <navbar />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="addreview" exact component={AddReview} />
            </Switch>
        </Router>
        </>
    );
}

function Header() {
    return (
    <>
      <header>
        <h1>Movie Reviews</h1>
        <NavBar />
      </header>
    </>
    );
}
  
function Footer(props) {
    return (
        <>
        <footer>
            <p>Copyright {props.year}</p>
        </footer>
        </>
    );
}

export function Whoops404() {
    let location = useLocation();
    return (
        <>
            <h1>Resource not found at {location.pathname}!</h1>
        </>
    );
}