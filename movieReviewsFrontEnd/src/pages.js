import React from "react";
import { useState, useRef } from 'react';
import {Link, useLocation, BrowserRoute as Router, Route, Switch} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import {Navbar, Nav } from 'react-bootstrap';
import {Form, FormControl, FormGroup, ControlLabel, HelpBlock, Button} from 'react-bootstrap';
import { Collapse } from "react-bootstrap";



export function Home({movies, setMovies}) {
    function Movie( {name, date, actors, poster, rating, onRemove = f => f} ) {
        const [open, setOpen] = useState(false);

        return (
          <>
            <Col xs={3}>
                
                
                <Row>
                    <h3 >{name}</h3>
                </Row>
              <Row>
                <Image rounded="true" src={poster} alt={name + " Movie Poster"}
                width={900} length={1200}>
                </Image>
              </Row>
              <Button
                    onClick={() => setOpen(!open)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open}
                    size='lg'
                >
                    Movie Info
                </Button>
                <Collapse in={open}>
                    <div id="example-collapse-text">
              <Row>
                <p className="fs-4 text-start">Release Date: {date}</p>
              </Row>
              <Row>
                <p className="fs-4 text-start">Lead Actors: {(actors).join(", ")}</p>
              </Row>
              <Row>
                <p className="fs-4 text-start">Rating: {rating} Stars</p>
              </Row>
              
              </div>
              </Collapse>
              <Row xs={3} className="justify-content-md-center">
                <Button variant='danger' onClick={() => onRemove(name)}>Remove</Button>
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
            <div className="bg-secondary text-white">
            <Container fluid>
                <Row>
                    <p className="h2 "></p>
                </Row>
                <Row className="justify-content-center">
                    <MovieList 
                        movies={movies} 
                        onRemoveMovie={ name => {
                        const newMovies = movies.filter(movie => movie.name !== name);
                        setMovies(newMovies);
                    }} />
                </Row>
            </Container>
            </div>
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
            <Container>
                <Row className="justify-content-center">
                    <Col>
                        <Form onSubmit={submit}>
                            <div>
                                <label className="form-label">Movie Poster:<input className="form-control" type="file" accept=".png,.jfif,.jpg,.jpeg"
                                onChange = {e => setPoster(URL.createObjectURL(e.target.files[0]))} required /></label>
                            </div>
                            <div>
                                <label className="form-label">Movie Title:<input className="form-control" ref={txtName} type="text" required /></label>
                            </div>
                            <div>
                                <label className="form-label">Release Date:<input className="form-control" ref={txtDate} type="text" required /></label>
                            </div>
                            <div>
                                <label className="form-label">Lead Cast:<input className="form-control" ref={txtActors} type="text" required /></label>
                            </div>
                            <div>
                            <label className="form-label">Rating:<input className="form-control" ref={txtRating} type="text" required/></label>
                            </div>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
            </>
        );
    }

    return (
        <>
        <header className="bg-dark text-white">
            <h1 className='display-3'>Add A Review</h1>
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
            </header>
            
            <div className="bg-secondary text-white">
            <AddReviewForm onNewMovie={(name, date, actors, poster, rating) => {
                const newMovies= [...movies, {name, date, actors, poster, rating}];
                setMovies(newMovies)
            }}
            />
            </div>
        </>
    );
}

function Header() {
    return (
    <>
      <header className="bg-dark text-white">
        <h1 className='display-3'>Movie Reviews</h1>
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
        <footer className="bg-secondary text-white">
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