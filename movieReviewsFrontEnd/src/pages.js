import React from "react";
import { useState, useRef } from 'react';
import { useLocation, Link, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import {Navbar, Nav } from 'react-bootstrap';
import {Form, Button} from 'react-bootstrap';
import { Collapse } from "react-bootstrap";
import { House, PlusLg, Trash, InfoSquare } from "react-bootstrap-icons";
import RangeSlider from 'react-bootstrap-range-slider';



export function Home({movies, setMovies}) {

    function Movie( {name, date, actors, poster, rating, onRemove = f => f} ) {
        const [open, setOpen] = useState(false);

        return (
          <>
            <Col xs={3} md={4}>
                
                
                <Row>
                    <h3 className="">{name}</h3>
                </Row>
              <Row>
                <Image 
                className="border" 
                rounded 
                src={poster} alt={name + " Movie Poster"}>
                </Image>
              </Row>
              <Button
                    onClick={() => setOpen(!open)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open}
                    size='lg'
                >
                    <InfoSquare /> Movie Info
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
                <Button size= 'lg' variant='danger' onClick={ evt => onRemove(name)}><Trash /> Remove</Button>
              </Row>
            </Col>
          </>
        );
    };

    function MovieList( { movies = [], onRemoveMovie = f => f}) {
        if (!movies.length) return <div>No movies available.</div>;
        return (
            <>
                {movies.map( movie => (
                    <Movie key={movie.name} {...movie} onRemove={onRemoveMovie} />
                ))}
            </>
        );
    };

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
                        onRemoveMovie={ 
                            name => {
                            const removeMovie = async () => {
                                const movieRemoved = await fetch("/api/removeMovie", 
                                    {method: "post", 
                                    body: JSON.stringify({name: name}),
                                    headers: {"Content-Type": "application/json"}
                                    });
                                const body = await movieRemoved.json();
                                if (body.message !== "Unable to delete movie") {
                                    const newMovies = movies.filter(movie => movie.name !== name);
                                    setMovies(newMovies);
                                }
                            }
                            removeMovie();
                        }
                    } />
                </Row>
            </Container>
            </div>
            <Footer year={new Date().getFullYear()}/>
        </>
    );
}

export function AddReview({movies, setMovies}) {
    const formData = new FormData();
    function AddReviewForm({onNewMovie = f => f}) {
        const txtName = useRef();
        const txtDate = useRef();
        const txtActors = useRef();
        let [poster, setPoster] = useState("");
        const [rating, setRating] = useState(3);
    
        
        const submit = e => {
            e.preventDefault();
            const name = txtName.current.value;
            const date = txtDate.current.value;
            const actors = txtActors.current.value;

            formData.append("name", name);
            formData.append("date", date);
            formData.append("actors", [actors.split(",")])
            formData.append("poster", poster);
            formData.append("rating", rating);
    
            onNewMovie(formData);
            txtName.current.value = "";
            txtDate.current.value = "";
            txtActors.current.value = [];
            setPoster("");
            setRating(3);

            console.log(formData.get("name"));
        }

        
        return (
            <>
            <Container>
                <Row className="justify-content-center">
                    <Col>
                        <Form onSubmit={submit} encType="multipart/form-data" method="post">
                            <div>
                                <label className="form-label h4">Movie Poster:<input className="form-control" type="file" accept=".png,.jfif,.jpg,.jpeg"
                                onChange = {e => setPoster("poster", e.target.files[0])} required /></label>
                            </div>
                            <div>
                                <label className="form-label h4">Movie Title:<input className="form-control" ref={txtName} type="text" required /></label>
                            </div>
                            <div>
                                <label className="form-label h4">Release Date:<input className="form-control" ref={txtDate} type="text" required /></label>
                            </div>
                            <div>
                                <label className="form-label h4">Lead Cast:<input className="form-control" ref={txtActors} type="text" required /></label>
                            </div>
                            <Form.Group as={Row}>
                                <Form.Label className="h4">
                                    Rating
                                </Form.Label>
                                <RangeSlider
                                    min={1}
                                    max={5}
                                    step={0.1}
                                    value={rating}
                                    onChange={e => setRating(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="h4"><PlusLg /> Submit</Button>
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
        <Image src="/images/movie-reviews-logo.png"></Image>
            <h1 className='display-3'>Add Your Review</h1>
            <div>
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand href="/">Navigation</Navbar.Brand>
                        <Nav className="me-auto">
                        <Nav.Link href="/"><House /> Home</Nav.Link>
                        <Nav.Link href="/addreview"><PlusLg /> Add Review</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            </div>
            </header>
            
            <div className="bg-secondary text-white">
            <AddReviewForm onNewMovie={(formData) => {
                const newMovie = async () => {
                    const movieAdded = await fetch("/api/addMovie", {
                        method: "post",
                        body: formData
                    });
                    const body = await movieAdded.json();
                    if (body.message === "Success") {
                        setMovies(body.movies)
                    }
                }
                newMovie();
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
        <Image src="/images/movie-reviews-logo.png"></Image>
        <div>
        <Navbar bg="dark" variant="dark">
            <Container className="justify-content-center">
            <Navbar.Brand href="/">Navigation</Navbar.Brand>
            <Nav className="me-auto">
            <Nav.Link href="/"><House /> Home</Nav.Link>
            <Nav.Link href="/addreview"><PlusLg /> Add Review</Nav.Link>
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