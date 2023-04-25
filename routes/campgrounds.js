const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

// **********************************
//  INDEX 
// **********************************
router.get('/', catchAsync(async(req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))

// **********************************
// NEW & CREATE
// **********************************
// (주의) 'campgrounds/new'는 '/campgrounds/:id' 아래에 있으면 안된다. new가 :id로 처리된다.
router.get('/new', isLoggedIn, (req, res)=>{
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async(req, res, next)=>{
    //res.send(req.body);
    // req.body는 {"campground":{"title":"오두막","location":"부산, 대한민국"}}
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))
// **********************************
// SHOW
// **********************************
router.get('/:id', catchAsync(async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}))

//*******************************************
// EDIT & UPDATE
// *******************************************
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res)=>{
    //편집할 항목 조회
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}))
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {new: true, runValidators: true});
    //업데이트 된 데이터를 받겠다는 옵션은 생략가능
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))
// *******************************************
// DELETE
// *******************************************
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}))

module.exports=router;