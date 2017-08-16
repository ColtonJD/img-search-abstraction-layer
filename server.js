const https = require('https');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
//Mongoose model (collection + schema)
const searchModel = require('./models/searchModel.js');
const bodyParser = require('body-parser');
//Pulls database url/credentials && API keys
const keys = require('./config/config.js');
const Bing = require('node-bing-api')({accKey: keys.key1});

//Grab static views
app.use(express.static(__dirname + '/views'));

//Fireup middleware
app.use(bodyParser.json());

//Establish db connection
mongoose.connect(keys.dbUrl);
const db = mongoose.connection;

app.get('/', (req, res, next) => {
  
});

//Returns JSON of last 10 searches
app.get('/api/previous', (req, res, next) => {
  searchModel.find({}, {_id: 0, search: 1, when: 1}).sort({when: 1}).limit(10).exec((err, data) => {
    if(err){throw err};
    console.log(data);
    res.end(JSON.stringify(data));
  });
});

//Returns JSON of first 10 images from Bing for search term
app.get('/api/imagesearch/:term', (req, res, next) =>{
  
  let page = req.query.offset ? req.query.offset : 1;
  let { term } = req.params;
  
  const result = Bing.images(term, {
    //node-bing-api options for image search
    offset: page,
    count: 10,
    market: 'en-US'
  }, 
  (error, response, body) => {
    if(error){throw error};
    
    const insertObj = new searchModel ({
      search: term,
      when: Date.now()
    });
    insertObj.save((err)=>{
      if(err){
        console.log(err);
        console.log('There was an error saving the search to the DB');
      } else{
        console.log('Success! The search was saved to the db');
      }
    });
    res.end(JSON.stringify(body.value));
  });
  
  
});

app.listen(process.env.PORT, ()=>{
  console.log('Listening on port ' + process.env.PORT);
})