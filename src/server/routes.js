
const rout = require("path")
const authHelpers = require('../auth/_helpers');
const passport = require('../auth/local');
const fs = require('fs')

module.exports = (app) => {
    app.get('/', function (req, res) {
      res.redirect('/home')
    })

    app.get('/home', function (req, res) {
      if (req.isAuthenticated()) {
        res.render('viewHome', {
          logged: true,
          supervisor: req.user.supervisor,
          user: req.user
        });
      }else{
        res.render('viewHome', {
          logged: false,
          supervisor: false,
        });
      }
    })

    app.get('/login', function (req, res) {
      if (req.isAuthenticated()) {
        res.redirect('/perfil');
      }else{
        res.render('viewLogin',{
            message: req.flash('loginMessage'),
            logged: false,
            supervisor: false,
        });
      }
    })

    app.post('/login', authHelpers.loginRedirect, (req, res, next) => {
      passport.authenticate('local', {
    		successRedirect: '/perfil',
    		failureRedirect: '/login',
    		failureFlash: true
    	})(req, res, next);
    });

    app.get('/perfil', function (req, res) {

      if (req.isAuthenticated()) {
        res.render('viewPerfil',{
          logged: true,
          user: req.user,
        })
      }else{
        res.redirect('/login');
      }
    })

    app.get('/register', function (req, res) {
      if (req.isAuthenticated()) {
        res.render('viewRegister',{
          logged: true,
          user: req.user,
          message: req.flash('registerMessage')
        })
      }else{
        res.redirect('/home');
      }
    })

  app.post('/register', (req, res, next)  => {
      return authHelpers.createUser(req, res)
      .then((response) => {
      if (response) {
          res.redirect('/register')
      }
      })
      .catch((err) => {
          res.redirect('/register')
      });  
  });

app.get('/logout', authHelpers.loginRequired, (req, res, next) => {
      req.logout();
      handleResponse(res, 200, res.redirect('/login'));

    });

app.get('/userAdministration', function (req, res) {
      if (req.isAuthenticated() && req.user.supervisor) {
        res.render('viewUserAdministration',{
          logged: true,
          user: req.user,
        })
      }else{
        res.redirect('/home')
      }
    })


    app.get('/grafo', function (req, res) {
          if (req.isAuthenticated() && req.user.supervisor) {
            res.render('viewGrafo',{
              logged: true,
              user: req.user,
            })
          }else{
            res.redirect('/home')
          }
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

  function isLoggedIn (req, res, next) {
	   if (req.isAuthenticated()) {
		     return next();
	   }
     res.redirect('/home');
  }

}
