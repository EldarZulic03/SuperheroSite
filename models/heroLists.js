const mongoose = require('mongoose');

const heroListSchema = mongoose.Schema({
   name: {
    type: String, 
    required: true, 
    unique: true
   },
   heroes: [{
    type: Number, 
    ref: 'heroes'
   }]
});

module.exports = mongoose.model('heroLists', heroListSchema);