const mongoose = require('mongoose');

const planCustomCompanySchema = new mongoose.Schema({
  plan: {
    type: String,
    required: true,
    min: 1,
    max: 10000,
  },
  companyId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'companies'
  },
  userId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'users'    
  }
});

planCustomCompanySchema.set('timestamps', true);

module.exports = mongoose.model('planCustomCompany', planCustomCompanySchema);
