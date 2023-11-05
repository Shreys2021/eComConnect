
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log(token)
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
            } else {
                User.findById(decodedToken.userId)
                    .then((user) => {
                        if (!user) {
                            res.redirect('/login');
                        } else {
                            req.user = user;
                            next();
                        }
                    });
            }
        });
    } else {
        res.redirect('/login');
    }
};

module.exports = { requireAuth };
