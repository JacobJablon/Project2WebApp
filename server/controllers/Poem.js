const models = require('../models');

const { Poem } = models;

const accountPage = async (req, res) => res.render('account');

const writerPage = async (req, res) => res.render('writer');

const feedPage = async (req, res) => res.render('feed');

const writePoem = async (req, res) => {
  if (!req.body.name || !req.body.poem || !req.body.privacy || !req.body.anonymity) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const poemData = {
    name: req.body.name,
    poem: req.body.poem,
    privacy: req.body.privacy,
    anonymity: req.body.anonymity,
    writer: req.session.account._id,
  };

  try {
    const newPoem = new Poem(poemData);
    await newPoem.save();
    return res.status(201).json({ name: newPoem.name, poem: newPoem.poem });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Poem already uploaded!' });
    }
    return res.status(500).json({ error: 'An error occured uploading poem!' });
  }
};

const getMyPoems = async (req, res) => {
  try {
    const query = { writer: req.session.account._id };
    const docs = await Poem.find(query).select('name poem privacy anonymity likes createdDate').sort({ createdDate: -1 }).lean().exec();

    return res.json({ poems: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving poems!' });
  }
};

const getMyPoemCount = async (req, res) => {
  try {
    const query = { writer: req.session.account._id };
    const docs = await Poem.countDocuments(query).lean().exec();

    return res.json({ poemCount: docs });
  } catch (err) {
    return res.status(500).json({ error: 'Error retrieving poem count!' });
  }
};

const getAllPublicPoems = async (req, res) => {
  try {
    const query = { privacy: false };
    const docs = await Poem.find(query).populate('writer', 'username').select('name poem anonymity likes writer createdDate').sort({ createdDate: -1 }).lean().exec();

    const anonymitySecuredPoems = docs.map((poem) => ({
      ...poem,
      writer: poem.anonymity ? { username: 'Anonymous Poet' } : poem.writer,
    }));

    return res.json({ poems: anonymitySecuredPoems });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving poems!' });
  }
};

const deletePoemById = async (req, res) => {
  try {
    await Poem.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Poem deleted sucessfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting poem!' });
  }
};

const likeOrUnlikePoem = async (req, res) => {
  try {
    const userId = req.session.account._id;
    const poem = await Poem.findById(req.params.id);

    // where in the poem.likedBy array the user's id is
    const likedByIndex = poem.likedBy.indexOf(userId);

    // if the user's id isn't in the poem.likedBy array it will be -1
    if (likedByIndex === -1) {
      poem.likedBy.push(userId);
      poem.likes += 1;
    } else {
      poem.likedBy.splice(likedByIndex, 1);
      poem.likes -= 1;
    }

    await poem.save();
    // return T/F based on if it is or isn't now liked
    return res.status(200).json({ likes: poem.likes, liked: likedByIndex === -1 });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error updating like status!' });
  }
};

module.exports = {
  accountPage,
  writerPage,
  writePoem,
  feedPage,
  getAllPublicPoems,
  getMyPoems,
  getMyPoemCount,
  deletePoemById,
  likeOrUnlikePoem,
};
