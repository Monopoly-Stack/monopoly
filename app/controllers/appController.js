var express = require("express");
var router = express.Router();
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');

var db = require("../models");

/* GET requests for login, start game */
router.get('/', function(req, res, next) {
    res.render('signup', { title: 'Monopoly-Lite' });
});
router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'Monopoly-Lite' });
});
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Monopoly-Lite' });
});
router.get('/game', function(req, res, next) {
    res.render('game', { title: 'Monopoly-Lite' });
});

/*Get request associates logged in user with form data */
router.get('/start', function(req, res, next) {
    db.user.findOne({
        where: { uuid: req.user.uuid },
    }).then(function(data) {
        console.log(data.uuid);
        var hbsObj = {
            id: data.uuid,
            username: data.username
        };
        res.render('start', hbsObj);
    });
});
/*Select page*/
router.get('/select', function(req, res, next) {
    db.user.findOne({
        where: { uuid: req.user.uuid },
    }).then(function(data) {
        console.log(data.uuid);
        var hbsObj = {
            id: data.uuid,
            username: data.username,
            players: data.players
        };
        res.render('select', hbsObj);
    });
});


// Signup/Login POST Validation through Passport
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/start', // redirect to the secure game section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

router.post('/login', passport.authenticate('local-signin', {
    successRedirect: '/start', // redirect to the secure game section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

/* '/start' Post Request */
router.put('/:id', function(req, res) {
    db.user.update({
        players: req.body.players
    }, {
        where: {
            uuid: req.params.id
        }
    }).then(res.redirect('/select'));
});

/**/
/*Select Players */
// =============================================
router.post('/select', function(req, res) {
    for (i = 0; i < req.body.playername.length; i++) {
        console.log(req.body.playername[i]); 
    db.Player.create({
        player_name: req.body.playername[i],
        piece: req.body.piece[i].toLowerCase(),
        money: 1500,
        roll: req.body.rollvalue[i],
        current_space: 0,
        parent_user: req.body.parentuser[i],        
    });
	}
	res.redirect('/game');
});

/*Login & Logout through Passport*/
router.get('/login',
    function(req, res) {
        res.render('login');
    });

router.get('/logout',
    function(req, res) {
        req.session.destroy(function(err) {
            res.redirect('/');
        });
    });


// Board Values API
router.get("/api/propertys", function(req, res) {
    db.Property.findAll({}).then(function(values) {
        res.json(values);
    });
});
// User API
router.get("/api/user", function(req, res) {
    db.user.findOne({
        where: { uuid: req.user.uuid },
    }).then(function(data) {
        res.json(data);
    });
});
// Players API
router.get("/api/players", function(req, res) {
    console.log(req);
    db.Player.findAll({where: {parent_user: req.user.username}}).then(function(values) {
        res.json(values);
    });
});


module.exports = router;
