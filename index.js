const express = require("express"),
morgan = require("morgan"),
fs = require("fs"),
path = require("path"),
uuid = require("uuid"),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
Models = require('./models.js'),
cors = require('cors');

const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://127.0.0.1:27017/flixDB', {useNewUrlParser: true, useUnifiedTopology: true});

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {flags: "a"});
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(cors());
/* 
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){// If a specific origin isn't found on a list of allowed origins
            let message = 'The CORS policy for this application doesn't allo access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));
*/
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//Logging code
app.use(morgan('combined', {stream: accessLogStream}));

// landing page code
app.get('/', (req, res) => {
    res.send('Welcome to my app! You can also visit /movies and /documentation.html');
  });

  //READ list of movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
     Movies.find()
        .then((movies) => {
             res.status(201).json(movies);
         })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    /*
    res.status(200).json(movies);
    */
  });

  //READ info about specific movies
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.title })
    .then((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
  });

  //READ info about a specific genre
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {

    Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((movie) => {
        res.json(movie.Genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
    /*
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
    */
  });

  //READ info about specific director
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {

    Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
        res.json(movie.Director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });

    /*
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
    */
  });

  //CREATE allows user to register an account
  /* Expected in following JSON format
  {
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
  }
  */
app.post('/users/register',[
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear').isEmail()
], /*passport.authenticate('jwt', { session: false }),*/ async (req, res) => {

    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array()});
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + " already exists.");
            } else { 
                Users
                    .create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => {res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send("Error: " + error);
                })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
        });
  });

    //Get all users (probably shouldn't be in final version for security)
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

    //Get user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

    //UPDATE allows user to update profile name
      /* Expected in JSON format
  {
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
  }
  */
app.put('/users/:Username', [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear').isEmail()
], passport.authenticate('jwt', { session: false }), (req, res) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array()});
    }

    Users.findOneAndUpdate({ Username: req.params.Username}, { $set: 
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    {new: true})
    .then((user) => {res.status(200).json(user)
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
  
  });

    //******GET shows all movies on favorites list NOT UPDATED*******
// app.get('/users/:Username/favorites', (req, res) => {
//     Users.findOne({ Username: req.params.Username })
//         .then((user) => {
//             res.json(user.FavoriteMovies);
//         })
//         .catch((err) => {
//             console.error(err);
//             res.status(500).send('Error: ' + err);
//         });
//   });

    //CREATE allows user to add movies from list
app.post('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
     Users.findOneAndUpdate({ Username: req.params.Username }, { 
         $addToSet: { FavoriteMovies: req.params.MovieID }
    }, 
    {new: true})
    .then((user) => {res.status(200).json(user)})
    
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
  });

      //delete allows user to remove movies from list
app.delete('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username}, { 
        $pull: { FavoriteMovies: req.params.MovieID}
   },
   {new: true})
   .then((user) => {res.status(200).json(user)})
   
   .catch((err) => {
       console.error(err);
       res.status(500).send('Error: ' + err);
   });
 });

    //Delete allows user to delete profile
app.delete('/users/:UserID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ _id: req.params.UserID})
        .then((user) => {
            if(!user) {
                res.status(400).send(req.params.UserID + " was not found.");
            } else {
                res.status(200).send(req.params.UserID + " was deleted.");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
   });

app.use(express.static("public"));

// error flag code
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });

  const port = process.env.PORT || 8080
  app.listen(port, '0.0.0.0', () => {
    console.log('Your app is listening on port 8080.' + port);
  });

  