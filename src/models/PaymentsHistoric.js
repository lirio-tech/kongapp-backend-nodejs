const mongoose = require('mongoose');

const paymentsHistoricSchema = new mongoose.Schema({
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
  company: {
    _id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'companies'
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255,
        trim: true,
    },  
    shortName: {
        type: String,
        required: true,
        min: 6,
        max: 255,
        trim: true,
    },     
  }
})

paymentsHistoricSchema.set('timestamps', true);
module.exports = mongoose.model('paymentsHistoric', paymentsHistoricSchema);