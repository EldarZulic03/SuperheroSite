require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 5001; //port number
const fs = require('fs');
const path = require('path');
const argon2 = require('argon2');



// console.log("DATABASE_URL:", process.env.DATABASE_URL); // testing

//connect to database
mongoose.connect(process.env.DATABASE_URL);


const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () =>console.log('Connected to Database'));



app.use(express.json());

const superheroesRouter = require('../routes/superheroes');
app.use('/superheroes', superheroesRouter);
app.use(express.static(path.join(__dirname, '../clientapp/out')));

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


db.collection('siteUsers').estimatedDocumentCount({}, async (err, count) => {
    if (err) {
      console.error(err);
      return;
    }
  
    if (count === 0) {
      const hashedPassword = await argon2.hash(process.env.ADMIN_PW);
      const adminUser = {
        email: 'admin@admin.com',
        password: hashedPassword,
        username: 'Admin',
        verification: 'true',
        activated: 'true',
        lists: '[]',
        isAdmin: 'true'
      };
  
      db.collection('siteUsers').insertOne(adminUser, (err, result) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Admin user created');
      });
    } else {
      console.log('Admin user already exists');
    }
  });

  db.collection('heroLists').estimatedDocumentCount({}, (err, count) => {
    if (err) {
      console.error(err);
      return;
    }
  
    if (count === 0) {
      const fakeList = {
        name: 'Fake List',
        heroes: [1], // Replace with actual hero IDs
        username: 'Fake User',
        description: 'This is a fake list',
        isPublic: true,
      };
  
      db.collection('heroLists').insertOne(fakeList, (err, result) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Fake list created');
      });
    }
  });
db.collection('policies').estimatedDocumentCount({},(err,count) =>{
    if(count===0){
        const PASpolicy = fs.readFileSync('policies/PASpolicy.txt', 'utf8').replace(/\r\n/g, '<br />');
        const DMCApolicy = fs.readFileSync('policies/DMCApolicy.txt', 'utf8').replace(/\r\n/g, '<br />');
        const AUPpolicy = fs.readFileSync('policies/AUpolicy.txt', 'utf8').replace(/\r\n/g, '<br />');
        const allPolicies =[
            {name: 'PASpolicy', text: PASpolicy},
            {name: 'DMCApolicy', text: DMCApolicy},
            {name: 'AUPpolicy', text: AUPpolicy}
        ];
        db.collection('policies').insertMany(allPolicies, (err,res) =>{
            if(err){
                throw err;
            }
            console.log("Data Elements added: " + res.insertedCount);
        });
    }else{
        console.log("Data already exists in collection: policies");
    }
})




app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../clientapp/out/landing.html'));
});