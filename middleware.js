module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        //checks whether user is authenticated by the passport.authenticate() method
        // console.log(req.user)
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    //인증된 사용자의 경우
    next();
}