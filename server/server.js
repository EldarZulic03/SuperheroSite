require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 5001; //port number
const fs = require('fs');
const path = require('path');



// console.log("DATABASE_URL:", process.env.DATABASE_URL); // testing

//connect to database
mongoose.connect(process.env.DATABASE_URL);


const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () =>console.log('Connected to Database'));



app.use(express.json());

const superheroesRouter = require('../routes/superheroes');
app.use('/superheroes', superheroesRouter);
app.use(express.static('../client'));

// app.use(express.urlencoded({extended:true}));

app.listen(port, () => console.log('Server Started'));

function loadData(fileName, collection){

    const filePath = ("../" + fileName);
    let info = fs.readFileSync(filePath);
    let parsedInfo = JSON.parse(info);

    db.collection(collection).insertMany(parsedInfo, (err,res) =>{
        if(err){
            throw err;
        }
        // console.log("Data Elements added: " + res.insertedCoun); //testing
    });
}
// loadData('superhero_info.json', 'superheroinfo');
// loadData('superhero_powers.json', 'superheropowers'); testing

//if collection is empty then load data if not then do nothing
const loadDataIfEmpty = async (fileName, collection) => {
    try {
        db.collection(collection).estimatedDocumentCount().then(count =>{
            if(count === 0){
                loadData(fileName, collection);
            }else{
                console.log("Data already exists in collection: " + collection + "count: " + count);
            }
        })
    } catch (err) {
        console.error(err);
    }
};

loadDataIfEmpty('superhero_info.json', 'superheroinfo');
loadDataIfEmpty('superhero_powers.json', 'superheropowers');