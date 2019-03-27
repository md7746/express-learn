const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const router = express.Router();

const jsonParser = bodyParser.json();
const urlencodeParser = bodyParser.urlencoded({ extends: false });

router.get('/login',(req,res)=>{
    res.send('login')
})

router.get('/register',(req,res)=>{
    res.send('register')
})

module.exports = router;