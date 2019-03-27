const express = require('express');
const exphds = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const app = new express();

mongoose.connect('mongodb://localhost/lesson')
    .then(() => {
        console.log('connected...')
    })
    .catch(err => {
        console.log(err)
    })

require('./models/idea');
const idea = mongoose.model('ideas');

app.engine('handlebars', exphds({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

const jsonParser = bodyParser.json();
const urlencodeParser = bodyParser.urlencoded({ extends: false });

app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.err_msg = req.flash('err_msg');
    next();
})

const port = 5000;
app.listen(port, () => {
    console.log('server is runing!')
})

app.get('/', (req, res) => {
    const title = '首页';
    res.render('index', { title });
})

app.get('/about', (req, res) => {
    const title = '关于我们';
    res.render('about', { title });
})

app.get('/ideas', (req, res) => {
    const title = '课程列表';
    idea.find({}).sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                title,
                ideas
            });
        })
})

app.get('/ideas/add', (req, res) => {
    const title = '添加课程';
    req.flash('success_msg','添加成功');
    res.render('ideas/add', { title })
})

app.get('/ideas/edit/:id', (req, res) => {
    const title = '编辑课程';
    idea.findOne({ _id: req.params.id })
        .then(idea => {
            res.render('ideas/edit', {
                title,
                tit: idea.title,
                detail: idea.detail,
                id: idea._id
            })
        })
        .catch(err => {
            console.log(err)
        })
})

app.delete('/ideas/:id', (req, res) => {
    idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg','删除成功！！！');
            res.redirect('/ideas');
        })
        .catch(err => {
            console.log(err);
        })
})

app.put('/edit/:id', urlencodeParser, (req, res) => {
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

app.post('/ideas', urlencodeParser, (req, res) => {
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
            detail: req.body.detail
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

app.get('/login',(req,res)=>{
    res.send('login')
})

app.get('/register',(req,res)=>{
    res.send('register')
})