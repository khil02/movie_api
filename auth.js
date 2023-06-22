const jwtSecret = 'your_jwt_secret'; //matches the key in JWTStrategy

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); //local passport file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, //This is the username you're encoding in the JWT
        expiresIn: '7d', //Token expires in 7 days
        algorithm: 'HS256' // This is the algorithm used to "sign" or encode the values of the JWT
    });
}

/* POST login */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user ) {
                console.log(error);
                return res.status(400).json({
                    message: ' Something is not right dude',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}