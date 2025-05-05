const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const PoemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  poem: {
    type: String,
    required: true,
  },
  privacy: {
    type: Boolean,
    required: true,
  },
  anonymity: {
    type: Boolean,
    required: false,
    default: true,
  },
  likes: {
    type: Number,
    min: 0,
    required: false,
    default: 0,
  },
  writer: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

PoemSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  poem: doc.poem,
});

const PoemModel = mongoose.model('Poem', PoemSchema);
module.exports = PoemModel;
