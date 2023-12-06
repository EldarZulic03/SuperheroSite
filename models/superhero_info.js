const mongoose = require('mongoose');

const superhero_infoSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    }, 
    name: {
        type: String, 
        required: true
    }, 
    Gender: {
        type: String, 
        required: true
    }, 
    "Eye color": {
        type: String, 
        required: true, 
        default: '-'
    }, 
    Race: {
        type: String, 
        required: true, 
        default: '-'
    }, 
    "Hair color": {
        type: String, 
        required: true, 
        default: '-'
    }, 
    Height: {
        type: Number, 
        required: true
    }, 
    Publisher: {
        type: String, 
        required: true
    }, 
    "Skin color":{
        type: String, 
        required: true,
        default: '-',
    }, 
    Alignment: {
        type: String, 
        required: true
    }, 
    Weight: {
        type: Number, 
        required: true
    }

}, 
{collection: 'superheroinfo'})

module.exports = mongoose.model('superheroinfo', superhero_infoSchema);