const axios = require('axios');
const { ObjectId } = require('mongodb');
const authorization = require('../middleware/auth-middleware');
const Company = require('../models/Company');
const Order = require('../models/Order');
const User = require('../models/User');
const btoa = require('btoa');

const RxHR = require('@akanass/rx-http-request').RxHR;
const map = require('rxjs/operators').map;

const dateUtils = require('../utils/dateUtils').dateUtils();

const basic_encoded = btoa(`${process.env.AUTH_USER}:${process.env.AUTH_PASS}`)
const router = require('express').Router();

let getDateArray = (dates) => {
  let dateInit = dateUtils.getNewDateAddDay(0);
  let dateEnd = dateUtils.getNewDateAddDay(0);
  if(dates.length === 1) { 
    dateInit = dates[0];
    dateEnd = dates[0];
  }
  if(dates.length > 1) {
    dateInit = dates[0];
    dateEnd = dates[1];
  }  
  return [dateInit, dateEnd];
}

router.post('/days-of-the-week', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");   
  console.log(req.body); 
  try {     
    const user = await User.findOne({_id: req.userId});
    const company = await Company.findOne({_id: req.headers['company']});
    const [dateInit, dateEnd] = getDateArray(req.body);
 
    let orderByDate = []; 
    
    if(user.type === 'administrator' || user.type === 'sys_admin') {
      orderByDate = await Order.aggregate([
        { 
          $match: 
            {
              date: {
                $gte: dateInit,
                $lte: dateEnd
              },
              company: ObjectId(company._id)
            }
        },
        { 
          $group: {
            _id: "$date",
            totalValue: { $sum: "$total" }
          } 
        }
      ]);
    } else {
      orderByDate = await Order.aggregate([
        { 
          $match: 
            {
              date: {
                $gte: dateInit,
                $lte: dateEnd
              },
              company: ObjectId(company._id),
              'user._id': user._id
            } 
        },
        { 
          $group: {
            _id: "$date",
            totalValue: { $sum: "$commission" }
          } 
        }
      ]); 
    }

    let result = {
      monday: {total: 0, amount: 0, average: 0}, 
      tuesday: {total: 0, amount: 0, average: 0}, 
      wednesday: {total: 0, amount: 0, average: 0}, 
      thursday: {total: 0, amount: 0, average: 0}, 
      friday: {total: 0, amount: 0, average: 0}, 
      saturday: {total: 0, amount: 0, average: 0}, 
      sunday: {total: 0, amount: 0, average: 0}, 
    }; 

    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    const promises = orderByDate.map(async(order, i) => {
      const[yyyy,mm,dd] = order._id.split('-');
      let dateWeek = new Date(); 
      dateWeek.setFullYear(yyyy);
      dateWeek.setMonth(mm-1);
      dateWeek.setDate(dd); 
 
      switch(weekday[dateWeek.getDay()]) {
        case "Sunday":  
          result.sunday.total+=order.totalValue;
          result.sunday.amount++;
          result.sunday.average = result.sunday.total/result.sunday.amount;
          break; 
        case "Monday": 
          result.monday.total+=order.totalValue;
          result.monday.amount++;
          result.monday.average = result.monday.total/result.monday.amount;
          break;
        case "Tuesday": 
          result.tuesday.total+=order.totalValue;
          result.tuesday.amount++;
          result.tuesday.average = result.tuesday.total/result.tuesday.amount;
          break;          
        case "Wednesday": 
          result.wednesday.total+=order.totalValue;
          result.wednesday.amount++;
          result.wednesday.average = result.wednesday.total/result.wednesday.amount;
          break;    
        case "Thursday": 
          result.thursday.total+=order.totalValue;
          result.thursday.amount++;
          result.thursday.average = result.thursday.total/result.thursday.amount;
          break;   
        case "Friday": 
          result.friday.total+=order.totalValue;
          result.friday.amount++;
          result.friday.average = result.friday.total/result.friday.amount;
          break;    
        case "Saturday":
          result.saturday.total+=order.totalValue;
          result.saturday.amount++;
          result.saturday.average = result.saturday.total/result.saturday.amount;
          break;                                           
      }      
    });

    await Promise.all(promises);

    let daysOfTheWeekDescriptionArray = ['Dias da semana', 'Seg' ,'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
    let daysOfTheWeekValueArray = [
      'R$', 
      result.monday.average,
      result.tuesday.average, 
      result.wednesday.average,
      result.thursday.average, 
      result.friday.average, 
      result.saturday.average, 
      result.sunday.average
    ];

    let resultChart = [ daysOfTheWeekDescriptionArray, daysOfTheWeekValueArray ]
    
    console.log({ chartData: resultChart, data: result }); 
    res.status(200).json({ chartData: resultChart, data: result });
     
  } catch (error) {
      console.error('analytics :: days-of-the-week', error);
      res.status(500).send(error);
  }
});

