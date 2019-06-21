const express = require("express")
const app = express()
const path = require("path")
const passport = require("passport")
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const flash = require('connect-flash')
const bcrypt = require('bcrypt')
const methodOverride = require('method-override');

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
		console.log('Server en el puerto:', app.get('port'));
});

if (process.env.NODE_ENV !== 'test') {
	app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
		name: "session",
		keys:["secreto1","secreto2"]
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, '..', '..', 'client')));

require(__dirname + '/server/routes.js')(app)
require(__dirname + '/server/nodoRoutes.js')(app)
require(__dirname + '/server/asociacionRoutes.js')(app)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use("/css", express.static(path.join(__dirname, '/views/css')));
app.use("/img", express.static(path.join(__dirname, '/views/img')));
app.use("/js", express.static(path.join(__dirname, '/views/js')));
