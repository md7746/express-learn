const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Load user model
const user = mongoose.model('users');

module.exports = (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        user.findOne({ email })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: '用户不存在' });
                } else {
                    bcrypt.compare(password, user.password, function (err, isMath) {
                        if (err) throw err;
                        if (isMath) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: '密码错误' });
                        }

                    });
                }
            })
    }))

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        user.findById(id, function (err, user) {
            done(err, user);
        });
    });
};