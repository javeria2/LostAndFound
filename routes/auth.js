var express  = require('express'),
	router   = express.Router(),
    passport = require('passport'),
    User     = require('../models/user');

//========= USER AUTH ===========//
//signin
router.post('/signup', function(req, res){
	var newUser = new User({username: req.body.username, about: req.body.about, img: req.body.img});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return;
		}
		passport.authenticate('local')(req, res, function(){
			res.json(user);
		});
	});
});

//login
router.post('/login', function(req, res){
	passport.authenticate('local', function(err, user, info) {
    	if (err) { 
    		console.log(err);
    		return;
    	}
    	req.logIn(user, function(err) {
      		if (err) { 
    			console.log(err);
    			return;
    		}
    		req.session.save(function() {
    			res.json(user);
    		});
    	});
    })(req, res);
});

//logout
router.get('/logout', function(req, res){
	req.logout();
	res.json({});
});

//check if user is authenticated
router.get('/isLoggedIn', function(req, res){
	res.send(req.isAuthenticated() ? req.user : '0');
});

module.exports = router;