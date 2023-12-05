const express = require('express');
const router = express.Router();

//Get all superheroes
router.get('/', (req,res) =>{

});

// Get one superhero
router.get('/:id', (req,res) =>{

});

//Get Powers
router.get('/:id/powers', (req,res) =>{

});

//Search
router.get('/search',(req,res) =>{

});

//Create List
router.post('/lists',(req,res) =>{

});

//Edit List
router.patch('/lists/:name', (req,res) =>{

});

//get list
router.get('/lists/:name', (req,res) =>{

});

//Delete List
router.delete('/lists/:name', (req,res) =>{

});

//get list superhero info
router.get('/lists/:name/superheroes', (req,res) =>{

});

//Add superhero to list
router.post('/lists/:name/superheroes', (req,res) =>{

});

//Remove Superhero from list
router.delete('/lists/:name/superheroes/:id', (req,res) =>{

});

module.exports = router;