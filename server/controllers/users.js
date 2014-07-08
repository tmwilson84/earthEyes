'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('lodash');

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.redirect('#!/login');
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res, next) {
    var user = new User(req.body);

    user.provider = 'local';

    // because we set our user.provider to local our models/user.js validation will always be true
    req.assert('first_name', 'You must enter first name').notEmpty();
    req.assert('last_name', 'You must enter last name').notEmpty();
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('username', 'Username cannot be more than 20 characters').len(1,20);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.assert('dob', 'Please enter a valid date').isDate();
    req.assert('gender', 'Please select your gender').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    user.name.first = req.body.first_name;
    user.name.last = req.body.last_name;

    user.location.country = req.body.country;
    user.location.state = req.body.state;
    user.location.city = req.body.city;
    
    // Hard coded for now. Will address this with the user permissions system in v0.3.5
    user.roles = ['authenticated'];
    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    res.status(400).send('Username already taken');
                    break;
                default:
                    res.status(400).send('Please fill all the required fields');
            }

            return res.status(400);
        }
        
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/');
        });

        res.status(200);
    });

};
/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};

/**
 *  Update user
 */
exports.update = function(req, res) {
    // check for logged in user
    var user = req.user;
    
    user = _.extend(user, req.body);
    
    user.save(function(err) {
        if (err) {
            res.status(400).send('Errors occoured');
        } else {
            res.jsonp(user);
        }
    });

}