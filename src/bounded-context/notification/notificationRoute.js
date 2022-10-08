const authorization = require('../../middleware/auth-middleware');
const dateUtils = require('../../utils/dateUtils').dateUtils();
const notificationService = require('./notificationService').notificationService();
const router = require('express').Router();

router.get('', authorization(), async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      const listModel = await notificationService.get(req);

      let list = [];
      let notRead = 0;
      let read = 0;

      for(let i in listModel) {
          
          let notif = {
            isNotRead: listModel[i].isNotRead,
            onlyAdmin: listModel[i].onlyAdmin,
            _id: listModel[i]._id,
            title: listModel[i].title,
            description: listModel[i].description,
            type: listModel[i].type,
            view: listModel[i].view,
            mdi: listModel[i].mdi,
            emojiIcon: listModel[i].emojiIcon,
            path: listModel[i].path,
            hyperLink: listModel[i].hyperLink,
            company: listModel[i].company,
            createdAt: dateUtils.dateToStringPtBR(listModel[i].createdAt).substring(0,5),
          }
          list.push(notif);

          if(listModel[i].isNotRead) {
              notRead++;
          } else {
              read++;
          }
      }

      const notifications = {
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

router.patch('/:_id', async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      await notificationService.updateReadNotification(req.params._id, req.headers['company']);
      res.status(204); 
    } catch (error) {
      console.error(`/notifications patch`, error);
      res.status(500).send(error);
    }    
});

module.exports = router;
