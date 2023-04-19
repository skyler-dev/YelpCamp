const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
        
    })

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }));

//override with POST having ?_method=PUT
//쿼리문자열로 사용할 문자열 전달. 변경 가능.
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000*60*60*24*7,
        httpOnly: true,
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res)=>{
    res.render('home')
})

//모든 경로에 이 콜백을 호출. 상단의 모든 코드에 요청이 닿지 않는 경우에만 실행됨. 순서 중요.
//app.all('*', fn) vs. app.use(fn) : 
//For the wildcard * path, there's really not much of a meaningful difference at all. 
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next)=>{
    //변수를 추출하고 그 변수에 디폴트를 줄 뿐
    const { statusCode = 500 } = err;
    //실제 err 객체 업데이트
    if(!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('error', { err });
})


app.listen(3000, ()=>{
    console.log('Serving on port 3000')
})