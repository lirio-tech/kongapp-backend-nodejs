const mongoose = require('mongoose');

const recoverypasswordSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    min: 16,
    max: 64,
  },
  userId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'users'
  }    
});

recoverypasswordSchema.set('timestamps', true);

module.exports = mongoose.model('recoverypasswords', recoverypasswordSchema);