router.post('/users', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");   
  console.log(req.body); 
  try {     
    const user = await User.findOne({_id: req.userId});
    const company = await Company.findOne({_id: req.headers['company']});
    const [dateInit, dateEnd] = getDateArray(req.body);
 
    const orderByUsers = await Order.aggregate([
      { 
        $match: 
          {
            date: {
              $gte: dateInit,
              $lte: dateEnd
            },
            company: ObjectId(company._id)
          }
      },
      { 
        $group: {
          _id: "$user.name",
          totalValue: { $sum: "$total" }
        } 
      }
    ]); 

    let _data = [];
    _data.push(["Profissional", "Valor"]);
    const promises = orderByUsers.map(async(order, index) => {
      _data.push([order._id, order.totalValue]);
    });
    await Promise.all(promises); 

    res.status(200).json({ data: orderByUsers, chartData: _data });
     
  } catch (error) {
      console.error('analytics :: users', error);
      res.status(500).send(error);
  } 
});

router.post('/companies-actives', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");   
  console.log(req.body); 
  const [dateInit, dateEnd] = getDateArray(req.body);
  try {     
    const orders = await Order.aggregate([
      {
        '$match': {
          'date': { 
            '$gte': dateInit, 
            '$lte': dateEnd
          }, 
          'company': { $ne: ObjectId('605a74946d4dc50008cb12f1') } // TODO pegar pelo field
        }
      }, {
        '$lookup': { 
          'from': 'companies', 
          'localField': 'company', 
          'foreignField': '_id', 
          'as': 'company_2'
        }
      }, {
        '$group': {
          '_id': '$company_2',
          'total': {
            '$sum': '$total'
          },
          'lastAt': {
            '$last': '$createdAt'
          }           
        } 
      }
    ]); 

    let result = [];
    const promises = orders.map(async(order, index) => {
      let ord = {};
      ord.total = order.total;
      ord.lastAt = order.lastAt;
      ord._id = order._id[0]._id;
      ord.shortName = order._id[0].shortName; 
      ord.planName = order._id[0].plan.name;
      ord.planDateEnd = order._id[0].plan.dateEnd;
      result.push(ord);
    }); 
    Promise.all(promises); 
    res.status(200).json(result); 
     
  } catch (error) {
      console.error('analytics :: companies-actives', error);
      res.status(500).send(error);
  } 
});

// TODO TRAZER para o NODE
router.get('/payments-type/:dateStart/:dateEnd', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");   
  try {     

    if(!req.params.dateEnd || req.params.dateEnd === 'undefined') req.params.dateEnd = req.params.dateStart;

    let url = `${process.env.BACKEND_API}/api/analytics/payments/${req.params.dateStart}/${req.params.dateEnd}`;
    
    // let result = await axios.get(url, { headers: { 'Content-Type': 'application/json', 'company': req.headers['company'], 'Authorization': `Basic ${basic_encoded}` }});
    // console.log('result data: ', result.data)
    // res.status(200).json(result.data);

    const resp = RxHR.get(url, { headers: { 'company': req.headers['company'] } }).pipe(map(response => response.body));
    
    resp.subscribe(it => {
      console.log('it', it);
      let jsonResult = []
      if (typeof it == 'string') {
        let jsonStr = `${it.replace("}{", "},{")}`;
        if(jsonStr.includes('}{')) {
          jsonStr = `${jsonStr.replace("}{", "},{")}`;
        }
        jsonStr = `[${jsonStr}]`;

        let respData = JSON.parse(jsonStr); 
        
        for(let i in respData) {
          jsonResult.push({ 'paymentType': respData[i].id, 'total': respData[i].totalByPayment })
        }
      } else {
        jsonResult.push(it);
      }
      return res.status(200).json(jsonResult);
    });
    
  } catch (error) {
      console.error('analytics :: payments-type/:dateStart/:dateEnd', error);
      res.status(500).send(error);
  } 
});

// TODO TRAZER para o NODE
router.get('/months-sum/:startDate/:endDate', authorization(), async(req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");   
  try {     
    let url = `${process.env.BACKEND_API}/api/analytics/months-sum/${req.params.startDate}/${req.params.endDate}`;
    let result = await axios.get(url, { headers: { 'Content-Type': 'application/json', 'company': req.headers['company'], 'userId': req.userId, 'Authorization': `Basic ${basic_encoded}`  }});
    console.log('result data: ', result.data)
    res.status(200).json(result.data);
  } catch (error) {
      console.error('analytics :: months-sum/:startDate/:endDate', error);
      res.status(500).send(error);
  } 
})

module.exports = router;
