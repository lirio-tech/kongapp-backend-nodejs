const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  value: {
    type: Number,
    default: 0
  },
  date: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  }, 
  type: {
    type: String,
    required: true,
    enum: ['PAYMENT', 'MONEY_VOUCHER', 'SERVICE_PERFORMED'],
  },   
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'orders'
  },
  description: {
    type: String,
    required: true,
    min: 3,
    max: 30,    
  },
  active: {
    type: Boolean,
    default: true
  },  
});

userSchema.set('timestamps', true);

module.exports = mongoose.model('usersBalanceDetail', userSchema);
