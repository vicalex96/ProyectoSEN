
const rout = require("path")
const authHelpers = require('../auth/_helpers');
const passport = require('../auth/local');

module.exports = (app) => {
    app.get('/login', function (req, res) {
      //res.sendFile(rout.join(__dirname, '..' ,'/views/login.html'));
      res.render('viewLogin')
    })

    app.get('/register', function (req, res) {
      res.render('viewRegister')
    })



  app.post('/register', (req, res, next)  => {
      return authHelpers.createUser(req, res)
      .then((response) => {
        passport.authenticate('local', (err, user, info) => {
          console.log('hola');
          if (user) { handleResponse(res, 200, 'success'); }
        })(req, res, next);
      })
      .catch((err) => { console.log(err)
        handleResponse(res, 500, 'error'); });
  });

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg});
}

app.post('/login', (req, res, next) => {
      passport.authenticate('local', (err, user, info) => {
        if (err) { handleResponse(res, 500, 'error'); }

        if (!user) { handleResponse(res, 404, 'User not found'); }
        if (user) {
          req.logIn(user, function (err) {
            if (err) {
              handleResponse(res, 500, 'error');
            }
          handleResponse(res, 200, 'success');
          });
        }
      })(req, res, next);
    });


    app.get('/userAdministration', function (req, res) {
      res.render('viewUserAdministration')
    })

    app.get('/', function (req, res) {
      res.render('viewHome')
    })

}
