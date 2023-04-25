const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('users/register');
});

//디폴트 오류핸들러는 오류페이지를 보여주기 때문에 나쁜 사용자 경험 선사.
//대신 flash 사용.
router.post('/register', catchAsync(async (req, res, next)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        //register하면 저절로 로그인 상태가 되게 하기
        req.login(registeredUser, function(err) {
            if (err) { return next(err); }
            req.flash('success','Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    //아래 세션은 계속 사용하지 않으므로 변수 생성 후 삭제
    // console.log(req.session.returnTo) undefined되는 오류해결: keepSessionInfo: true
    console.log('In login Route', req.session.returnTo);
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

//공격방지를 위해 연습 이후 POST라우트로 수정할 것.
router.get('/logout', (req, res)=>{
    req.logout(function (err) {
        // if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
})

module.exports = router;