const mongoose = require('mongoose');
//참조용 단축키 변수 만들기
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body : String,
    rating : Number,
});

module.exports = mongoose.model('Review', reviewSchema);