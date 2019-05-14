
const rout = require("path")


module.exports = (app) => {

    app.get('/login', function (req, res) {
      res.sendFile(rout.join(__dirname, '..' ,'/views/login.html'));
    });


}
