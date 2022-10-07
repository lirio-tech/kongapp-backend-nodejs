const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    company: {
      type:mongoose.Schema.Types.ObjectId,
      ref:'companies'
    },
  },
  balance: {
    type: Number,
    default: 0
  }
});

userSchema.set('timestamps', true);

module.exports = mongoose.model('usersBalance', userSchema);
