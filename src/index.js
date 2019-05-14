const express = require("express")
const app = express()
const path = require("path")

//crea el servidor
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
	console.log('Server en el puerto:', app.get('port'));
});



//habre el archivo controlador de rutas del proyecto
require(__dirname + '/server/routes.js')(app)
