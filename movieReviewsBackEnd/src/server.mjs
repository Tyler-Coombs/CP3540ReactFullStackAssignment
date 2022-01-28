import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/movies', async (req, res) => {

    try {
        const client = await MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true});
        const db = client.db('my-movies');

        const movieInfo = await db.collection('movies').find({}).toArray();
        console.log(movieInfo);
        res.status(200).json(movieInfo);
        client.close();
    }
    catch( error) {
        res.status(500).json( { message: "Error connecting to db", error});
    }
});

app.post('/api/removeMovie', async (req, res) => {
    try {
        console.log(req.body.name);

        const client = await MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true});
        const db = client.db('my-movies');

        let returnVal = await db.collection('movies').deleteOne( {name:req.body.name})
        console.log(returnVal);
        //const movieInfo = await db.collection('movies').find({name:req.params.name}).toArray();
        if( returnVal.deletedCount == 1) {
            res.status(200).json({message: `Movie ${req.body.name} deleted`});
        }
        else {
            res.status(200).json({message: "Unable to delete movie"});
        }
        client.close();
    }
    catch (error) {
        res.status(500).json( { message: "Error connecting to db", error});
    }
});

app.post('/api/addMovie', async (req, res) => {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true});
        const db = client.db('my-movies');

        await db.collection('movies').insertOne( {name:req.body.name, date:req.body.date, actors:req.body.actors,poster:req.body.poster, rating:req.body.rating})

        //const movieInfo = await db.collection('movies').find({name:req.params.name}).toArray();
        
        res.status(200).json({message: "Success"});
        client.close();
    }
    catch( error) {
        res.status(500).json( { message: "Error connecting to db", error});
    }
});

app.get('/api/oneMovie/:name', async (req, res) => {
    console.log(req.params.name);
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true});
        const db = client.db('my-movies');

        const movieInfo = await db.collection('movies').find({name:req.params.name}).toArray();
        console.log(movieInfo);
        res.status(200).json(movieInfo);
        client.close();
    }
    catch( error) {
        res.status(500).json( { message: "Error connecting to db", error});
    }
});

app.listen(8000, () => console.log("Listening on port 8000"));