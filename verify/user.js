const LocalStrategy  = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Load user model
const user = mongoose.model('users');

module.exports = (passport)=>{
    passport.use(new LocalStrategy())
}