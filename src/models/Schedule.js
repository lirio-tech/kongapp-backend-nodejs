
const mongoose = require('mongoose');

const schedulesSchema = new mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: true,
      max: 50,
      trim: true,
    },
    phone_number: {
      type: String,
      max: 20,
      trim: true,
    }
  }, 
  user: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },
    name: {
      type: String,
      required: false,
      min: 6,
      max: 255,
    },
    username: {
      type: String,
      required: false,
      min: 6,
      max: 10,    
    }
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
    }
  ],
  total: {
    type: Number
  },  
  companyId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'companies'
  }, 
  dateTimeStartAt: {
    type: Date,
    required: true,
  },      
  dateTimeEndAt: {
    type: Date,
    required: true,
  },        
  status: {
    type: String,
    enum: ['PENDING', 'DONE', 'CANCELED', 'REQUESTED'],
    default: 'PENDING',    
  },
  statusInitial: {
    type: String,
    enum: ['PENDING', 'DONE', 'CANCELED', 'REQUESTED'],  
  },  
  orderId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'orders'
  },   
  createdBy: {
    type: String,
    required: false,
    min: 6,
    max: 255,
  },  
},
);
 
schedulesSchema.set('timestamps', true);
module.exports = mongoose.model('schedules', schedulesSchema);