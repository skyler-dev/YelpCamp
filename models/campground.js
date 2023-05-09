const mongoose = require('mongoose');
//참조용 단축키 변수 만들기
const Review = require('./review');
const Schema = mongoose.Schema;

// 이미지 최적화
// https://res.cloudinary.com/doo4mczu4/image/upload/w_400/v1682684687/YelpCamp/hoytwtgse4l5jjeoa9c9.jpg

const ImageSchema = new Schema({
    url: String,
    filename: String,
});
ImageSchema.virtual('thumbnail').get(function(){
    //비파괴메서드
    return this.url.replace('/upload', '/upload/w_200');
})

// By default, Mongoose does not include virtuals when you convert a document to JSON. https://mongoosejs.com/docs/tutorials/virtuals.html#virtuals-in-json
const opts = { toJSON: { virtuals: true } }

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String, // Don't do `{ geometry: { type: String } }`
            enum: ['Point'], //'geometry.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts);

//clusterMap에 팝업을 추가하기 위해, 가상 properties 생성
CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

//(콜백에) 문서를 전달하는 쿼리 미들웨어
CampgroundSchema.post('findOneAndDelete', async(doc)=>{
    if(doc){
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
