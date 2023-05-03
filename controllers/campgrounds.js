const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
//geocoder exposes forwardGeocode(), reverseGeocode()

module.exports.index = async(req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req, res, next)=>{
    const geoData = await geocoder.forwardGeocode({
        //문자열전달
        query: req.body.campground.location,
        limit: 1
        }).send()
        //geoData.body안에 type, query, features, attribution
        //geoData.body.features[0].geometry는 GeoJSON 반환.
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground.geometry);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async(req, res)=>{
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
}

module.exports.renderEditForm = async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async(req, res)=>{
    const {id} = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {new: true, runValidators: true});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    //배열이니까 ...연산자 사용
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        // cloudinary에서 삭제(cloudinary의 Upload API 중 destroy 메서드. public_id 전달). 시드파일에서 공유하는 이미지url을 제거하지 않게 주의
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        // mongoDB에서 삭제(특정 조건에 맞는 값들의 모든 인스턴스를 기존의 배열에서 제거).
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async(req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}