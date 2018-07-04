var express = require('express');
// for mailing
var nodemailer = require('nodemailer');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var app = require('./ApplicationInstance');
var passport = require('passport');
var mongoose = require('mongoose');
var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
//var configDB = require('./backend/Models/database.js');
var compression = require('compression');
var _ = require("underscore");
//var mainRoutes = require('./backend/routes/MainRoutes');
//var connection = require('./config');
//var User = require('./backend/Models/user1.js')
//configuration fo node mailer ===============================================

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "edciitd2017@gmail.com",
        pass: "123qwerty123"
    }
});



// configuration  for mongo ===============================================================
// mongoose.connect(configDB.url); // connect to our database

// require('./backend/Models/passport')(passport); // pass passport for configuration



app.use(logger('dev'));
app.use(compression());
app.use(express.static(path.resolve(__dirname, './')));
//app.use('/courses', express.static(path.resolve(__dirname, 'client')));
app.set('port', process.env.PORT || 4001);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('views', __dirname + './');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(cookieParser());

// required for cookie session
app.use(session({ 
key:'user_sid',
secret: 'letthegamebegins',
resave:false,
saveUninitialized:false,
cookie:{
    expires:600000
} 

}));
// session secret
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
// app.use(flash()); // use connect-flash for flash messages stored in session

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        console.log(req.session.user);
        res.redirect(req.session.user.Role);
    } else {
        next();
    }    
};

app.use('/', (req,res) => {
res.render('index.ejs')
});
app.listen(app.get('port'), function () {
    console.log('Application running in port '+ app.get('port'));
});
