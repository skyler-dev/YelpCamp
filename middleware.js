const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        //checks whether user is authenticated by the passport.authenticate() method
        // console.log(req.user)
        console.log('In middleware', req.session.returnTo)
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    //인증된 사용자의 경우
    next();
}
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
//유효성검사 미들웨어 함수 정의
module.exports.validateCampground =(req, res, next)=>{
    //mongoose 스카마가 아니고, Joi메서드를 사용해 정의한, JS객체를 위한 패턴이다.
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
//유효성검사 미들웨어 함수 정의
module.exports.validateReview = (req,res, next)=>{
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
