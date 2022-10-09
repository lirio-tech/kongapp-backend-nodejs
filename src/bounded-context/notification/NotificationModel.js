const mongoose = require('mongoose');

// const moment = require('moment-timezone');
// const dateSaoPaulo = moment.tz(Date.now(), "America/Sao_Paulo");

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 3,
    max: 100,
  },
  description: {
    type: String,
    required: true,
    min: 3,
    max: 500,
  },
  isNotRead: {
    type: Boolean,
    default: true,     
  },
  type: {
    type: String,
    enum: ['NEW_SCHEDULE', 'SIGNATURE_EXPIRATION', 'WARNING'],
    required: true
  }, 
  view: {
    type: String,
    enum: ['HOME', 'LIST'],
    required: true,
    default: 'LIST',
  },   
  mdi: {
    type: String,
    max: 100,
  },
  emojiIcon: {
    type: String,
    max: 100,
  },  
  path: {
    type: String,
    max: 100,
  },  
  hyperLink: {
    type: String,
    max: 1000,
  },
  company: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'companies'
  },    
  onlyAdmin: {
    type: Boolean,
    default: true,     
  },      
  // createdAt: {
  //   type: Date,
  //   required: true, 
  //   default: dateSaoPaulo
  // },
  // updatedAt: {
  //   type: Date,
  //   required: true, 
  //   default: dateSaoPaulo
  // }                  
});
notificationSchema.set('timestamps', true);
module.exports = mongoose.model('notifications', notificationSchema);
