const express = require('express');
const router = express.Router();
const superheroInfo = require('../models/superhero_info');
const superheroPowers = require('../models/superhero_powers');
const heroList = require('../models/heroLists')



// Get all superheroes
router.get('/', async (req, res) => {
  try {
    const superheroes = await superheroInfo.find();
    res.json(superheroes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Search
router.get('/search', async (req, res) => {
  const { field, pattern, n } = req.query;
  

  if (!field || !pattern) {
    return res.status(400).json({ error: 'Field and pattern are required query parameters.' });
  }

  let matchingSuperheroes;
  let heroIds = [];

  if (field.toLowerCase() !== "power"){
    matchingSuperheroes = await superheroInfo.find({ [field]: { $regex: pattern, $options: 'i' } });
    heroIds = matchingSuperheroes.map((item) => item.id);
  }else{
    matchingSuperheroes = await superheroPowers.find({ [pattern]: "True" });
    heroIds = await Promise.all(matchingSuperheroes.map(async (hero) => {
      const heroName = hero.hero_names;
      const matchingHero = await superheroInfo.findOne({ name: heroName });

      if (matchingHero) {
        return matchingHero.id;
      }
    })); 
  }

  console.log(heroIds);

  heroIds = heroIds.filter((id) => id !== undefined);

  let superheroesInList = await Promise.all(heroIds.map(async (id) => {
    const superhero = await superheroInfo.findOne({ id: id });
    if (superhero) {
      let powers = await superheroPowers.findOne({ hero_names: superhero.name });
      powers = remove(powers ? powers.toObject() : {});
      delete powers._id;
      delete powers.__v;
      delete powers.hero_names;
      
      return { name: superhero.name, powers: powers };
    }
    return null;
  }));

  let listName = "NA";
  
  // cut the search to match limit
  if (n && superheroesInList.length > n) {
    superheroesInList = superheroesInList.slice(0, n);
  }

  res.json({ listName, superheroes: superheroesInList.filter(Boolean) });
});

// Get one superhero
router.get('/:id', async (req, res) => {
  try {
    const superhero = await superheroInfo.findOne({ id: req.params.id });
    if (superhero == null) {
      return res.status(404).json({ message: 'Cannot find superhero' });
    }
    res.json(superhero);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});


//Get Powers
router.get('/:id/powers', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const superhero = await superheroInfo.findOne({ id: id });

    if (superhero) {
      const superheroName = superhero.name;
      let powers = await superheroPowers.findOne({ hero_names: superheroName });

      if (powers) {
        let powersObject = powers.toObject();
        delete powersObject._id;
        delete powersObject.__v;
        powersObject = remove(powersObject);
        delete powersObject.hero_names;
        res.json(powersObject);
      } else {
        res.status(404).json({ error: 'Superhero powers not found' });
      }
    } else {
      res.status(404).json({ error: 'Superhero not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



//Create List
router.post('/lists', async (req, res) => {
  const { name, heroIds } = req.body;

  if (!name || !heroIds) {
    return res.status(400).json({ error: 'Both the Name and Hero IDs are Needed in the Request Body' });
  }

  const existingList = await heroList.findOne({ name: name });

  if (existingList) {
    return res.status(409).json({ error: 'This List Name Already Exists' });
  }

  const newList = new heroList({ name: name, heroes: heroIds });
  await newList.save();

  res.status(201).json({ message: "List Successfully Created" });
});

//Edit List
router.get('/lists/:name', async (req, res) => {
  const { name } = req.params;

  const list = await heroList.findOne({ name: name });

  if (!list) {
    return res.status(404).json({ error: 'List Not Found' });
  }

  res.json(list);
});

//Edit list
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


function remove(jsonData) {
  if (jsonData && jsonData.hero_names) {
    const cleanedData = { hero_names: jsonData.hero_names };
    
    for (const key in jsonData) {
      if (jsonData[key] === "True") {
        cleanedData[key] = "True";
      }
    }

    return cleanedData;
  }

  return jsonData;
}

module.exports = router;