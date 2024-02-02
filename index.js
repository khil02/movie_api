const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path"),
  uuid = require("uuid"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Models = require("./models.js"),
  cors = require("cors");

const { check, validationResult } = require("express-validator");

const Movies = Models.Movie;
const Users = Models.User;

// Local host
//mongoose.connect('mongodb://127.0.0.1:27017/flixDB', {useNewUrlParser: true, useUnifiedTopology: true});

// Web Host
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(cors());

let allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:1234",
  "https://myflix-sanchez.netlify.app",
  "http://testsite.com",
  "http://localhost:4200",
  "https://khil02.github.io/myFlix-Angular-client",
  "https://khil02.github.io",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn't found on a list of allowed origins
        let message =
          "The CORS policy for this application doesn't allo access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

//Logging code
app.use(morgan("combined", { stream: accessLogStream }));

// landing page code
app.get("/", (req, res) => {
  res.send(
    "Welcome to my app! You can also visit /movies and /documentation.html"
  );
});

/**
 * Get list of all movies
 * @name getAllMovies
 * @function
 * @param {Object} req - express request object
 * @param {object} res - express response object
 * @returns {object} - list of all movies
 * @throws {object} - error object if  there is an issue with the request
 * @example
 * // Request
 *  GET /movies
 * // Response
 *  [
 *   {
 *     _id: '123',
 *     Title: 'Movie Title',
 *     Imagepath: 'imagepath',
 *  	    Director: {
 * 			    Name: 'Name Surname',
 * 			    Bio: 'biography here',
 * 			    Birth: Date,
 *        },
 *        Genre: {
 * 			    Name: 'Genre1',
 * 			    Description: 'description here'
 * 			  },
 * 		  Featured: true, //boolean
 *   },
 *   // ... additional movies
 * ]
 */
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Get a specific movie
 * @name getMovie
 * @param {Object} req - express request object
 * @param {String} req.params.title - Title of movie being requested
 * @param {object} res - express response object
 * @returns {object} - JSON of requested movie's data
 * @throws {object} - error object if  there is an issue with the request
 * @example
 * // Request
 *  GET /movies/:Title
 * // Response
 *   {
 *     _id: '123',
 *     Title: 'Movie Title',
 *     Imagepath: 'imagepath',
 *  	    Director: {
 * 			    Name: 'Name Surname',
 * 			    Bio: 'biography here',
 * 			    Birth: Date,
 *        },
 *        Genre: {
 * 			    Name: 'Genre1',
 * 			    Description: 'description here'
 * 			  },
 * 		  Featured: true, //boolean
 *   }
 */
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Update Imagepath for a specific movie
 * @name updateMovie
 * @param {Object} req - express request object
 * @param {String} req.params.title - Title of movie being updated
 * @param {object} res - express response object
 * @returns {object} - JSON of movie with new data
 * @throws {object} - error object if  there is an issue with the request
 * @example
 * // Request
 *  PUT /movies/update/:Title
 * // Body: { ImagePath: "NewImagePath" }
 * // Response
 *   {
 *     _id: '123',
 *     Title: 'Movie Title',
 *     Imagepath: 'NewImagepath',
 *  	    Director: {
 * 			    Name: 'Name Surname',
 * 			    Bio: 'biography here',
 * 			    Birth: Date,
 *        },
 *        Genre: {
 * 			    Name: 'Genre1',
 * 			    Description: 'description here'
 * 			  },
 * 		  Featured: true, //boolean
 *   }
 */
app.put(
  "/movies/update/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOneAndUpdate(
      { Title: req.params.title },
      {
        $set: {
          ImagePath: req.body.ImagePath,
        },
      },
      { new: true }
    )
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Get information about specific genre
 * @name getGenre
 * @param {Object} req - express request object
 * @param {String} req.params.genreName - name of genre being requested
 * @param {object} res - express response object
 * @returns {object} - JSON data of requested genre
 * @throws {object} - error object if  there is an issue with the request
 * @example
 * // Request
 *  GET /movies/genre/:genreName
 * // Response
 *    Genre: {
 * 			 Name: 'Genre1',
 * 			 Description: 'description here'
 * 		}
 */
app.get(
  "/movies/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.genreName })
      .then((movie) => {
        res.json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
    /*
    // This section would have also returned movies in request genre, may not currently work

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
  }
);

/**
 * Get information about a specific director
 * @name getDirector
 * @param {Object} req - express request object
 * @param {String} req.params.directorName - name of director being requested
 * @param {object} res - express response object
 * @returns {object} - JSON data of requested genre
 * @throws {object} - error object if  there is an issue with the request
 * @example
 * // Request
 *  GET /movies/directors/:directorName
 * // Response
 *  	  Director: {
 * 			  Name: 'Name Surname',
 * 			  Bio: 'biography here',
 * 			  Birth: Date,
 *        }
 */
app.get(
  "/movies/directors/:directorName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.directorName })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });

    /*
    // This section should have returned all movies by that director, may not currently work
    
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
  }
);

//USERS

/**
 * Allows user to login
 * FUNCATION LOCATED IN auth.js
 *
 * @name loginUser
 * @function
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @returns {Object} - JSON containing user details upon successful login
 * @throws {Object} - Error object if there is an issue with logging in
 * @example
 * // Request: POST /login
 * // Body: {Username: "testUser", Password:(hashed)}
 *  Response: {_id: "123", Username: "testUser", Password:(hashed), Email: "test@email.com", ... }
 */

/* Expected in following JSON format
  {
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
  }
  */
/**
 * Allows new users to register
 *
 * @name registerUser
 * @function
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @returns {Object} - JSON containing user details upon successful registration
 * @throws {Object} - Error object if there is an issue with registration
 * @example
 * // Request: POST /users/register
 * // Body: {_id: "123", Username: "testUser", Password:(hashed), Email: "test@email.com", ... }
 *  Response: {_id: "123", Username: "testUser", Password:(hashed), Email: "test@email.com", ... }
 */
app.post(
  "/users/register",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear").isEmail(),
  ],
  async (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists.");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Get all users (probably shouldn't be in final version for security)
 *
 * @name getAllUsers
 * @function
 * @param {Object} request - express request object
 * @param {Object} response - express response object
 * @returns {Object} - List of users in JSON format
 * @throws {Object} - Error if there is an issue with the request or retrieving users
 * @example
 * // Request: GET /users
 * // Response: [{_id: "123", Username: "testUser", Password:(hashed), Email: "test@email.com", ... }, ...]
 */
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Get user by username
 *
 * @name getUser
 * @function
 * @param {Object} request - express request object
 * @param {Object} response - express response object
 * @returns {Object} - JSON object of user
 * @throws {Object} - Error if there is an issue with the request or retrieving user
 * @example
 * // Request: GET /users/:Username
 * // Response: {_id: "123", Username: "testUser", Password:(hashed), Email: "test@email.com", FavoriteMovies: ["movieID", "movieID2",...] }
 */
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/* Expected in JSON format
  {
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
  }
  */
/**
 * Update user by username
 *
 * @name updateUser
 * @function
 * @param {Object} request - express request object
 * @param {Object} response - express response object
 * @returns {Object} - JSON object of user
 * @throws {Object} - Error if there is an issue with the request or retrieving user
 * @example
 * // Request: PUT /users/:Username
 * // Body: {_id: "123", Username: "testUser", Password:"newPassword", Email: "test@email.com", ... }
 * // Response: {_id: "123", Username: "testUser", Password:(hashed), Email: "test@email.com", FavoriteMovies: ["movieID", "movieID2",...] }
 */
app.put(
  "/users/:Username",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    )
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Add movie to user's FavoriteMovie list
 *
 * @name addFavoriteMovie
 * @function
 * @param {Object} request - express request object
 * @param {Object} response - express response object
 * @returns {Object} - JSON object containing the updated user details with the added favorite movie
 * @throws {Object} - Error if there is an issue with the request or updating user FavoriteMovies
 * @example
 * // Request: PUT /users/:Username/favorites/:MovieID
 * // Response: {_id: "123", Username: "testUser", Password:(hashed), Email: "test@email.com", FavoriteMovies: ["MovieID", "MovieID2",..., "addedMovieID"] }
 */
app.post(
  "/users/:Username/favorites/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $addToSet: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    )
      .then((user) => {
        res.status(200).json(user);
      })

      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Delete movie to user's FavoriteMovie list
 *
 * @name deleteFavoriteMovie
 * @function
 * @param {Object} request - express request object
 * @param {Object} response - express response object
 * @returns {Object} - JSON object containing the updated user details without the deleted favorite movie
 * @throws {Object} - Error if there is an issue with the request or updating user FavoriteMovies
 * @example
 * // Request: Delete /users/:Username/favorites/:MovieID
 * // Response: {_id: "123", Username: "testUser", Password:(hashed), Email: "test@email.com", FavoriteMovies: ["MovieID", "MovieID2",...] }
 */
app.delete(
  "/users/:Username/favorites/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    )
      .then((user) => {
        res.status(200).json(user);
      })

      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Delete user
 *
 * @name deleteUser
 * @function
 * @param {Object} request - express request object
 * @param {Object} response - express response object
 * @returns {Object} - Success message that user was deleted
 * @throws {Object} - Error if there is an issue with the request or deleting user
 * @example
 * // Request: Delete /users/:Username/
 * // Response: "{UserID} was deleted"
 */
app.delete(
  "/users/:UserID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ _id: req.params.UserID })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.UserID + " was not found.");
        } else {
          res.status(200).send(req.params.UserID + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.use(express.static("public"));

/**
 * Error handling function
 *
 * @name error
 * @function
 * @param {Object} Err - Error object
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {function} next - express next function
 * @returns {Object} - Response with a status code 500 and message
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Your app is listening on port " + port);
});
