const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async(req, res)=>{
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
}

module.exports.deleteReview = async(req, res)=>{
    const { id, reviewId } = req.params;
    //배열에 있는 모든 인스턴스 중에 특정 조건에 만족하는 값 지움
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
}