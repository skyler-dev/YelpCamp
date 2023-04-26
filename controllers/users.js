const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}
//디폴트 오류핸들러는 오류페이지를 보여주기 때문에 나쁜 사용자 경험 선사.
//대신 flash 사용.
module.exports.register = async (req, res, next)=>{
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
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}
//메서드 이름은 login으로 했지만, 실제 로그인은 passport가 하는 일이다. 사실 아래 함수는 플래시와 리다이렉트 목적
module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    console.log('In login Route', req.session.returnTo);
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res)=>{
    req.logout(function (err) {
        // if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
}

