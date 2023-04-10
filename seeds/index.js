//메인 앱과는 관련 없는 독립적인 파일
    //그러기 위해 Mongoose에 연결하고 모델을 사용.
    //목적 : DB에 시드하고 싶을 때마다 Node앱과는 별도로 실행
    //주의 : 이 파일을 node로 실행하면 DB를 초기화하니 조심해야함.
const mongoose = require('mongoose');
//도시배열 불러오기. 안에 도시객체1000개
const cities = require('./cities');
//장소배열과 설명어배열 불러오기. 결합해 캠핑장이름 만들기 용
const { places, descriptors } = require('./seedHelpers');

//change path
const Campground = require('../models/campground');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
        
    })

//램덤으로 배열 요소 선정해주는 함수
const sample = array => array[Math.floor(Math.random() * array.length)];
    //배열 전달하고 호출하면 랜덤 요소 반환

const seedDB = async () => {
    //DB의 데이터 삭제
    await Campground.deleteMany({});
    //루프로 캠핑장 50개 만들기
    //목적 : 랜덤숫자로 도시고르기, 이름만들기
    for(let i = 0 ; i <50 ; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        //0,1,2,...,999
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
        })
        await camp.save();
    }

}
// seedDB();
//YelpCamp > node seeds/index.js 하면 campgrounds collection의 모든 데이터가 삭제된다.

//작업을 완료하면 DB와 연결을 끊는다.(바로 node REPL 나갈 수 있게)
seedDB().then(() => {
    mongoose.connection.close();
})