const express = require('express');
const router = express.Router();
const { campgroundSchema } = require('../schemas.js');
const Campground = require('../models/campground');
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
//유효성검사 미들웨어 함수 정의
const validateCampground =(req, res, next)=>{
    //mongoose 스카마가 아니고, Joi메서드를 사용해 정의한, JS객체를 위한 패턴이다.
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

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
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))
// **********************************
// SHOW
// **********************************
router.get('/:id', catchAsync(async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}))

//*******************************************
// EDIT & UPDATE
// *******************************************
router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res)=>{
    //편집할 항목 조회
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}))
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {new: true, runValidators: true});
    //업데이트 된 데이터를 받겠다는 옵션은 생략가능
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))
// *******************************************
// DELETE
// *******************************************
router.delete('/:id', isLoggedIn, catchAsync(async(req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}))

module.exports=router;