const authorization = require('../../middleware/auth-middleware')
const router = require('express').Router()
const moment = require('moment-timezone')
const { ObjectId } = require('mongodb')
const notificationFindAllPageUsecase = require('./usecases/NotificationFindAllPageUsecase').notificationFindAllPageUsecase()
const notificationFindByCompanyIdUsecase = require('./usecases/NotificationFindByCompanyIdUsecase').notificationFindByCompanyIdUsecase()
const notificationUpdateReadUsecase = require('./usecases/NotificationUpdateReadUsecase').notificationUpdateReadUsecase()
const notificationVerifyAndSaveSignatureExpiration = require('./usecases/NotificationVerifyAndSaveSignatureExpirationUsecase').notificationVerifyAndSaveSignatureExpiration()

router.get('', authorization(), async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      const listModel = 
        await notificationFindByCompanyIdUsecase
          .findByCompanyId(
              ObjectId(req.headers['company'])
          );

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
            mdiColor: listModel[i].mdiColor,
            emojiIcon: listModel[i].emojiIcon,
            path: listModel[i].path,
            hyperLink: listModel[i].hyperLink,
            company: listModel[i].company,
            createdAt:  moment(listModel[i].createdAt).tz('America/Sao_Paulo').format('DD/MM HH:mm')
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

router.patch('/:_id', authorization(), async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      await notificationUpdateReadUsecase.update(req.params._id, req.headers['company']);
      res.status(204); 
    } catch (error) {
      console.error(`/notifications patch`, error);
      res.status(500).send(error);
    }    
});

router.post('/signature-expiration', authorization(), async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {

    // TODO only sys_admin
    
    await notificationVerifyAndSaveSignatureExpiration.verifyAndSaveSignatureExpiration();
    console.log("Process in execution...");
    res.status(200).json({"message": "Process in execution..."}); 

  } catch (error) {
      console.error(`/notifications patch`, error);
      res.status(500).send(error);
  }    
});

router.get('/signature-expiration', authorization(), async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {

    let cs = await notificationVerifyAndSaveSignatureExpiration.get();
    res.status(200).json(cs); 

  } catch (error) {
      console.error(`/notifications patch`, error);
      res.status(500).send(error);
  }    
});

router.get('/list/all', async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      // ---> /list/all?page=0&size=1&sort=createdAt,asc
      console.log(`GET /notifications/list/all?page=${req.query.page}&size=${req.query.size}&sort=${req.query.sort}`)

      let list = 
          await notificationFindAllPageUsecase
                  .findAll(
                      Number(req.query.page), 
                          Number(req.query.size), req.query.sort);
      res.status(200).json(list); 

    } catch (error) {
      console.error(`/notifications get`, error);
      res.status(500).send(error);
    }    
});

router.delete('/:_id', async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      console.log(`DELETE /notifications/${req.params._id}`)
      await notificationDeleteUsecase.delete(
        ObjectId(req.params._id)
      );
      res.status(204)

    } catch (error) {
      console.error(`/notifications get`, error);
      res.status(500).send(error);
    }    
});

module.exports = router;
