import React from "react";
import { useState, useRef } from 'react';
import {Link, useLocation, BrowserRoute as Router, Route, Switch} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import {Navbar, Nav } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';



export function Home({movies, setMovies}) {
    function Movie( {name, date, actors, poster, rating, onRemove = f => f} ) {
        return (
          <>
            <Col xs={3}>
              <Row>
                <h3 class="p-3 mb-1 bg-dark text-white">{name}</h3>
              </Row>
              <Row>
                <Image rounded="true" src={poster} alt={name + " Movie Poster"}
                width={900} length={1200}>
                </Image>
              </Row>
              <Row>
                <h3 class="p-3 mb-1 bg-dark text-white">Release Date: {date}</h3>
              </Row>
              <Row>
                <h3 class="p-3 mb-1 bg-dark text-white">Lead Actors: {(actors).join(", ")}</h3>
              </Row>
              <Row>
                <h3 class="p-3 mb-1 bg-dark text-white">Rating: {rating} Stars</h3>
              </Row>
              <Row>
                <Button onClick={() => onRemove(name)}>Remove</Button>
              </Row>
            </Col>
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
            <Container fluid>
                <Row className="justify-content-center">
                    <MovieList 
                        movies={movies} 
                        onRemoveMovie={ name => {
                        const newMovies = movies.filter(movie => movie.name !== name);
                        setMovies(newMovies);
                    }} />
                </Row>
            </Container>
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
            <div>
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand href="/">Navigation</Navbar.Brand>
                        <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="addreview">Add Review</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            </div>
            <br></br>
            <AddReviewForm onNewMovie={(name, date, actors, poster, rating) => {
                const newMovies= [...movies, {name, date, actors, poster, rating}];
                setMovies(newMovies)
            }}
            />
        </>
    );
}

function Header() {
    return (
    <>
      <header>
        <h1 class='display-2'>Movie Reviews</h1>
        <div>
        <Navbar bg="dark" variant="dark">
            <Container className="justify-content-center">
            <Navbar.Brand href="/">Navigation</Navbar.Brand>
            <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="addreview">Add Review</Nav.Link>
            </Nav>
            </Container>
        </Navbar>
        </div>
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