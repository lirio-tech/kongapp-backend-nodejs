const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  ratingDescription: {
    type: String,
    required: true,
    min: 1,
    max: 500,
  },
  scoreRating: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  }  
});

userSchema.set('timestamps', true);

module.exports = mongoose.model('rateus', userSchema);
