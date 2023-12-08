const express = require('express');
const router = express.Router();
const superheroInfo = require('../models/superhero_info');
const superheroPowers = require('../models/superhero_powers');
const heroList = require('../models/heroLists');
const users = require('../models/siteUsers');
const argon2 = require('argon2');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


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
  let searchField;

  switch (field.toLowerCase()) {
    case 'name':
      searchField = 'name';
      break;
    case 'race':
      searchField = 'Race';
      break;
    case 'publisher':
      searchField = 'Publisher';
      break;
    case 'id':
      searchField = 'id';
      break;
    default:
      return res.status(400).json({ error: 'Invalid field.' });
  }

  let searchPattern;

  if (searchField === 'id') {
    if (isNaN(pattern)) {
      return res.status(400).json({ error: 'Invalid id.' });
    }

    searchPattern = Number(pattern);
  } else {
    searchPattern = { $regex: pattern, $options: 'i' };
  }

  if (searchField !== "power"){
    matchingSuperheroes = await superheroInfo.find({ [searchField]: searchPattern });
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
      delete superhero._id;
      return { name: superhero.name,
        info: {...superhero._doc, name:undefined, _id:undefined},
        powers: powers };
    }
    return null;
  }));

  // cut the search to match limit
  if (n && superheroesInList.length > n) {
    superheroesInList = superheroesInList.slice(0, n);
  }
  
  res.json({ superheroes: superheroesInList.filter(Boolean) });
});


//get list superhero info
router.get('/lists/:name/superheroes', async (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(400).json({ error: 'Name is Needed in the Request Params' });
  }

  const list = await heroList.findOne({ name: name }); //find the list by name

  if (!list) {
    return res.status(404).json({ error: 'List Name Does Not Exists' });
  }

  const heroes = await superheroInfo.find({
    id: { $in: list.heroes }
  }).select('-_id');

  // Fetch powers for each hero and structure the response
  const heroesWithPowers = await Promise.all(heroes.map(async (hero) => {
    let powers = await superheroPowers.findOne({ hero_names: hero.name });
    powers = remove(powers ? powers.toObject() : {});
    delete powers._id;
    delete powers.__v;
    delete powers.hero_names;
    return {
      name: hero.name,
      info: {
        id: hero.id,
        Gender: hero.Gender,
        "Eye color": hero["Eye color"],
        Race: hero.Race,
        "Hair color": hero["Hair color"],
        Height: hero.Height,
        Publisher: hero.Publisher,
        "Skin color": hero["Skin color"],
        Alignment: hero.Alignment,
        Weight: hero.Weight
      },
      powers: powers
    };
  }));

  res.status(200).json(heroesWithPowers);
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



//Edit list
router.post('/lists/:name', async (req, res) => {
  const { name, heroIds } = req.body;

  if (!name || !heroIds) {
    return res.status(400).json({ error: 'Both the Name and Hero IDs are Needed in the Request Body' });
  }

  const existingList = await heroList.findOne({ name: name });

  if (!existingList) {
    return res.status(404).json({ error: 'List Name Does Not Exists' });
  }

  existingList.heroes = heroIds;
  await existingList.save();

  res.status(200).json({ message: "List Successfully Updated" });
});

router.get('/lists/:name', async (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(400).json({ error: 'Name is Needed in the Request Params' });
  }

  const existingList = await heroList.findOne({ name: name }).select('name heroes -_id');

  if (!existingList) {
    return res.status(404).json({ error: 'List Name Does Not Exists' });
  }

  res.status(200).json(existingList);
});

//Delete List
router.delete('/lists/:name', async (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(400).json({ error: 'Name is Needed in the Request Params' });
  }

  const deletedList = await heroList.findOneAndDelete({ name: name });

  if (!deletedList) {
    return res.status(404).json({ error: 'List Name Does Not Exists' });
  }

  res.status(200).json({ message: 'List Deleted Successfully' });
});





//Remove Superhero from list
router.delete('/lists/:name/superheroes/:id', async (req, res) => {
  const { name, id } = req.params;

  if (!name || !id) {
    return res.status(400).json({ error: 'Name and ID are Needed in the Request Params' });
  }

  const updatedList = await heroList.findOneAndUpdate(
    { name: name },
    { $pull: { heroes: id } },
    { new: true }
  );

  if (!updatedList) {
    return res.status(404).json({ error: 'List Name Does Not Exists' });
  }

  res.status(200).json({message: 'Superhero Removed Successfully'});
});

