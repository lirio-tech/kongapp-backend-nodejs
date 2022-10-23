const router = require('express').Router();
const authorization = require('../middleware/auth-middleware');
 
router.get('/juno/webhook', async (req, res, next) => {
  try {
      res.setHeader("Access-Control-Allow-Origin", "*");   
      res.status(200).json({});
    } catch (error) {
      console.error('api-error:: paymentsPix :: juno/webhook', error);
      res.status(500).send(error);
    }    
});

module.exports = router;