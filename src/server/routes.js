
const rout = require("path")


module.exports = (app) => {
    app.get('/login', function (req, res) {
      //res.sendFile(rout.join(__dirname, '..' ,'/views/login.html'));
      res.render('viewLogin')
    })

    app.get('/register', function (req, res) {
      //res.sendFile(rout.join(__dirname, '..' ,'/views/login.html'));
      res.render('viewRegister')
    })

    app.get('/userAdministration', function (req, res) {
      //res.sendFile(rout.join(__dirname, '..' ,'/views/login.html'));
      res.render('viewUserAdministration')
    })

    app.get('/', function (req, res) {
      //res.sendFile(rout.join(__dirname, '..' ,'/views/login.html'));
      res.render('viewHome')
    })

}
