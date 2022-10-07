const router = require('express').Router();
const { ObjectId } = require('mongodb');
const Company = require('../models/Company');
const User = require('../models/User');

router.get('/update-usuarios/:_id', async (req, res) => {

    // let company = await Company.findOne({_id: ObjectId(req.params._id)});
    // let users = await User.find({_id: ObjectId(req.params._id)});
    // for(let u in users) {
    //     for(let s in users[u].services) {
    //         users[u].services[s].percentCommission = users[u].percentCommission;
    //     }
    //     await User.updateOne({ _id: ObjectId(users[u]._id) }, { services: users[u].services });
    // }
    
    res.json({'message': 'OK'}); 
});

module.exports = router;

/**
 
    $where: "this.name.length > 1"

    services: { $size: 0 }

 */