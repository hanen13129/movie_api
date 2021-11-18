const express = require('express');
const app = express();
const morgan = require ('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const mongoose = require('mongoose');
const models = require('./models.js');
const movies = models.Movie;
const users = models.User;
const Directors = models.Director;
const Genres = models.Genre;
// Using body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');
let allowedOrigins = ['http://localhost:1234'];
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));
 const { check, validationResult } = require('express-validator');

//calling passport and authorization
let auth = require('./auth')(app);
const passport = require('passport');
// const { Module } = require('module');
require('./passport');
//exposing files in 'public' folder
app.use(express.static('public'));
// Logging middleware
app.use(morgan('common')); 
//conntecting to the database 
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// let myLogger = (req, res, next) => {
//   console.log(req.url);
//   next();
// };
// app.use(myLogger)
//Get the home page of myFLix App.
app.get('/', (req, res) => {
  res.send('Welcome to myFlix app!');
});


// Get Documentation on Request, URL, and Response formats.
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

//get list of all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  models.Movie.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Gets the data about a single movie by title
 app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    models.Movie.findOne({Title: req.params.Title})
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ', err);
    });
  });

 //Get a list of all genres
  app.get('/genre',  passport.authenticate('jwt', { session: false }),(req, res) => {
      models.Genre.find()
        .then(genre => {
          res.status(201).json(genre);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
    });

  //get all movies by genre name
  app.get('/movies/genre/:Name', (req, res) => {
    models.Movie.find({ "Genre.Name": req.params.Name})
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });
    //get all movies by Director name
  app.get('/movies/director/:Name', (req, res) => {
    models.Movie.find({ "Director.Name": req.params.Name})
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

     //get genre by name 
  app.get('/genres/:Name', (req, res) => {
    models.Genre.findOne({ "Name": req.params.Name})
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });
  //get director by name 
  app.get('/directors/:Name', (req, res) => {
    models.Director.findOne({ "Name": req.params.Name})
    .then((director) => {
      res.json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });
//get list of all directors
  app.get('/directors', (req, res) => {
    models.Director.find()
      .then((director) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  //get director info by name
  app.get('/director/:Name', (req, res) =>{
    models.Director.findOne({ Name: req.params.Name})
    .then((director) => {
      res.json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

//get all users
  app.get('/users', function (req, res) {
   models.User.find()
    .then(function (users) {
      res.status(201).json(users);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
  });
//adding a new user
app.post('/users',
[ 
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], 
(req, res) => {
  
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  let hashedPassword = models.User.hashPassword(req.body.Password);
  models.User.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists!');
      } else {
        models.User
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


// Get a user by username
app.get('/users/:username', (req, res) => {
  models.User.findOne({ username: req.params.username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// Update a user info, by username
app.put('/users/:username',passport.authenticate("jwt", { session: false }), (req, res) => {
  models.User.findOneAndUpdate({ username: req.params.username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, 
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  models.User.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, 
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Delete a user by username
app.delete('/users/:Username', (req, res) => {
  models.User.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// Delete a movie from the favorite list of an user
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  models.User.findOneAndUpdate({Username: req.params.Username}, {
    $pull: {FavoriteMovies: req.params.MovieID}
  },
  {new: true},
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//adding error-handling middleware
  app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something went wrong. Please try again.');
  });
// listen for requests
// app.listen(8080, () => {
//   console.log('Your app is listening on port 8080.');
// });
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});