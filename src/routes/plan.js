const router = require('express').Router();
const Plan = require('../models/Plan');
const authorization = require('../middleware/auth-middleware');
 
router.post('/', authorization(), async (req, res) => {
    try {
      if(req.body._id) {
        // Update
        var plan = await Plan.updateOne({_id: req.body._id }, req.body);
        console.log('Plan updated success!!!');
        res.setHeader("Access-Control-Allow-Origin", "*"); 
        res.status(200).json(plan);        
      } else {
        // Novo
        delete req.body._id;
        const plan = await new Plan(req.body).save();
        console.log('Plan saved success!!!');
        res.setHeader("Access-Control-Allow-Origin", "*"); 
        res.status(201).json(plan);
      }
    } catch (error) {
      console.error('api-error:: plan :: post', error);
      res.status(500).send(error);
    }
  });

router.get('/:_id', authorization(), async (req, res, next) => {
    try {
        const plan = await Plan.findOne({ '_id': req.params._id });
        res.setHeader("Access-Control-Allow-Origin", "*");  
        res.status(200).json(plan); 
      } catch (error) {
        console.error('api-error:: paymentsPix :: get _id', error);
        res.status(500).send(error);
      }    
});

router.get('', authorization(), async (req, res, next) => {
  try {
      console.log(' ================================= ');
      const plans = await Plan.find({ });
      res.setHeader("Access-Control-Allow-Origin", "*");   
      res.status(200).json(plans); 
    } catch (error) {
      console.error('api-error:: plan :: get-all', error);
      res.status(500).send(error);
    }    
});

module.exports = router;