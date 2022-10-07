const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Free','Basico','Gold','É Nóis','Tamo Junto','Infinity'],
    default: 'Free',
  },
  type: {
    type: String,
    enum: ['Free','Mensal','Anual','Infinity'],
    default: 'Free',
  },
  price: {
    type: Number
  }, 
  benefits: [
    {
      icon: {
        type: String,
        min: 6,
        max: 255,
        trim: true,        
      },
      description: {
        type: String,
        min: 6,
        max: 255,
        trim: true,        
      }
    }
  ],
  labelButton: {
    type: String,
    required: true,
    min: 6,
    max: 255,
    trim: true,
  },    
  color: {
    type: String,
    required: true,
    min: 6,
    max: 255,
    trim: true,    
  },
  advantage: {
    type: Boolean,
    default: false
  }
});

planSchema.set('timestamps', true);
module.exports = mongoose.model('plans', planSchema);