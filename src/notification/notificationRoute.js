const authorization = require('../middleware/auth-middleware');
const notificationService = require('./notificationService').notificationService();
const router = require('express').Router();

router.get('', authorization(), async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      const list = await notificationService.get(req);

      let notRead = 0;
      let read = 0;
      for(let i in list) {
          if(list[i].isNotRead) {
            notRead++;
          } else {
            read++;
          }
      }

      let notifications = {
          list: list,
          amountNotRead: notRead,
          amountRead: read
      }            


      res.status(200).json(notifications); 
    } catch (error) {
      console.error(`/notifications get`, error);
      res.status(500).send(error);
    }    
});

router.get('/a', async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      const notifications = await notificationService.getA();
      res.status(200).json(notifications); 
    } catch (error) {
      console.error(`/notifications get`, error);
      res.status(500).send(error);
    }    
});

module.exports = router;
