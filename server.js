// Get the packages we need
var express             = require('express'),
    app                 = express(),
    router              = express.Router(),
    bodyParser          = require('body-parser'),
    mongoose            = require('mongoose'),
    secrets             = require('./config/secrets'),
    passport            = require('passport'),
    LocalStrategy       = require('passport-local'),
    cookieParser        = require('cookie-parser'),
    multipart           = require('connect-multiparty'),
    server              = require('http').createServer(app),
    multipartMiddleware = multipart();

var authRoutes     = require('./routes/auth'),
    User           = require('./models/user'),
    saveImage      = require('./routes/saveImage');

//include chat sockets
var chat           = require('./routes/chat').listen(server);

// Use environment defined port or 8080
var port = process.env.PORT || 8080;

var path = require('path');

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
};

var connectionString = secrets.token + secrets.mongo_connection;
mongoose.connect(connectionString);
var db = mongoose.connection;

console.log('Connected to database!');
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(multipartMiddleware);

app.use('/scripts', express.static(path.join(__dirname, '/node_modules')));
app.use(express.static(__dirname + "/client"));

//passport configuration for OAuth
 app.use(cookieParser('magpie is amazing'));
 app.use(require('express-session')({
     secret: 'magpie is amazing',
     resave: false,
     saveUninitialized: false
 }));
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());

// Use routes as a module (see index.js)
require('./routes')(app, router);
app.use('/api', authRoutes);
app.use('/api', saveImage);


//start up the server
server.listen(port, function(){
    console.log('listening on port:', port);
});

