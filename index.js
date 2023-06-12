const express = require("express"),
morgan = require("morgan"),
fs = require("fs"),
path = require("path"),
uuid = require("uuid"),
bodyParser = require('body-parser');

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {flags: "a"});
const app = express();

//temporary hard coded list
let movies = [
    {
        "Title": "Lord of the Rings",
        "Description": "To be Added later.",
        "Genre": { 
            "Name": "Fantasy",
            "Description": "Elves, magic and dragons!"        
        },
        "Director": {
            "Name": "Peter Jackson",
            "Bio": "Some guy",
            "DOB": "01/01/01"
    },
        "imgURL": "#",
        "Featured": true
    },
    {
        "Title": "Two Towers",
        "Description": "To be Added later.",
        "Genre": { 
            "Name": "Fantasy",
            "Description": "Elves, magic and dragons!"        
        },
        "Director": {
            "Name": "Peter Jackson",
            "Bio": "Some guy",
            "DOB": "01/01/01"
        },
        "imgURL": "#",
        "Featured": true
        
    },
    {
        "Title": "Return of the King",
        "Description": "To be Added later.",
        "Genre": { 
            "Name": "Fantasy",
            "Description": "Elves, magic and dragons!"        
        },
        "Director": {
            "Name": "Peter Jackson",
            "Bio": "Some guy",
            "DOB": "01/01/01"
        },
        "imgURL": "#",
        "Featured": true
    },
    {
        "Title": "Star Wars: A New Hope",
        "Description": "To be Added later.",
        "Genre": { 
            "Name": "Sci-Fi",
            "Description": "Space!"             
        },
        "Director": {
            "Name": "George Lucas",
            "Bio": "Some guy",
            "DOB": "01/01/01"
        },
        "imgURL": "#",
        "Featured": true
    },
    {
        "Title": "Star Wars: Empire Strikes Back",
        "Description": "To be Added later.",
        "Genre": { 
            "Name": "Sci-Fi",
            "Description": "Space!"             
        },
        "Director": {
            "Name": "Not George Lucas",
            "Bio": "Some guy",
            "DOB": "01/01/01"
        },
        "imgURL": "#",
        "Featured": true
    },
    {
        "Title": "Rogue One: A Star War Story",
        "Description": "To be Added later.",
        "Genre": { 
            "Name": "Sci-Fi",
            "Description": "Space!"            
        },
        "Director": {
            "Name": "Not George Lucas",
            "Bio": "Some guy",
            "DOB": "01/01/01"
        },
        "imgURL": "#",
        "Featured": true
    },
    {
        "Title": "Star Wars: Revenge of the Sith",
        "Description": "To be Added later.",
        "Genre": { 
            "Name": "Sci-Fi",
            "Description": "Space!"            
        },
        "Director": {
            "Name": "Not George Lucas",
            "Bio": "Some guy",
            "DOB": "01/01/01"
        },
        "imgURL": "#",
        "Featured": true
    },
    {
        "Title": "Groundhog Day",
        "Description": "To be Added later.",
        "Genre": { 
            "Name": "Comedy",
            "Description": "Laughter!"        
        },
        "Director": {
            "Name": "Unknown",
            "Bio": "Some guy",
            "DOB": "01/01/01"
        },
        "imgURL": "#",
        "Featured": true
    },
    {
        "Title": "Star Wars: Return of the Jedi",
        "Description": "To be Added later.",
        "Genre": { 
            Name: "Sci-Fi",
            "Description": "Space!"        
        },
        "Director": {
            "Name": "Not George Lucas",
            "Bio": "Some guy",
            "DOB": "01/01/01"
        },
        "imgURL": "#",
        "Featured": true
    },
    {
        "Title": "Indiana Jones and the Last Crusade",
        "Description": "To be Added later.",
        "Genre": { 
            "Name": "Action",
            "Description": "Fighting!"        
        },
        "Director": {
            "Name": "Steven Spielberg",
            "Bio": "Some guy",
            "DOB": "01/01/01"
        },
        "imgURL": "#",
        "Featured": true
    }
];

let users = [
    {
        id: 1,
        Name: "Alex Test",
        Favorites: [
             "Groundhog Day",
             "Lord of the Rings"
        ]
    },
    {
        id: 2,
        Name: "Betty Temp",
        Favorites: [
             "Two Towers",
             "Return of the King"
        ]
    }
];

//Logging code
app.use(morgan('combined', {stream: accessLogStream}));

// landing page code
app.get('/', (req, res) => {
    res.send('Welcome to my app! You can also visit /movies and /documentation.html');
  });

  //READ list of movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
  });

  //READ info about specific movies
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const  movie  = movies.find( movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send("No movie Title: " + title + " found.")
    }
    
  });

  //READ info about a specific genre
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName);
        //Cannot add ".Genre" to above function, because then its a a property of "undefined." Thats why its call below.
    if (genre){
        
        // List filter to display all movies of that genre
        let list = movies
        list = list.filter( movie => movie.Genre.Name === genreName)
        const genreInfo = {
            Genre: genre.Genre,
            Movies: list
        };
        res.status(200).json(genreInfo);
    } else {
        res.status(400).send("No such Genre")
    }

  });

  //READ info about specific director
app.get('/movies/directors/:directorName', (req, res) => {

    const { directorName } = req.params;
    const director= movies.find( movie => movie.Director.Name === directorName)

    // List filter to display all movies by that director
    let list = movies
    list = list.filter( movie => movie.Director.Name === directorName)
    const directorInfo = {
        Director: director.Director,
        Movies: list
    };

    if (director){
        res.status(200).json(directorInfo);
    } else {
        res.status(400).send("No Director by that name found.")
    }

  });

  //CREATE allows user to register an account
app.post('/users/register', (req, res) => {
    let newUser = req.body;

    if (!newUser.name){
        const message = "Missing Name in body.";
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
  });

    //UPDATE allows user to update profile name
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id );

    if (user){
        user.Name = updatedUser.Name;
        res.status(200).send("Name changed to " + user.Name);
    } else {
        res.status(400).send("No user with ID number: " + id + " found.");
    }
  });

    //GET shows all movies on favorites list
app.get('/users/:id/favorites', (req, res) => {
    const { id } = req.params;
    let user = users.find( user => user.id == id );

    if (user){
        res.status(200).json(user.Favorites);
    } else {
        res.status(404).send("No user with ID number: " + id + " found.");
    }
  });

    //CREATE allows user to add movies from list
app.post('/users/:id/favorites/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    let user = users.find( user => user.id == id );

    if (user){
        user.Favorites.push(movieTitle);
        res.status(200).send(`${movieTitle} to Favorites list.`);
    } else {
        res.status(404).send("No user with ID number: " + id + " found.");
    }
  });

      //delete allows user to remove movies from list
app.delete('/users/:id/favorites/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    let user = users.find( user => user.id == id );
    
    if (user){

        user.Favorites = user.Favorites.filter(Title =>  Title !== movieTitle);
        res.status(200).send(movieTitle + " removed from favorites")

    } else {
        res.status(400).send("No user with ID number: " + id + " found.");
    }
  });

    //Delete allows user to delete profile
app.delete('/users/:id', (req, res) => {
    //res.send("Successful DELETE request for user to delete an account");
    const { id} = req.params;
    let user = users.find( user => user.id == id );

    if (user){
       users = users.filter(user => user.id != id);
       res. status(201).send("User ID #" + id + " deleted.");
    } else {
        res.status(404).send("No user with ID number: " + id + " found.");
    }
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

  