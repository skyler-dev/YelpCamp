const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('users/register');
});

//디폴트 오류핸들러는 오류페이지를 보여주기 때문에 나쁜 사용자 경험 선사.
//대신 flash 사용.
router.post('/register', catchAsync(async (req, res)=>{
    try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.flash('success','Welcome to Yelp Camp!');
    res.redirect('/campgrounds');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

module.exports = router;