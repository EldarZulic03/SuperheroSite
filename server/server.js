require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 5001; //port number
const fs = require('fs');
const path = require('path');
const siteUsers = require('../models/siteUsers');
const superheroinfo = require('../models/superhero_info');
const superheropowers = require('../models/superhero_powers');

async function startServer() {
  try {
    

    await mongoose.connect('mongodb://0.0.0.0:27017/superhero_database');
    console.log('Database Connected Successfully');

    const db = mongoose.connection;
    db.on('error', (error) => console.error(error));
    db.once('connected', () => console.log('Connected to Database'));

    if (mongoose.connection.readyState === 1) {

        app.use(express.static(path.join(__dirname, '../clientapp/out'))); 
        app.use(express.json());
    
        const superheroesRouter = require('../routes/superheroes');
        app.use('/superheroes', superheroesRouter);
    
        // Load your data here
        await loadDataIfEmpty(db,'superhero_info.json', 'superheroinfo');
        await loadDataIfEmpty(db,'superhero_powers.json', 'superheropowers');
        await loadAdminIfEmpty(db);
    
        app.listen(port, () => console.log(`Server Started! running on port ${port}`));
    }
   
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

startServer();



function loadData(db, fileName, collection){

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
const loadDataIfEmpty = async (db,fileName, collection) => {
    try {
        db.collection(collection).estimatedDocumentCount().then(count =>{
            if(count === 0){
                loadData(db, fileName, collection);
            }else{
                console.log("Data already exists in collection: " + collection + "count: " + count);
            }
        })
    } catch (err) {
        console.error(err);
    }
};


const loadAdminIfEmpty = async (db) => {
    try {
        const collection = 'siteUsers';
        db.collection(collection).estimatedDocumentCount().then(count => {
            if(count === 0){
                const admin = {
                    email: 'admin@admin.com',
                    password: process.env.ADMIN_PW,
                    username: 'admin',
                    verification: true,
                    activated: true,

                };
                db.collection(collection).insertOne(admin, (err, res) => {
                    if(err){
                        throw err;
                    }
                    console.log("Admin account added");
                });
            } else {
                console.log("Admin account already exists");
            }
        })
    } catch (err) {
        console.error(err);
    }
};



// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../clientapp/out/landing.html'));
// });