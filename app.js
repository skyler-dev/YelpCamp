const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
        
    })

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }));

//override with POST having ?_method=PUT
//쿼리문자열로 사용할 문자열 전달. 변경 가능.
app.use(methodOverride('_method'));

app.get('/', (req, res)=>{
    res.render('home')
})
// **********************************
//  INDEX 
// **********************************
app.get('/campgrounds', async(req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
})

// **********************************
// NEW & CREATE
// **********************************
// (주의) 'campgrounds/new'는 '/campgrounds/:id' 아래에 있으면 안된다. new가 :id로 처리된다.
app.get('/campgrounds/new', (req, res)=>{
    res.render('campgrounds/new');
})

app.post('/campgrounds', async(req, res)=>{
    //res.send(req.body);
        // req.body는 {"campground":{"title":"오두막","location":"부산, 대한민국"}}
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})
// **********************************
// SHOW
// **********************************
app.get('/campgrounds/:id', async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground })
})

//*******************************************
// EDIT & UPDATE
// *******************************************
app.get('/campgrounds/:id/edit', async(req, res)=>{
    //편집할 항목 조회
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
})
app.put('/campgrounds/:id', async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {new: true, runValidators: true});
    //업데이트 된 데이터를 받겠다는 옵션은 생략가능
    res.redirect(`/campgrounds/${campground._id}`);
})
// *******************************************
// DELETE
// *******************************************
app.delete('/campgrounds/:id', async(req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})




app.listen(3000, ()=>{
    console.log('Serving on port 3000')
})