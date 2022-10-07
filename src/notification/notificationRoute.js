const notificationService = require('./notificationService').notificationService();
const router = require('express').Router();

router.get('/', authorization(), async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      const notifications = await notificationService.get(req);
      res.status(200).json(notifications); 
    } catch (error) {
      console.error(`/notifications get`, error);
      res.status(500).send(error);
    }    
});

module.exports = router;
