const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {valitation} = require('../verify/valitation');

const router = express.Router();

const jsonParser = bodyParser.json();
const urlencodeParser = bodyParser.urlencoded({ extends: false });

require('../models/idea');
const idea = mongoose.model('ideas');

router.get('/',valitation, (req, res) => {
    const title = '课程列表';
    idea.find({user:req.user.id}).sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                title,
                ideas
            });
        })
})

router.get('/add',valitation, (req, res) => {
    const title = '添加课程';
    res.render('ideas/add', { title })
})

router.get('/edit/:id',valitation, (req, res) => {
    const title = '编辑课程';
    idea.findOne({ _id: req.params.id })
        .then(idea => {
            if(idea.user === req.user.id){
                res.render('ideas/edit', {
                    title,
                    tit: idea.title,
                    detail: idea.detail,
                    id: idea._id
                })
            }else{
                req.flash('err_msg','非法操作！！！');
                res.redirect('/users/login');
            }
            
        })
        .catch(err => {
            console.log(err)
        })
})

router.delete('/:id', (req, res) => {
    idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg','删除成功！！！');
            res.redirect('/ideas');
        })
        .catch(err => {
            console.log(err);
        })
})

router.put('/edit/:id', urlencodeParser, (req, res) => {
    idea.findOne({ _id: req.params.id })
        .then(idea => {
            idea.title = req.body.title,
                idea.detail = req.body.detail

            idea.save()
                .then(() => {
                    req.flash('success_msg','修改成功！！！');
                    res.redirect('/ideas');
                })
                .catch(
                    err => {
                        console.log(err)
                    }
                )
        })
        .catch(err => {
            console.log(err)
        })

})

router.post('/', urlencodeParser, (req, res) => {
    const title = '添加课程';
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: '请输入主题！！' })
    }
    if (!req.body.detail) {
        errors.push({ text: '请输入描述描述！！！' })
    }
    if (errors.length) {
        res.render('ideas/add', {
            title,
            errors,
            tit: req.body.title,
            detail: req.body.detail
        })
    } else {
        const newIdea = {
            title: req.body.title,
            detail: req.body.detail,
            user:req.user.id
        }
        new idea(newIdea).save()
            .then(idea => {
                req.flash('success_msg','添加成功！！！');
                res.redirect('/ideas');
            })
            .catch(err => {
                console.log(err)
            })
    }

})

module.exports = router;