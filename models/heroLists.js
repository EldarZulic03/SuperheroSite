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
   }],
   updated: {
    type: Date,
    default: Date.now
   },
   username: {
    type: String,
    required: true
   },
   description: {
    type: String
   },
   reviews: {
      type : [String]
   },
   isPublic: {
      type: Boolean,
      default: false
   },
   ratings: {
      type: [Number]
   },
   disabledDMCA: {
      type: Boolean,
      default: false
   },
   dmcaClaim: {
      type: String
   }
});

module.exports = mongoose.model('heroLists', heroListSchema);