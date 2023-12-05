require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 5001; //port number


// console.log("DATABASE_URL:", process.env.DATABASE_URL); // testing

//connect to database
mongoose.connect(process.env.DATABASE_URL);


const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () =>console.log('Connected to Database'));



app.use(express.json());

const superheroesRouter = require('../routes/superheroes');
app.use('/superheroes', superheroesRouter);

app.listen(port, () => console.log('Server Started'));