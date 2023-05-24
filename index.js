const express = require("express"),
morgan = require("morgan"),
fs = require("fs"),
path = require("path");

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {flags: "a"});
const app = express();

//temporary hard coded list
let topTen = [
    {
        Title: "Lord of the Rings",
        Genre: "Fantasy"
    },
    {
        Title: "Two Towers",
        Genre: "Fantasy"
    },
    {
        Title: "Return of the King",
        Genre: "Fantasy"
    },
    {
        Title: "Star Wars: A New Hope",
        Genre: "Sci-Fi"
    },
    {
        Title: "Star Wars: Empire Strikes Back",
        Genre: "Sci-Fi"
    },
    {
        Title: "Rogue One: A Star War Story",
        Genre: "Sci-Fi"
    },
    {
        Title: "Star Wars: Revenge of the Sith",
        Genre: "Sci-Fi"
    },
    {
        Title: "Groundhog Day",
        Genre: "Comedy"
    },
    {
        Title: "Star Wars: Return of the Jedi",
        Genre: "Sci-fi"
    },
    {
        Title: "Indiana Jones and the Last Crusade",
        Genre: "Action"
    }
];

//Logging code
app.use(morgan('combined', {stream: accessLogStream}));

// landing page code
app.get('/', (req, res) => {
    res.send('Welcome to my app! You can also visit /movies and /documentation.html');
  });

  //pulls list of movies
app.get('/movies', (req, res) => {
    res.json(topTen);
  });

app.use(express.static("public"));

// error flag code
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });

  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

  