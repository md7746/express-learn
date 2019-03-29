const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

const jsonParser = bodyParser.json();
const urlencodeParser = bodyParser.urlencoded({ extends: false });

require('../models/user');
const users = mongoose.model('users');

router.get('/login', (req, res) => {
    const title = '登录';
    res.render('users/login', { title })
})

router.post('/login', urlencodeParser, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
    // users.findOne({email:req.body.email})
    //     .then(user=>{
    //         if(!user){
    //             req.flash('err_msg','用户不存在');
    //             res.redirect('/users/login');
    //         }else{
    //             bcrypt.compare(req.body.password, user.password, function(err, isMath) {
    //                 if(err) throw err;
    //                 if(isMath){
    //                     req.flash('success_msg','登录成功');
    //                     res.redirect('/ideas');
    //                 }else{
    //                     req.flash('err_msg','密码错误');
    //                     res.redirect('/users/login');
    //                 }

    //             });
    //         }
    //     })
})

router.get("/register", (req, res) => {
    res.render("users/register");
})

router.post('/register', urlencodeParser, (req, res) => {
    const title = '注册';
    let errs = [];
    if (req.body.password1.length < 4) {
        errs.push({
            text: '密码长度不能小于4位！！'
        });
    }

    if (req.body.password1.length >= 4 && req.body.password1 != req.body.password2) {
        errs.push({
            text: '两次输入密码不正确！！'
        })
    }
    if (errs.length) {
        res.render('users/register', {
            title,
            name: req.body.name,
            email: req.body.email,
            password1: req.body.password1,
            password2: req.body.password2,
            errs
        })
    } else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password1, salt, (err, hash) => {
                if (err) throw err;
                let newUser = new users({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                });
                newUser.save()
                    .then(() => {
                        req.flash('success_msg', '注册成功');
                        res.redirect('/users/login');
                    })
                    .catch((err) => {
                        console.log(err);
                        req.flash('err_msg', '注册失败');
                        res.redirect('/users/register');
                    })

            })
        });
    }
})

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', '退出登录成功');
    res.redirect('/users/login');
})

module.exports = router;