const express = require('express');
const exphds = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const app = new express();

const ideas = require('./routes/ideas')
const users = require('./routes/users')

mongoose.connect('mongodb://localhost/lesson')
    .then(() => {
        console.log('connected...')
    })
    .catch(err => {
        console.log(err)
    })

app.engine('handlebars', exphds({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



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

app.use('/ideas',ideas);
app.use('/users',users);

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


