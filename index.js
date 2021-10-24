const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
const morgan = require ('morgan');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
// Logging middleware
app.use(morgan('common'));
// For the sending of static files
app.use(express.static('public'));
// Using body-parser
app.use(bodyParser.json());

// An array of objects with  ten movies
let movies = [

  {
    title: 'Movie 1',
    director: 'Director 1',
    year:2001
  },
  {
    title: 'Movie 2',
    director: 'Director 2',
    year:2005
  },
  {
    title: 'Movie 3',
    director: 'Director 3',
    year:2007
  },
  {
    title: 'Movie 4',
    director: 'Director 4',
    year:2020
  },
  {
    title: ' Movie 5',
    director: 'Director 5',
    year:2015
  },
  {
    title: 'Movie 6',
    director: 'Director 6',
    year:2002
  },
  {
    title: 'Movie 7',
    director: 'Director 7',
    year:2009

  },
  {
    title: 'Movie 8',
    director: 'Director 8',
    year:2020
  },
  {
    title: 'Movie 9',
    director: 'Director 9',
    year:2021
  },
   {
    title: 'Movie 10',
    director: 'Director 10',
    year:2018
  },
];

// res.send('Welcome to my movie database!');

// GET requests

app.get('/movies/:title', (req, res) => {
 
  res.json(movies.find((movie) =>{
  return  movie.title === req.params.title
  }))  
}); 
// Add a movie
app.post('/movies', (req, res) => {
  let newMovie = req.body;

  if (!newMovie.title) {
    const message = 'Missing movie title in request body';
    res.status(400).send(message);
  } else {
    newMovie.id = uuid.v4();
    Movies.push(newMovie);
    res.status(201).send(newMovie);
  }
});
// Delet a movie from the list by id
app.delete('/movies/:id', (req, res) => {
  let movie = Movies.find((movie) => {
    return movie.id === req.params.id
  });

  if (movie) {
    Movies = Movies.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('Movie with the ID of ' + req.params.id + ' was deleted.');
  } else {
    res.status(404).send(`Movie with the id ${req.params.id} was not found.`);
  }
});

// Update the year of a movie by title
app.put('/movies/:title/:year', (req, res) => {
  let movie = Movies.find((movie) => {
    return movie.title = req.params.title
  });

  if (movie) {
    movie.year = parseInt(req.params.year);
    res.status(201).send(`Movie ${req.params.title} was assigned the year of ${req.params.year}.`);
  } else {
    res.status(404).send(`Movie wit the title ${req.params.title} was not found.`);
  }
});

// Error handler

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// listen for requests
app.listen(8080, () => {
  console.log('MovieBase is listening in port 8080.');
});