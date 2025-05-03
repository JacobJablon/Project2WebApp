const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => res.render('app');

const feedPage = async (req, res) => res.render('feed');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.emotion) {
    return res.status(400).json({ error: 'Name, age, and emotion are all required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    emotion: req.body.emotion,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, emotion: newDomo.emotion });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age emotion').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const getAllDomos = async (req, res) => {
  try {
    const docs = await Domo.find().select('name age emotion').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  feedPage,
  getAllDomos,
  getDomos,
};
