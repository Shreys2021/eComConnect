const User = require('../models/user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');


exports.showLoginForm = (req, res) => {
    res.render('user/login');
}

exports.loginUser = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({ username });
    if (!user) {
        req.flash('error', 'Incorrect username or password');
        return res.redirect('/login');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.cookie("jwt", token)

    if (isPasswordValid) {

        req.session.user = {
            userId: user._id,
            username: user.username,
            email: user.email,

        };
        return res.redirect('/categories');
    } else {
        req.flash('error', 'Incorrect username or password');
        res.redirect('/login')
    }

};

exports.showRegisterForm = (req, res) => {
    res.render('user/register')
}


exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, email, password });
        const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        newUser.tokens.push({ token });

        res.cookie("jwt", token)

        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
}

exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.clearCookie('jwt');
        res.redirect('/login');
    });
}