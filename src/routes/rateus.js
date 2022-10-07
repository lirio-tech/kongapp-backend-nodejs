const RateUs = require('../models/RateUs');
const User = require('../models/User');
const router = require('express').Router();
const authorization = require('../middleware/auth-middleware');

router.post('', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
    try { 
      const rateUs = await new RateUs(req.body).save();
      if(req.body.userId) {
        await User.updateOne( { _id: req.body.userId }, { ratedUs: true }); 
      }       
      res.status(200).json(rateUs); 
    } catch (error) {
      console.error('rateus :: post', error);
      res.status(500).send(error);
    }
});

router.get('/', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
    try { 
      const rates = await RateUs.find({});
      res.status(200).json(rates); 
    } catch (error) {
      console.error('rateus :: get', error);
      res.status(500).send(error);
    }
});


module.exports = router;
