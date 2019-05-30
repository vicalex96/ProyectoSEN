const express = require("express")
const app = express()
const path = require("path")
const passport = require("passport")
const cookieParser = require("cookie-parser")
const morgan = require('morgan'); //define los metodos http que llegan del servidor
const bodyParser = require('body-parser'); //procesa la informacion del servidor
const cookieSession = require('cookie-session');
const session = require('express-session')
const flash = require('connect-flash');
const bcrypt = require('bcrypt')
//const knex = require('./knexfile.js')



	//crea el servidor
	app.set('port', process.env.PORT || 3000);
	app.listen(app.get('port'), () => {
		console.log('Server en el puerto:', app.get('port'));
	});

	if (process.env.NODE_ENV !== 'test') {
	app.use(morgan('dev'));
	}

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
// uncomment if using express-session
app.use(cookieSession({
	name: "session",
	keys:["secreto1","secreto2"]
}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	app.use(express.static(path.join(__dirname, '..', '..', 'client')));



	//habre el archivo controlador de rutas del proyecto
	require(__dirname + '/server/routes.js')(app)

	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');

	app.use("/css", express.static(path.join(__dirname, '/views/css')));
	app.use("/img", express.static(path.join(__dirname, '/views/img')));
