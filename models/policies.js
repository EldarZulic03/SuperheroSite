const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});


module.exports = mongoose.model('Policy', PolicySchema);