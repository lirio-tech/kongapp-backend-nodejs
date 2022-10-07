const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({   
  companyId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'companies'
  },  
  instagram: {
    type: String,
    max: 100,
    trim: true,
  },  
  facebook: {
    type: String,
    max: 500,
    trim: true,
  },  
  title: {
    type: String,
    max: 100,
    trim: true,
  },    
  description: {
    type: String,
    max: 500,
    trim: true,
  },   
  whatsapp: {
    type: String,
    max: 30,
    trim: true,
  },        
  arroba: {
    type: String,
    required: false,
    unique: true,
    min: 2,
    max: 1000,
    trim: true,
  },
  subdomainSync: {
    type: Boolean,
    default: false,
  },  
  domain: {
    type: String,
    required: false,
    min: 2,
    max: 1000,
    trim: true,
  },  
  domainSync: {
    type: Boolean,
    default: false,
  },    
  photoCover: {
      type: String,
      trim: true,      
  },    
  photos: [
      {
        photo: {
          type: String,
          trim: true,      
        },             
      }
  ],
  openAt: {
    sunday: {
      isOpen: {
        type: Boolean,
        default: true
      },      
      timeStartAt: {
        type: String,
        trim: true,
        required: true, 
        default: "07:00"
      },
      timeEndAt: {
        type: String,
        trim: true,
        required: true,
        default: "22:00"
      },       
    }, 
    monday: {
      isOpen: {
        type: Boolean,
        default: true
      },      
      timeStartAt: {
        type: String,
        trim: true,
        required: true, 
        default: "07:00"
      },  
      timeEndAt: {
        type: String,
        trim: true,
        required: true, 
        default: "22:00"
      },       
    },     
    tuesday: {
      isOpen: {
        type: Boolean,
        default: true
      },      
      timeStartAt: {
        type: String,
        trim: true,
        required: true, 
        default: "07:00"
      },  
      timeEndAt: {
        type: String,
        trim: true,
        required: true, 
        default: "22:00"
      }, 
    },      
    wednesday: {
      isOpen: {
        type: Boolean,
        default: true
      },
      timeStartAt: {
        type: String,
        trim: true,
        required: true, 
        default: "07:00"
      },  
      timeEndAt: {
        type: String,
        trim: true,
        required: true, 
        default: "22:00"
      },       
    },           
    thursday: {
      isOpen: {
        type: Boolean,
        default: true
      },      
      timeStartAt: {
        type: String,
        trim: true,
        required: true, 
        default: "07:00"
      },  
      timeEndAt: {
        type: String,
        trim: true,
        required: true, 
        default: "22:00"
      },       
    },     
    friday: {
      isOpen: {
        type: Boolean,
        default: true
      },      
      timeStartAt: {
        type: String,
        trim: true,
        required: true, 
        default: "07:00"
      },  
      timeEndAt: {
        type: String,
        trim: true,
        required: true, 
        default: "22:00"
      },       
    },           
    saturday: {
      isOpen: {
        type: Boolean,
        default: true
      },      
      timeStartAt: {
        type: String,
        trim: true,
        required: true, 
        default: "07:00"
      },  
      timeEndAt: {
        type: String,
        trim: true,
        required: true, 
        default: "22:00"
      },              
    },      
  },
  address: {
    lat: {
      type: Number,      
    },
    lng: {
      type: Number,      
    },
    number: {
      type: String,      
    },    
    street: {
      type: String,
    },
    district: {
      type: String,
    },    
    city: {
      type: String,
    },       
    state: {
      type: String,
    },       
    postalCode: {
      type: String,
    },     
    complement: {
      type: String,
    },
    description: {
      type: String,
    }       
  }
});
 
companySchema.set('timestamps', true);
module.exports = mongoose.model('companySite', companySchema);
