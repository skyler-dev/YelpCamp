const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

const Campground = require('../models/campground');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
        
    })

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0 ; i <300 ; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6447a1783e644889a140435c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/doo4mczu4/image/upload/v1682681943/YelpCamp/pcyubcxdfxlstxnwihtm.jpg',
                    filename: 'YelpCamp/pcyubcxdfxlstxnwihtm'
                },
                {
                    url: 'https://res.cloudinary.com/doo4mczu4/image/upload/v1682681946/YelpCamp/ecwcgd6cpbx4ilzptoma.jpg',
                    filename: 'YelpCamp/ecwcgd6cpbx4ilzptoma',
                },
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores numquam veritatis iure esse eum quae doloribus cum unde repudiandae, eaque fuga commodi iusto, quasi beatae sed delectus quis, neque illum?',
            price,
        })
        await camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})