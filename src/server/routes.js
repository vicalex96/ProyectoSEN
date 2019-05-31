
const rout = require("path")
const authHelpers = require('../auth/_helpers');
const passport = require('../auth/local');

module.exports = (app) => {

  app.get('/home', function (req, res) {
    if (req.isAuthenticated()) {
      res.render('viewHome', {
        logged: true,
        supervisor: req.user.supervisor,
        user: req.user
      });
    }else{
      res.render('viewHomeUnLog', {
        logged: false,
        supervisor: false,
      });
    }
  })

  app.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/perfil');
    }else{
      res.render('viewlogin');
    }
  })

  app.post('/login', authHelpers.loginRedirect, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) { handleResponse(res, 500, 'error'); }
      if (!user) { req.flash('loginMessage', 'No User found') }
      if (user) {
        req.logIn(user, function (err) {
          if (err) { handleResponse(res, 500, 'Error'); }
          res.redirect('/perfil');
        });
      }
    })(req, res, next);
  });

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

app.get('/perfil', function (req, res) {

  if (req.isAuthenticated()) {
    res.render('viewHome',{
      logged: true,
      user: req.user,
    })
  }else{
    res.redirect('/login');
  }
})

app.get('/grafo', function (req, res) {
      if (req.isAuthenticated() && req.user.supervisor) {
        res.render('viewHome',{
          logged: true,
          user: req.user,
        })
      }else{
        res.redirect('/home')
      }
    })
    app.get('/userAdministration', function (req, res) {
      res.render('viewUserAdministration')
    })

    app.get('/', function (req, res) {
      res.redirect('/home')
    })

app.get('/bitacora', function (req, res) {
              if (req.isAuthenticated() && req.user.supervisor) {
                res.render('viewBitacora',{
                  logged: true,
                  user: req.user,
                })
            }else{
                res.redirect('/home')
              }
            })

  function handleLogin(req, user) {
    return new Promise((resolve, reject) => {
      req.login(user, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  function handleResponse(res, code, statusMsg) {
    res.status(code).json({status: statusMsg});
  }

}
