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

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
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
