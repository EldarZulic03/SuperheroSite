const mongoose = require('mongoose');

const heroListSchema = mongoose.Schema({
   name: {
    type: String, 
    required: true, 
    unique: true
   },
   superheroes: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Superhero'
   }]
});

module.exports = mongoose.model('heroLists', heroListSchema);