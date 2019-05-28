const express = require("express")
const app = express()
const path = require("path")

const cookieSession = require('cookie-session');
const passport = require('passport');

	//crea el servidor
	app.set('port', process.env.PORT || 3000);
	app.listen(app.get('port'), () => {
		console.log('Server en el puerto:', app.get('port'));
	});



	//habre el archivo controlador de rutas del proyecto
	require(__dirname + '/server/routes.js')(app)

	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');

	app.use("/css", express.static(path.join(__dirname, '/views/css')));
	app.use("/img", express.static(path.join(__dirname, '/views/img')));
