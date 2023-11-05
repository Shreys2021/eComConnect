require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const path = require('path');
const User = require('./models/user')
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const session = require('express-session');
const { Server } = require('http');
const http = require('http')
const server = http.createServer(app);
const io = new Server(server)
const cookieParser = require('cookie-parser');

io.on("connection", (socket) => {
    console.log("A new user is connected", socket.id)
})

app.locals.io = io;
app.use((req, res, next) => {
    req.io = io;
    next();
});

mongoose.connect(process.env.URL, {
    useNewUrlParser: true,

    useUnifiedTopology: true

}).then(() => {
    console.log("Connection open");
}).catch(err => {
    console.log("OH NO ERROR");
    console.log(err);
})

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
}, (jwt_payload, done) => {

}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(express.json());

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}));

const userRoutes = require('./routes/userRoute');
const categoryRoutes = require('./routes/categoryRoute')
const productRoutes = require('./routes/productRoute')
const cartRoutes = require('./routes/cartRoute')
const orderRoutes = require('./routes/orderRoute')

app.use('/', userRoutes);
app.use('/', categoryRoutes)
app.use('/', productRoutes)
app.use('/', cartRoutes)
app.use('/', orderRoutes)



app.all('*', (req, res, next) => {
    res.send("NO PAGE FOUND");
})

app.listen(3000, () => {
    console.log("listening on port 3000");
})