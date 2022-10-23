const router = require('express').Router();
const PaymentsHistoric = require('../models/PaymentsHistoric');
const authorization = require('../middleware/auth-middleware');
 
router.get('', authorization(), async (req, res, next) => {
  try {
      if(req.query.size) { 
          const payments = 
                  await PaymentsHistoric.find({ 'company._id': req.headers['company'] })
                                        .sort({ 'plan.dateStarted': -1 })                 
                                        .limit(Number(req.query.size));
          res.setHeader("Access-Control-Allow-Origin", "*");   
          res.status(200).json(payments);
          return;
      }
      const payments = await PaymentsHistoric.find({ 'company._id': req.headers['company'] });
      res.setHeader("Access-Control-Allow-Origin", "*");   
      res.status(200).json(payments);      
    } catch (error) {
      console.error('api-error:: paymentsHistoric :: get-by-company', error);
      res.status(500).send(error);
    }    
});

 
router.get('/all', authorization(), async (req, res, next) => {
  try {
      const payments = await PaymentsHistoric.find({ }).sort({ date: -1, createdAt: -1 });
      res.setHeader("Access-Control-Allow-Origin", "*");   
      res.status(200).json(payments);
    } catch (error) {
      console.error('api-error:: paymentsHistoric :: all', error);
      res.status(500).send(error);
    }    
});

module.exports = router;