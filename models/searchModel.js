const mongoose = require('mongoose');
//Standard Record Format 
const schema = new mongoose.Schema({
  search: String,
  when: { type: Date, default: Date.now() }
}, {collection: 'imageSearch'});
//Define collection for use and schema
const model = mongoose.model('imageSearch', schema);

module.exports = model;