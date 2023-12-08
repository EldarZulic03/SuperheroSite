const mongoose = require('mongoose');

const siteUserSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String, 
        required: true
    },
    username:{
        type: String, 
        required: true
    },
    verification:{
        type: Boolean,
        default: false,
        required: true
    },
    activated:{
        type: Boolean,
        default: true,
        required: true
    },
    lists:{
        type: [String],
        default: [],
        required: true
    }
});

module.exports = mongoose.model('siteUsers', siteUserSchema);