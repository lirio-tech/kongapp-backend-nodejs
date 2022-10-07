const mongoose = require('mongoose');

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
});
notificationSchema.set('timestamps', true);
module.exports = mongoose.model('notifications', notificationSchema);
