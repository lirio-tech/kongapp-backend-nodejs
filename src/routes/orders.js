const router = require('express').Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Company = require('../models/Company');
const authorization = require('../middleware/auth-middleware');
const UserBalanceDetail = require('../models/UserBalanceDetail');
const UserBalance = require('../models/UserBalance');
const { default: axios } = require('axios');
const planService = require('../services/PlanService.js').planService();
const companyService = require('../services/CompanyService.js').companyService();
const orderService = require('../services/order/OrderService.js').orderService();
const btoa = require('btoa');
const { ObjectId } = require('mongodb');
//const basic_encoded = btoa(`${process.env.AUTH_USER}:${process.env.AUTH_PASS}`)

router.get('/v3/summary/:dateIni/:dateEnd', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");   
  try {
    // TODO Bug no Kotlin
    // let url = `${process.env.BACKEND_API}/api/orders/summary/${req.params.dateIni}/${req.params.dateEnd}`;
    // let result = await axios.get(
    //       url,
    //       { headers: { 
    //           'Content-Type': 'application/json',
    //           'companyId': req.headers['company'],
    //           'userId': req.userId,
    //           'Authorization': `Basic ${basic_encoded}`  
    //         }}
    //     ); 
    //     console.log('kotlin-backend-api', 'sucesso');
    await orderService.analyticsV3(req, res);
    //res.status(200).json(result.data);
  } catch(error) {
      console.error('orders :: v3/summary/:dateIni/:dateEnd', error);
      await orderService.analyticsV3(req, res);
  }
});

router.get('/v4/summary/:dateIni/:dateEnd', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");   
  try {
    // TODO Bug no Kotlin
    // let url = `${process.env.BACKEND_API}/api/orders/summary/${req.params.dateIni}/${req.params.dateEnd}`;
    // let result = await axios.get(
    //       url,
    //       { headers: { 
    //           'Content-Type': 'application/json',
    //           'companyId': req.headers['company'],
    //           'userId': req.userId,
    //           'Authorization': `Basic ${basic_encoded}`  
    //         }}
    //     ); 
    //     console.log('kotlin-backend-api', 'sucesso');
    await orderService.analyticsV4(req, res);
    //res.status(200).json(result.data);
  } catch(error) {
      console.error('orders :: v4/summary/:dateIni/:dateEnd', error);
      await orderService.analyticsV4(req, res);
  }
});

router.get('/v2/:dateIni/:dateEnd', authorization(), async (req, res, next) => {
  try {
    // TODO pegar usuario do req.userId 
    //console.log('queryStringParameters', req.query);
    const user = await User.findOne({ _id: ObjectId(req.userId) })

    let query = null;
    if(user.type && (user.type === 'administrator' || user.type === 'sys_admin')) {
      query = {
                date: {
                  $gte: req.params.dateIni,
                  $lte: req.params.dateEnd
                },
                company: req.headers['company']
        };
    } else {
      query = { 
        date: { 
          $gte: req.params.dateIni,
          $lte: req.params.dateEnd
        },
        'user._id': user._id,
        company: req.headers['company']
      };         
    }
 
    let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
    let numberPerPage = req.query.numberPerPage ? Number(req.query.numberPerPage) : 20;
  
    const orders = 
      await Order.find(query)
                 .sort({ date: -1, updatedAt: -1 })                 
                 .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * numberPerPage ) : 0 )
                 .limit(numberPerPage)

    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.status(200).json(orders); 
  } catch (error) { 
      console.error('orders :: v2/:dateIni/:dateEnd', error);
      res.status(500).send(error);
  }    
});

router.post('/v9', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  const result = await orderService.saveV9(req.body, req.userId, req.headers['company']);
  if(result.isValid === false) {
    res.status(result.status).json({message: result.message});    
    return;
  }
  res.status(200).json(result.order);    
});

router.get('/:_id', authorization(), async (req, res, next) => {
    try {
        const order = await Order.findOne({ '_id': req.params._id });
        res.setHeader("Access-Control-Allow-Origin", "*");  
        res.status(200).json(order); 
      } catch (error) {
        console.error('orders :: get _id', error);
        res.status(500).send(error);
      }    
});

router.delete('/:_id', authorization(), async (req, res, next) => {
  try {
      const order = await Order.findOne({_id: req.params._id });
      await Order.deleteOne({ '_id': req.params._id });
      
      let userBalance = await UserBalance.findOne({ 'user._id': order.user._id });
      const balanceDel = userBalance.balance - order.commission;
      await UserBalance.updateOne( { 'user._id': order.user._id }, { balance: balanceDel } );      
      await UserBalanceDetail.deleteOne( { orderId: order._id } ); 

      res.setHeader("Access-Control-Allow-Origin", "*"); 
      res.status(204).json({'message': 'Deletado'}); 
    } catch (error) {
      console.error('orders :: delete _id', error);
      res.status(500).send(error);
    }    
});

module.exports = router;