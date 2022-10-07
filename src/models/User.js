const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    min: 6,
    max: 10,    
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
    min: 6,
    max: 20,
  },  
  email: {
    type: String,
    required: false,
    min: 6,
    max: 255,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  disabled: {
    type: Boolean,
    default: false,
  },  
  type: {
    type: String,
    enum: ['hairdresser', 'administrator', 'sys_admin'],
    default: 'hairdresser',
  },
  company: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'companies'
  },
  device: {
    type: String
  },
  disabledAt: {
    type: Date
  },  
  ratedUs: {
    type: Boolean,
    default: false, 
  },  
  configuration: {     
    table: {
      type: String,
      enum: ['mobile', 'simple'],
      default: 'mobile',
    },  
  },
  services: [ 
    {
      type: {
        type: String,
        max: 50,
        trim: true,
      },
      price: {
        type: Number
      },
      percentCommission: {
        type: Number
      },
    }
  ],   
  percentCommission: {
    type: Number,
    default: 50,
  },
  allowEditOrder: {
    type: Boolean,
    default: false, 
  },    
  xp: {
    type: Number,
    default: 0.00,
  },  
  hiddenCommission: {
    type: Boolean,
    default: false, 
  },    
});

userSchema.set('timestamps', true);

module.exports = mongoose.model('users', userSchema);
