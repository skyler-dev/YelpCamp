const express = require('express');
const router = express.Router({mergeParams: true});
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');

// Review Create 라우트
router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    //참조추가
    campground.reviews.push(review);
    //저장
    await campground.save();
    await review.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))
// Review Delete 라우트
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res)=>{
    const { id, reviewId } = req.params;
    //배열에 있는 모든 인스턴스 중에 특정 조건에 만족하는 값 지움
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports=router