// Register User
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Enter an Email!' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Enter a Password!' });
  }
  if (!username) {
    return res.status(400).json({ error: 'Enter a Username!' });
  }
  if(!email.includes('@') || !email.includes('.')){
    return res.status(400).json({ error: 'Enter a Valid Email' });
  }


  const existingUser = await users.findOne({ email: email });

  // check if the user already exists
  if (existingUser) {
    return res.status(409).json({ error: 'This Email Already Exists' });
  }

  //hash the password
  const hashedPassword = await argon2.hash(password);

  //creates the new user
  const newUser = new users({ email: email, password: hashedPassword, username: username });
  await newUser.save();

  verifyAccount(newUser.username, newUser.email);

  res.status(201).json({ message: "User Successfully Created" });
}); 

// Verify User
router.get('/verify/account', async (req, res) => {
  const email = decodeURIComponent(req.query.email);

  if (!email) {
    return res.status(400).json({ error: 'Email is Needed in the Request Query' });
  }

  const existingUser = await users.findOne({ email: email });

  if (!existingUser) {
    return res.status(404).json({ error: 'User Not Found' });	
  }

  if (existingUser.verification) {
    return res.status(409).json({ error: 'User Already Verified' });
  }

  existingUser.verification = true;
  await existingUser.save();
  
  res.redirect('/verificationPage.html');
});


// login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Enter an Email!' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Enter a Password!' });
  }
  if(!email.includes('@') || !email.includes('.')){
    return res.status(400).json({ error: 'Enter a Valid Email' });
  }

  const existingUser = await users.findOne({ email: email });

  if (!existingUser) {
    return res.status(404).json({ error: 'User Not Found' });

  }

  if (!existingUser.verification) {
    return res.status(403).json({ error: 'User Not Verified' });
  }
  if(!existingUser.activated){
    return res.status(403).json({ error: 'User Not Activated, Contact Admin to Reactivate!' });
  }

  if (await argon2.verify(existingUser.password, password)) {
    let token = jwt.sign({ email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.status(200).json({ message: 'User Successfully Logged In', token: token });
  } else {
    res.status(403).json({ error: 'Incorrect Password' });
  }
});

router.post('/resend-email', async (req, res) => {
  const email = req.body.email
  verifyAccount('user',email );
  if (!email) {
    return res.status(400).json({ error: 'Enter an Email!' });
  }
  return res.status(200).json({ message: 'Email Sent' });
});

router.post('/changePassword', checkToken, async (req, res) => {
  const { email, password, newPassword } = req.body;

  if (!email || !password || !newPassword) {
    return res.status(400).json({ error: 'Email, Password, and New Password are Needed in the Request Body' });
  }

  const existingUser = await users.findOne({ email: email });

  if (!existingUser) {
    return res.status(404).json({ error: 'User Not Found' });
  }

  if (!existingUser.verification) {
    return res.status(403).json({ error: 'User Not Verified' });
  }

  if (await argon2.verify(existingUser.password, password)) {
    const hashedPassword = await argon2.hash(newPassword);
    existingUser.password = hashedPassword;
    await existingUser.save();
    res.status(200).json({ message: 'Password Successfully Changed' });
  }
  else{
    return res.status(403).json({ error: 'Incorrect Password' });
  }
});

router.post('/authenticate', checkToken, async (req, res) => {

  res.status(200).json({ message: 'User Authenticated' });
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

async function verifyAccount(name, email) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'eldartester13@gmail.com', // your Gmail email
      pass: 'barr gahe eyzi rpiu' // your Gmail password
    }
  });

  // generate verification link
  const verificationLink = `http://localhost:5001/superheroes/verify/account?email=${encodeURIComponent(email)}`;

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Eldar Zulic" <eldartester13@gmail.com>', // sender address
    to: email, // receiver address
    subject: 'Account Verification', // Subject line
    text: `Hello ${name},\n\nPlease verify your account by clicking the following link: ${verificationLink}`, // plain text body
    html: `<b>Hello ${name},</b><br>Please verify your account by clicking the following link: <a href="${verificationLink}">Verify Account</a>` // html body
  });

  console.log('Verification email sent: %s', info.messageId);
}

async function checkToken(req, res, next) {
  const token = req.headers['authorization'];
  console.log('Token from request:', token); //debugging

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); //debugging
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(403).json({ error: 'Invalid token' });
  }
}

module.exports = router;