const mongoose = require('mongoose');
//참조용 단축키 변수 만들기
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
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
