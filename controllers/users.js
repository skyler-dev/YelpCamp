const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, function(err) {
            if (err) { return next(err); }
            req.flash('success','Yelp Camp에 오신 것을 환영해요!');
            res.redirect('/campgrounds');
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', '다시 돌아온 것을 환영해요!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res)=>{
    req.logout(function (err) {
        // if (err) { return next(err); }
        req.flash('success', "안녕히 가세요!");
        res.redirect('/campgrounds');
    });
}

