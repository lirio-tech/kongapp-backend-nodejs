const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
      priceCommission: {
        type: Number
      },
      percentCommission: {
        type: Number
      },
      priceCompany: {
        type: Number
      },                  
    }
  ],     
  total: {
    type: Number
  },
  commission: {
    type: Number
  },  
  totalCompany: {
    type: Number
  },
  paymentType: {
    type: String,
    enum: ['cash', 'card', 'pix'],
    default: 'cash',
  }, 
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
    username: {
      type: String,
      required: true,
      min: 6,
      max: 10,    
    }
  },
  date: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  }, 
  customer: {
    name: {
      type: String,
      required: false,
      max: 50,
      trim: true,
    },
    phone_number: {
      type: String,
      max: 20,
      trim: true,
    }
  }, 
  company: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'companies'
  },  
  createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
  },  
  updatedByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },    
  cardRate: {
    type: Number,
    default: 0.00,
  },     
  cardRateValueDiscount: {
    type: Number,
    default: 0.00,
  },
  netTotal: { // total - cardRateValueDiscount
    type: Number,
    default: 0.00,
  },  
});
orderSchema.set('timestamps', true);
module.exports = mongoose.model('orders', orderSchema);
