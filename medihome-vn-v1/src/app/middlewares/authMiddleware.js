const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = {
    getUserLogin: function (req, res, next) {
        if (!req.signedCookies.userID) {
            return next();
        }
        let userID;
        try {
            let token = req.signedCookies.userID;
            userID = jwt.verify(token, process.env.SECRET_JWT);
        } catch (error) {
            res.clearCookie('userID');
            return next();
        }
    
        User.findById(userID)
            .then((user) => {
                if(!user){
                    res.clearCookie('userID');
                    return next();
                }
                res.locals.user = user;
                return next();
            })
            .catch((error) => {
                return next();
            })
    },
    requireLogin: function(req, res, next) {
        if (!res.locals.user) {
            return res.redirect('/login');
        }
        next();
    },
    admin: function (req, res, next) {
        if (res.locals.user.Role == "Admin") {
            return next();
        }
        else {
            return res.redirect('/');
        }
    },
    manager: function (req, res, next) {
        if (res.locals.user.Role == "Admin") {
            return next();
        }
        if (res.locals.user.Role == "Manager") {
            return next();
        }
        else {
            return res.redirect('/');
        }
    },   
}