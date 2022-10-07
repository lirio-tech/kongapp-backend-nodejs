const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
    trim: true,
  },   
  shortName: {
    type: String,
    required: false,
    min: 2,
    max: 40,
    trim: true,
  },      
  path: {
    type: String,
    required: false,
    unique: true,
    min: 6,
    max: 1000,
    trim: true,
  },    
  plan: {
    name: {
      type: String,
      enum: ['Free','Basico','Gold','É Nóis','Tamo Junto','Infinity', 'Custom', 'Simples', 'Top', 'Smart'],
      default: 'Free',
    },
    dateStarted: {
      type: String,
      min: 6,
      max: 30,
    },   
    dateEnd: {
      type: String,
      min: 6,
      max: 30,
    },   
    amountUsers: {
      type: Number
    },
    amountUsersAdmin: {
      type: Number
    },
    amountUsersCommon: {
      type: Number
    },
    maxCash: {
      type: Number
    },
    payment: {
      price: {
        type: Number,
        default: 0,
      },
      status: {
        type: String,
        enum: ['PENDING', 'PERFORMED'],
        default: 'PENDING',        
      }      
    },     
  },
  planOld: {
    name: {
      type: String
    },
    dateStarted: {
      type: String,
      min: 6,
      max: 30,
    },   
    dateEnd: {
      type: String,
      min: 6,
      max: 30,
    },   
    amountUsers: {
      type: Number
    },
    amountUsersAdmin: {
      type: Number
    },
    amountUsersCommon: {
      type: Number
    },
    maxCash: {
      type: Number
    },      
    payment: {
      price: {
        type: Number
      },
      status: {
        type: String,
        enum: ['PENDING', 'PERFORMED'],
        default: 'PERFORMED',        
      }                  
    },
  },    
  cpfCnpj: {
    type: String,
    min: 9,
    max: 14,
    trim: true,
  },    
  email: {
    type: String,
    min: 6,
    max: 255,
    trim: true,
    lowercase: true,
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
      time: {
        type: String,
        max: 5,
        trim: true,
      },
    }
  ], 
  fake: {
    type: Boolean
  },     
  signupAmountUsers: {
    type: Number,
    default: 1
  },
  companyType: {
    type: String,
    enum: ['BARBER', 'LADY_SALON', 'PUB'],
    default: 'BARBER',
  },
  downgradePlanFree: {
    type: Boolean,
    default: false,     
  },
  percentCommission: {
    type: Number,
    default: 50,
  },
  viewOnlyCommission: {
    type: Boolean,
    default: true,
  },
  expireToken: {
    type: Boolean,
    default: false,
  },
  products: {
    schedule: {
      type: Boolean,
      default: true,
    },
  },
  cardRate: {
    type: Number,
    default: 2,
  },        
  pixCopyPast: {
    type: String,
  }
});
 
companySchema.set('timestamps', true);
module.exports = mongoose.model('companies', companySchema);
