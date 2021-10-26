const express = require('express');
const app = express();
const morgan = require ('morgan');
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(morgan('common')); 





let topMovies = [
  {
    title: 'The Shawshank Redemption',
    genre: ['Prison', 'Drama', 'Crime Fiction'],
    director: { name: 'Frank Darabot' },
  },
  {
    title: 'The Godfather',
    genre: ['Mafia', 'Drama', 'Crime Fiction'],
    director: { name: 'Francis Ford Coppoia' },
  },
  {
    title: 'The Godfather: Part II',
    genre: ['Mafia', 'Drama', 'Crime Fiction'],
    director: { name: 'Francis Ford Coppoia' },
  },
  {
    title: '12 Angry Men',
    genre: ['Drama', 'Trial Drama', 'Crime Film'],
    director: { name: 'Sidney Lumet' },
  },
  {
    title: 'Schindlers List ',
    genre: ['War', 'History', 'Black and White'],
    director: { name: 'Steven Spielberg' },
  },
  {
    title: 'The Lord of the Rings: The Return of the King',
    genre: ['Novel', 'Fantasy Fiction', 'Adventure Fiction'],
    director: { name: 'Peter Jackson' },
  },
  {
    title: 'Pulp Fiction',
    genre: ['Comedy', 'Mafia', 'Crime Film'],
    director: { name: 'Quentin Tarantino' },
  },
  {
    title: 'The Good, the Bad and the Ugly',
    genre: ['Spaghetti Western', 'Western', 'Action'],
    director: { name: 'Sergio Leone' },
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    genre: ['Novel', 'Fantasy Fiction', 'Adventure Fiction'],
    director: { name: 'Peter Jackson' },
  },
];

// Register New Users.
let newUsers = [''];

// GET requests
//Get the home page of myFLix App.
app.get('/', (req, res) => {
  res.send('Welcome to myFlix app!');
});

// Get Documentation on Request, URL, and Response formats.
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

// Get a list of all movies to the users.
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/movies/:title', (req, res) => {
  res.send(
    'Successful GET request returning data about a single movies by title to the user.'
  );
});

// Return data about a genre (description) by name/title (e.g., “Thriller”).
app.get('/movies/:title/genre', (req, res) => {
  res.send('Successful GET request returning data about a genre.');
});

// Return data about a director (bio, birth year, death year) by name.
app.get('/movies/director/:name', (req, res) => {
  res.send('Successful GET request returning data about a director.');
});

// POST Request.

// Allow new users to register.
app.post('/newUser', (req, res) => {
  res.send('Successful POST request user was able to register.');
});

// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
app.post('/newUser/:id/favorites', (req, res) => {
  res.send('Successful POST request movie has been added to favorites.');
});

// PUT Request.

// Allow users to update their user info (username, password, email, date of birth).
app.put('/newUser/:id/info', (req, res) => {
  res.send('Successful PUT request user info updated.');
});

// DELETE Request.

// Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
app.delete('/newUser/:id/favorites', (req, res) => {
  res.send(
    'Successful DELETE request movie has been deleted from user list of favorites.'
  );
});

// Allow existing users to deregister
app.delete('/newUser', (req, res) => {
  res.send('Successful DELETE request existing user has been deregistered.');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});