const express = require('express');
const router = express.Router({mergeParams: true});
const { reviewSchema } = require('../schemas.js');

const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
//유효성검사 미들웨어 함수 정의
const validateReview = (req,res, next)=>{
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Review Create 라우트
router.post('/', validateReview, catchAsync(async(req, res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    //참조추가
    campground.reviews.push(review);
    //저장
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))
// Review Delete 라우트
router.delete('/:reviewId', catchAsync(async(req, res)=>{
    const { id, reviewId } = req.params;
    //배열에 있는 모든 인스턴스 중에 특정 조건에 만족하는 값 지움
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports=router