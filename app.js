if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

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
// $ 나 .가 포함된 키 허용하지 않기 위함. _로 대체함.
app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  );

const sessionConfig = {
    // 기본값인 'connect.sid'대신 다른 이름 사용
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000*60*60*24*7,
        // 스크립트삽입해서 쿠키접근하는 것 방지
        httpOnly: true,
        // localhost는 HTTPS가 아님
        // secure: true,
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());
// 리소스 불러오는 위치 제한
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/doo4mczu4/", //SHOULD MATCH CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.get('/fakeUser', async(req, res)=>{
//     const user = new User({
//         email: 'skyler@gamil.com',
//         username: 'skyler',
//     });
//     const newUser = await User.register(user, '12345');
//     res.send(newUser);
// })

app.use((req, res, next)=>{
    //passport.session() 이후로 여야 req.user사용 가능
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

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