const Schedule = require('../models/Schedule');
const User = require('../models/User');
const Company = require('../models/Company');
const router = require('express').Router();
const authorization = require('../middleware/auth-middleware');
const { ObjectId } = require('mongodb');
const orderService = require('../services/order/OrderService.js').orderService();
const companyService = require('../services/CompanyService.js').companyService();
const dateUtils = require('../utils/dateUtils').dateUtils();
const userService = require('../services/UserService').userService();
const CompanySite = require('../models/CompanySite');
const notificationSaveNewScheduleUsecase = require('../bounded-context/notification/usecases/NotificationSaveNewScheduleUsecase').notificationsaveNewScheduleUsecase();
const messageLabels = require('../services/validation/Message').messageLabels();

const SUNDAY = 0;
const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;

router.post('', authorization(), async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    try { 

      const company = await Company.findOne({_id: req.headers['company']});
      if(company.plan.name !== 'Free') {
        if(companyService.isNotExpiredPlan(company, 2) === false) {
            const msg = 'Seu Plano está vencido, renove seu plano agora mesmo ou entre em contato conosco!';
            console.log('Plan Expired', msg); 
            return res.status(412)
                      .json(orderService.getResultFalse(412, msg, company.plan.name));   
        } 
      }

      const user = await User.findOne({ _id: req.userId });
      
      let userSchedule = null;
      if(userService.isAdmin(user.type)) {
        userSchedule = await User.findOne({ _id: req.body.user._id });
      } else {
          userSchedule = user;
      }
      // TODO Date Past
      // TODO Conflit of Schedule
      // POST and PUT with code repeated

      let _dateTimeStartAt = new Date(
        Number(req.body.dateAt.substring(0,4)), 
        Number(req.body.dateAt.substring(5,7))-1, 
        Number(req.body.dateAt.substring(8,10)),
        Number(req.body.timeStartAt.substring(0,2)),
        Number(req.body.timeStartAt.substring(3,5)),
        0
      );

      console.log('_dateTimeStartAt', _dateTimeStartAt);

      let _dateTimeEndAt = new Date(
        Number(req.body.dateAt.substring(0,4)), 
        Number(req.body.dateAt.substring(5,7))-1, 
        Number(req.body.dateAt.substring(8,10)),
        Number(req.body.timeEndAt.substring(0,2)),
        Number(req.body.timeEndAt.substring(3,5)),
        0
      );
 
      console.log('_dateTimeEndAt', _dateTimeEndAt);

      const scheduleNew = { 
        customer: {
          name: req.body.customer.name,
          phone_number: req.body.customer.phone_number,
        },
        user: userSchedule,
        companyId: req.headers['company'],  
        dateTimeStartAt: _dateTimeStartAt,
        dateTimeEndAt: _dateTimeEndAt,
        services: req.body.services,
        total: req.body.total,
        status: 'PENDING',
        statusInitial: 'PENDING',
        createdBy: user.name
      } 
      const schedule = await new Schedule(scheduleNew).save();  
      res.status(200).json(schedule); 
    } catch (error) {
      console.error('schedules :: post', error);
      res.status(500).send(error);
    }
});

router.put('/:_id', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
    try { 

      const company = await Company.findOne({_id: req.headers['company']});
      if(company.plan.name !== 'Free') {
        if(companyService.isNotExpiredPlan(company, 2) === false) {
            const msg = 'Seu Plano está vencido, renove seu plano agora mesmo ou entre em contato conosco!';
            console.log('Plan Expired', msg); 
            return res.status(412)
                      .json(orderService.getResultFalse(412, msg, company.plan.name));   
        } 
      }      

      const user = await User.findOne({ _id: req.userId });

      let userSchedule = null;
      if(userService.isAdmin(user.type)) {
          userSchedule = await User.findOne({ _id: req.body.user._id });
      } else {
          userSchedule = user;
      }
      console.log('userSchedule', userSchedule);

      const schedule = await Schedule.findOne({ _id: req.params._id  });
      if(schedule.status !== 'PENDING') {
        res.status(412).json({message: 'Agendamento nao pode ser alterado.'});           
        return;
      }
      

      let _dateTimeStartAt = new Date(
        Number(req.body.dateAt.substring(0,4)), 
        Number(req.body.dateAt.substring(5,7))-1, 
        Number(req.body.dateAt.substring(8,10)),
        Number(req.body.timeStartAt.substring(0,2)),
        Number(req.body.timeStartAt.substring(3,5)),
        0
      );

      console.log('_dateTimeStartAt', _dateTimeStartAt);

      let _dateTimeEndAt = new Date(
        Number(req.body.dateAt.substring(0,4)), 
        Number(req.body.dateAt.substring(5,7))-1, 
        Number(req.body.dateAt.substring(8,10)),
        Number(req.body.timeEndAt.substring(0,2)),
        Number(req.body.timeEndAt.substring(3,5)),
        0
      );
 
      console.log('_dateTimeEndAt', _dateTimeEndAt);

      const scheduleUpdate = { 
        customer: {
          name: req.body.customer.name,
          phone_number: req.body.customer.phone_number,
        },
        user: userSchedule,
        companyId: req.headers['company'],  
        dateTimeStartAt: _dateTimeStartAt,
        dateTimeEndAt: _dateTimeEndAt,
        services: req.body.services,
        total: req.body.total 
      } 
      await Schedule.updateOne({_id: schedule._id}, scheduleUpdate);
      res.status(200).json(req.body); 
    } catch (error) {
      console.error('schedules :: put _id', error);
      res.status(500).send(error);
    }
});

router.put('/:_id/confirm', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
    try { 

      const company = await Company.findOne({_id: req.headers['company']});
      if(company.plan.name !== 'Free') {
        if(companyService.isNotExpiredPlan(company, 2) === false) {
            const msg = 'Seu Plano está vencido, renove seu plano agora mesmo ou entre em contato conosco!';
            console.log('Plan Expired', msg); 
            return res.status(412)
                      .json(orderService.getResultFalse(412, msg, company.plan.name));   
        } 
      }      

      const user = await User.findOne({ _id: req.userId });

      let userSchedule = null;
      if(userService.isAdmin(user.type)) {
          userSchedule = await User.findOne({ _id: req.body.user._id });
      } else {
          userSchedule = user;
      }
      console.log('userSchedule', userSchedule);

      const schedule = await Schedule.findOne({ _id: req.params._id  });
      if(schedule.status !== 'REQUESTED') {
        res.status(422).json({message: 'Agendamento nao pode ser confirmado porque não está como Solicitado pelo Cliente.'});           
        return;
      }
      
      let _dateTimeStartAt = null;

      try {
          _dateTimeStartAt = new Date(
            Number(req.body.dateAt.substring(0,4)), 
            Number(req.body.dateAt.substring(5,7))-1, 
            Number(req.body.dateAt.substring(8,10)),
            Number(req.body.timeStartAt.substring(0,2)),
            Number(req.body.timeStartAt.substring(3,5)),
            0
          );
      } catch(ex) {
        _dateTimeStartAt = new Date(
          Number(req.body.dateAt.substring(0,4)), 
          Number(req.body.dateAt.substring(5,7))-1, 
          Number(req.body.dateAt.substring(8,10)),
          Number(req.body.timeStartAt.substring(0,2)),
          Number(req.body.timeStartAt.substring(0,2))+1,
          0
        );
      }

      console.log('_dateTimeStartAt', _dateTimeStartAt);

      let _dateTimeEndAt = new Date(
        Number(req.body.dateAt.substring(0,4)), 
        Number(req.body.dateAt.substring(5,7))-1, 
        Number(req.body.dateAt.substring(8,10)),
        Number(req.body.timeEndAt.substring(0,2)),
        Number(req.body.timeEndAt.substring(3,5)),
        0
      );
 
      console.log('_dateTimeEndAt', _dateTimeEndAt);

      const requested = { 
        customer: {
          name: req.body.customer.name,
          phone_number: req.body.customer.phone_number,
        },
        user: userSchedule,
        companyId: req.headers['company'],  
        dateTimeStartAt: _dateTimeStartAt,
        dateTimeEndAt: _dateTimeEndAt,
        services: req.body.services,
        total: req.body.total,
        status: 'PENDING' 
      } 
      await Schedule.updateOne({_id: schedule._id}, requested);
      res.status(200).json(req.body); 
    } catch (error) {
      console.error('schedules :: put _id', error);
      res.status(500).send(error);
    }
});

router.get('/:dateStart/:dateEnd', authorization(), async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    console.log('headersCcompany', req.headers['company']);
    try { 
      const user = await User.findOne({ _id: req.userId });

      let start = new Date(req.params.dateStart.substring(0, 4), Number(req.params.dateStart.substring(5, 7))-2, 1); 
      let end = new Date(req.params.dateStart.substring(0, 4), Number(req.params.dateStart.substring(5, 7))+1, 1); 
 
      if(userService.isAdmin(user.type)) {
        const schedules = await Schedule.find(
          { 
            companyId: req.headers['company'], 
            status: { $in: [ 'PENDING', 'DONE', 'REQUESTED' ] },
            dateTimeStartAt: { '$gte': start, '$lte': end }             
          } 
        );
        console.log(schedules);
        res.status(200).json(schedules); 
      } else {
        const schedules = await Schedule.find(
          { 
            companyId: req.headers['company'], 
            'user._id': user._id, 
            status: { $in: [ 'PENDING', 'DONE', 'REQUESTED' ] },
            dateTimeStartAt: { '$gte': start, '$lte': end }           
          }
        );
        console.log(schedules);
        res.status(200).json(schedules);        
      }
    } catch (error) {
      console.error('schedules :: get :dateStart/:dateEnd', error);
      res.status(500).send(error);
    }
});

router.delete('/:_id', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  try { 

    const company = await Company.findOne({_id: req.headers['company']});
    if(company.plan.name !== 'Free') {
      if(companyService.isNotExpiredPlan(company, 2) === false) {
          const msg = 'Seu Plano está vencido, renove seu plano agora mesmo ou entre em contato conosco!';
          console.log('Plan Expired', msg); 
          return res.status(412)
                    .json(orderService.getResultFalse(412, msg, company.plan.name));   
      } 
    }    
 
    //const user = await User.findOne({ _id: req.userId });
    const schedule = await Schedule.findOne({ _id: req.params._id});
    if(schedule.status === 'PENDING' || schedule.status === 'REQUESTED') {
      await Schedule.updateOne({_id: schedule._id}, {status: 'CANCELED'});
      res.status(200).json({'message': 'Cancelado'}); 
    } else {
      res.status(412).json({message: 'Agendamento não pode ser cancelado porque ja foi concluido.'});           
      return;      
    }
  } catch (error) {
    console.error('schedules :: delete _id', error);
    res.status(500).send(error);
  }
});

router.post('/v2/:_id/:paymentType', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  try { 

    const company = await Company.findOne({_id: req.headers['company']});
    if(company.plan.name !== 'Free') {
      if(companyService.isNotExpiredPlan(company, 2) === false) {
          const msg = 'Seu Plano está vencido, renove seu plano agora mesmo ou entre em contato conosco!';
          console.log('Plan Expired', msg); 
          return res.status(412)
                    .json(orderService.getResultFalse(412, msg, company.plan.name));   
      } 
    }

      //const user = await User.findOne({ _id: req.userId });
      const scheduleRequest = req.body; 
      const schedule = await Schedule.findOne({ _id: ObjectId(req.params._id) }); 

      if(schedule.status !== 'PENDING') { 
        res.status(412).json({message: 'Agendamento não pode ser concluido.'});           
        return;      
      }

      let _total = 0;
      for(var i in scheduleRequest.services) {
        _total += scheduleRequest.services[i].price;
      }

      let order = {
        services: scheduleRequest.services,
        total: _total,
        commission: 0, // Calculado no backend
        totalCompany: 0, // Calculado no backend
        paymentType: req.params.paymentType,
        user: schedule.user,
        customer: schedule.customer,
        date: dateUtils.dateToStringEnUS(schedule.dateTimeStartAt).substring(0,10),
        company: schedule.companyId,
        cardRate: req.query.cardRate ? req.query.cardRate : 0
      };
      const orderSaved = await orderService.saveV8(order, req.userId, req.headers['company']);
      console.log('orderSaved', orderSaved)
      if(orderSaved.isValid) { 
          await Schedule.updateOne(
            { _id: schedule._id }, 
            { 
              status: 'DONE', 
              services: orderSaved.order.services, 
              total: orderSaved.order.total,
              orderId: orderSaved.order._id
            }
          );
          res.status(200).json(orderSaved.order);    
      } else {
          res.status(orderSaved.status).json({message: orderSaved.message});   
      }
  } catch (error) {
      console.error('schedules :: post _id/:paymentType', error);
      res.status(500).send(error);
  }
});

router.get('/v2-prior-next', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  try { 
    const user = await User.findOne({ _id: req.userId });
    let list = [];
    const _now = new Date();
    _now.setHours(_now.getHours()-3);

    let queryPending = null;
    let queryNext = null;

    let queryRequested = { 
      companyId: req.headers['company'], 
      status: 'REQUESTED'           
    };
    let requested = await Schedule.find(queryRequested).sort({'dateTimeStartAt': 1});  
    console.log(requested)
    if(requested.length > 0) {
      
      let reqFind = {
        title: 'Solicitado pelo Cliente',
        postItColor: 'green',
        customer: requested[0].customer,
        user: requested[0].user,
        services: requested[0].services,
        total: requested[0].total,
        companyId: requested[0].companyId,
        dateTimeStartAt: requested[0].dateTimeStartAt,
        dateTimeEndAt: requested[0].dateTimeEndAt,
        status: requested[0].status,
        _id: requested[0]._id,
        createdAt: requested[0].createdAt,
        createdBy: requested[0].createdBy
      }
      console.log(reqFind)
      list.push(reqFind);    
    }

    if(userService.isAdmin(user.type)) {

      queryPending = { 
        companyId: req.headers['company'], 
        status: { $in: [ 'PENDING' ] },
        dateTimeStartAt: { '$lte': _now }             
      };

      queryNext = { 
        companyId: req.headers['company'], 
        status: { $in: [ 'PENDING' ] },
        dateTimeStartAt: { '$gte': _now }             
      } 

    } else {
      queryPending = { 
        companyId: req.headers['company'], 
        status: { $in: [ 'PENDING' ] },
        'user._id': user._id, 
        dateTimeStartAt: { '$lte': _now }             
      } 
      
      queryNext = { 
        companyId: req.headers['company'], 
        'user._id': user._id, 
        status: { $in: [ 'PENDING' ] },
        dateTimeStartAt: { '$gte': _now }             
      } 
    } 

    let pendings = await Schedule.find(queryPending).sort({'dateTimeStartAt': 1});    
    if(pendings.length > 0) {
      let prior = {
        title: 'Conclua esse agendamento :)',
        postItColor: 'red lighten-3',
        customer: pendings[0].customer,
        user: pendings[0].user,
        services: pendings[0].services,
        total: pendings[0].total,
        companyId: pendings[0].companyId,
        dateTimeStartAt: pendings[0].dateTimeStartAt,
        dateTimeEndAt: pendings[0].dateTimeEndAt,
        status: pendings[0].status,
        _id: pendings[0]._id,
        createdAt: pendings[0].createdAt,
        createdBy: pendings[0].createdBy
      }
      list.push(prior);
    }

    let next = await Schedule.find(queryNext).sort({'dateTimeStartAt': 1});  
    if(next.length > 0) {
      let nxt = {
        title: 'Próximo Agendamento',
        postItColor: 'info lighten-1',
        customer: next[0].customer,
        user: next[0].user,
        services: next[0].services,
        total: next[0].total,
        companyId: next[0].companyId,
        dateTimeStartAt: next[0].dateTimeStartAt,
        dateTimeEndAt: next[0].dateTimeEndAt,
        status: next[0].status,
        _id: next[0]._id,
        createdAt: next[0].createdAt,
        createdBy: next[0].createdBy
      }
      list.push(nxt);    
    } 
    
    console.log('list',list.length)
    res.status(200).json(list); 
  } catch (error) {
    console.error('schedules :: get prior-next', error);
    res.status(500).send(error);
  }
});

router.post('/site', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
    try { 

      console.log('INVALID_DATE_DEBUG', req.body);

      const schedulesVerify = await Schedule.find({ 
        status: { $in: ['REQUESTED', 'PENDING'] }, 
        'customer.phone_number': req.body.customer.phone_number,
        companyId: ObjectId(req.body.companyId),
      })
      if(schedulesVerify && schedulesVerify.length > 0) {
        return res.status(422).json({ 
          code: messageLabels.Schedule.YOU_ALREADY_SCHEDULE_REQUESTED_CODE, 
          message: messageLabels.Schedule.YOU_ALREADY_SCHEDULE_REQUESTED_MESSAGE
        }); 
      }

      // TODO Bloqear qtde por device, 3x depois do Numero de tel...

      let _dateTimeStartAt = new Date(
        Number(req.body.dateAt.substring(0,4)),
        Number(req.body.dateAt.substring(5,7))-1, 
        Number(req.body.dateAt.substring(8,10)),
        Number(req.body.timeStartAt.substring(0,2)),
        Number(req.body.timeStartAt.substring(3,5)),
        0
      );

      let _dateTimeEndAt = new Date(
        Number(req.body.dateAt.substring(0,4)), 
        Number(req.body.dateAt.substring(5,7))-1, 
        Number(req.body.dateAt.substring(8,10)),
        Number(req.body.timeEndAt.substring(0,2)),
        Number(req.body.timeEndAt.substring(3,5)),
        0
      );
      
      console.log('_dateTimeStartAt', _dateTimeStartAt, '_dateTimeEndAt', _dateTimeEndAt, );

      // if(_dateTimeEndAt instanceof Date && !isNaN(_dateTimeEndAt)) {
      //   _dateTimeEndAt = new Date();
      //   _dateTimeEndAt.setHours(_dateTimeEndAt.getHours()+1);
      // }

      // TODO agendar somente horario que a barbearia esteja aberto
      const companySite = await CompanySite.findOne({ companyId: ObjectId(req.body.companyId) });
      console.log('DAY-OF-WEEK', _dateTimeStartAt.getDay());
      console.log('COMPANY_SITE_DAYS', companySite.openAt);
      if(_dateTimeStartAt.getDay() == SUNDAY) {
          if(!companySite.openAt.sunday.isOpen) {
            return res.status(422).json({ code: messageLabels.Schedule.DAY_IS_CLOSED, message: messageLabels.Schedule.SUNDAY_CLOSED });
          }
          if(_dateTimeStartAt.getHours() < Number(companySite.openAt.sunday.timeStartAt.substring(0,2)) || 
             (_dateTimeStartAt.getHours() == Number(companySite.openAt.sunday.timeStartAt.substring(0,2)) && _dateTimeStartAt.getMinutes() < Number(companySite.openAt.sunday.timeStartAt.substring(3,5)) )
          ) {
            return res.status(422).json({ code: messageLabels.Schedule.HOUR_NOT_ALLOW_START, message: messageLabels.Schedule.hourNotAllowStart('Domingo', companySite.openAt.sunday.timeStartAt, companySite.openAt.sunday.timeEndAt) });
          }
          if(_dateTimeEndAt.getHours() > Number(companySite.openAt.sunday.timeEndAt.substring(0,2)) ||
            (_dateTimeEndAt.getHours() == Number(companySite.openAt.sunday.timeEndAt.substring(0,2)) && _dateTimeEndAt.getMinutes() > Number(companySite.openAt.sunday.timeEndAt.substring(3,5)) )
          ) {
            return res.status(422).json({ code: messageLabels.Schedule.HOUR_NOT_ALLOW_END, message: messageLabels.Schedule.hourNotAllowEnd('Domingo', companySite.openAt.sunday.timeStartAt, companySite.openAt.sunday.timeEndAt) });
          }
      }
      if(_dateTimeStartAt.getDay() == MONDAY) {
        if(!companySite.openAt.monday.isOpen) {
          return res.status(422).json({ code: messageLabels.Schedule.DAY_IS_CLOSED, message: messageLabels.Schedule.MONDAY_CLOSED });
        }
        if(_dateTimeStartAt.getHours() < Number(companySite.openAt.monday.timeStartAt.substring(0,2)) || 
          (_dateTimeStartAt.getHours() == Number(companySite.openAt.monday.timeStartAt.substring(0,2)) && _dateTimeStartAt.getMinutes() < Number(companySite.openAt.monday.timeStartAt.substring(3,5)) )
        ) {
          return res.status(422).json({ code: messageLabels.Schedule.HOUR_NOT_ALLOW_START, message: messageLabels.Schedule.hourNotAllowStart('Segunda-Feira', companySite.openAt.monday.timeStartAt, companySite.openAt.monday.timeEndAt) });
        }
        if(_dateTimeEndAt.getHours() > Number(companySite.openAt.monday.timeEndAt.substring(0,2)) ||
          (_dateTimeEndAt.getHours() == Number(companySite.openAt.monday.timeEndAt.substring(0,2)) && _dateTimeEndAt.getMinutes() < Number(companySite.openAt.monday.timeEndAt.substring(3,5)) )
        ) {
          return res.status(422).json({ code: messageLabels.Schedule.HOUR_NOT_ALLOW_END, message: messageLabels.Schedule.hourNotAllowEnd('Segunda-Feira', companySite.openAt.monday.timeStartAt, companySite.openAt.monday.timeEndAt) });
        }          
      } 
      if(_dateTimeStartAt.getDay() == TUESDAY) {
        if(!companySite.openAt.tuesday.isOpen) {
          return res.status(422).json({ code: messageLabels.Schedule.DAY_IS_CLOSED, message: messageLabels.Schedule.TUESDAY_CLOSED });
        }
        if(_dateTimeStartAt.getHours() < Number(companySite.openAt.tuesday.timeStartAt.substring(0,2)) || 
          (_dateTimeStartAt.getHours() == Number(companySite.openAt.tuesday.timeStartAt.substring(0,2)) && _dateTimeStartAt.getMinutes() < Number(companySite.openAt.tuesday.timeStartAt.substring(3,5)) )
        ) {
          return res.status(422).json({ code: messageLabels.Schedule.HOUR_NOT_ALLOW_START, message: messageLabels.Schedule.hourNotAllowStart('Terça-Feira', companySite.openAt.tuesday.timeStartAt, companySite.openAt.tuesday.timeEndAt) });
        }
        if(_dateTimeEndAt.getHours() > Number(companySite.openAt.tuesday.timeEndAt.substring(0,2)) ||
          (_dateTimeEndAt.getHours() == Number(companySite.openAt.tuesday.timeEndAt.substring(0,2)) && _dateTimeEndAt.getMinutes() < Number(companySite.openAt.tuesday.timeEndAt.substring(3,5)) )
        ) {
          return res.status(422).json({ code: messageLabels.Schedule.HOUR_NOT_ALLOW_END, message: messageLabels.Schedule.hourNotAllowEnd('Terça-Feira', companySite.openAt.tuesday.timeStartAt, companySite.openAt.tuesday.timeEndAt) });
        }          
      }          
      if(_dateTimeStartAt.getDay() == WEDNESDAY) {
        if(!companySite.openAt.wednesday.isOpen) {
          return res.status(422).json({ code: messageLabels.Schedule.DAY_IS_CLOSED, message: messageLabels.Schedule.WEDNESDAY_CLOSED });
        }
        if(_dateTimeStartAt.getHours() < Number(companySite.openAt.wednesday.timeStartAt.substring(0,2)) || 
          (_dateTimeStartAt.getHours() == Number(companySite.openAt.wednesday.timeStartAt.substring(0,2)) && _dateTimeStartAt.getMinutes() < Number(companySite.openAt.wednesday.timeStartAt.substring(3,5)) )
        ) {
          return res.status(422).json({ code: messageLabels.Schedule.HOUR_NOT_ALLOW_START, message: messageLabels.Schedule.hourNotAllowStart('Quarta-Feira', companySite.openAt.wednesday.timeStartAt, companySite.openAt.wednesday.timeEndAt) });
        }
        if(_dateTimeEndAt.getHours() > Number(companySite.openAt.wednesday.timeEndAt.substring(0,2)) ||
          (_dateTimeEndAt.getHours() == Number(companySite.openAt.wednesday.timeEndAt.substring(0,2)) && _dateTimeEndAt.getMinutes() < Number(companySite.openAt.wednesday.timeEndAt.substring(3,5)) )
        ) {
          return res.status(422).json({ code: messageLabels.Schedule.HOUR_NOT_ALLOW_END, message: messageLabels.Schedule.hourNotAllowEnd('Quarta-Feira', companySite.openAt.wednesday.timeStartAt, companySite.openAt.wednesday.timeEndAt) });
        }          
      }           
      if(_dateTimeStartAt.getDay() == THURSDAY) {
        if(!companySite.openAt.thursday.isOpen) {
          return res.status(422).json({ code: messageLabels.Schedule.DAY_IS_CLOSED, message: messageLabels.Schedule.THURSDAY_CLOSED });
        }
        if(_dateTimeStartAt.getHours() < Number(companySite.openAt.thursday.timeStartAt.substring(0,2)) || 
          (_dateTimeStartAt.getHours() == Number(companySite.openAt.thursday.timeStartAt.substring(0,2)) && _dateTimeStartAt.getMinutes() < Number(companySite.openAt.thursday.timeStartAt.substring(3,5)) )
        ) {
          return res.status(422).json({ code: messageLabels.Schedule.HOUR_NOT_ALLOW_START, message: messageLabels.Schedule.hourNotAllowStart('Quinta-Feira', companySite.openAt.thursday.timeStartAt, companySite.openAt.thursday.timeEndAt) });
        }
        if(_dateTimeEndAt.getHours() > Number(companySite.openAt.thursday.timeEndAt.substring(0,2)) ||
          (_dateTimeEndAt.getHours() == Number(companySite.openAt.thursday.timeEndAt.substring(0,2)) && _dateTimeEndAt.getMinutes() < Number(companySite.openAt.thursday.timeEndAt.substring(3,5)) )
        ) {
          return res.status(422).json({ code: messageLabels.Schedule.HOUR_NOT_ALLOW_END, message: messageLabels.Schedule.hourNotAllowEnd('Quinta-Feira', companySite.openAt.thursday.timeStartAt, companySite.openAt.thursday.timeEndAt) });
        }          
      }         
      if(_dateTimeStartAt.getDay() == FRIDAY) {
        if(!companySite.openAt.friday.isOpen) {
          return res.status(422).json({ code: messageLabels.Schedule.DAY_IS_CLOSED, message: messageLabels.Schedule.FRIDAY_CLOSED });
        }
        if(_dateTimeStartAt.getHours() < Number(companySite.openAt.friday.timeStartAt.substring(0,2)) || 
          (_dateTimeStartAt.getHours() == Number(companySite.openAt.friday.timeStartAt.substring(0,2)) && _dateTimeStartAt.getMinutes() < Number(companySite.openAt.friday.timeStartAt.substring(3,5)) )
        ) {
          return res.status(422).json({ code: messageLabels.Schedule.HOUR_NOT_ALLOW_START, message: messageLabels.Schedule.hourNotAllowStart('Sexta-Feira', companySite.openAt.friday.timeStartAt, companySite.openAt.friday.timeEndAt) });
        }
        if(_dateTimeEndAt.getHours() > Number(companySite.openAt.friday.timeEndAt.substring(0,2)) ||
          (_dateTimeEndAt.getHours() == Number(companySite.openAt.friday.timeEndAt.substring(0,2)) && _dateTimeEndAt.getMinutes() < Number(companySite.openAt.friday.timeEndAt.substring(3,5)) )
        ) {
          return res.status(422).json({ code: messageLabels.Schedule.HOUR_NOT_ALLOW_END, message: messageLabels.Schedule.hourNotAllowEnd('Sexta-Feira', companySite.openAt.friday.timeStartAt, companySite.openAt.friday.timeEndAt) });
        }          
      }          
      if(_dateTimeStartAt.getDay() == SATURDAY) {
        if(!companySite.openAt.saturday.isOpen) {
          return res.status(422).json({ code: messageLabels.Schedule.DAY_IS_CLOSED, message: messageLabels.Schedule.SATURDAY_CLOSED });
        }
        if(_dateTimeStartAt.getHours() < Number(companySite.openAt.saturday.timeStartAt.substring(0,2)) || 
          (_dateTimeStartAt.getHours() == Number(companySite.openAt.saturday.timeStartAt.substring(0,2)) && _dateTimeStartAt.getMinutes() < Number(companySite.openAt.saturday.timeStartAt.substring(3,5)) )
        ) {
          return res.status(422).json({ code: messageLabels.Schedule.HOUR_NOT_ALLOW_START, message: messageLabels.Schedule.hourNotAllowStart('Sábado', companySite.openAt.saturday.timeStartAt, companySite.openAt.saturday.timeEndAt) });
        }
        if(_dateTimeEndAt.getHours() > Number(companySite.openAt.saturday.timeEndAt.substring(0,2)) ||
          (_dateTimeEndAt.getHours() == Number(companySite.openAt.saturday.timeEndAt.substring(0,2)) && _dateTimeEndAt.getMinutes() < Number(companySite.openAt.saturday.timeEndAt.substring(3,5)) )
        ) {
          return res.status(422).json({ code: messageLabels.Schedule.HOUR_NOT_ALLOW_END, message: messageLabels.Schedule.hourNotAllowEnd('Sábado', companySite.openAt.saturday.timeStartAt, companySite.openAt.saturday.timeEndAt) });
        }          
      }       

      let twoHourAfter = new Date();
      twoHourAfter.setHours(twoHourAfter.getHours()-1);
      console.log('_dateTimeStartAt < twoHourAfter', _dateTimeStartAt, twoHourAfter)
      if(_dateTimeStartAt < twoHourAfter) {
        return res.status(422).json({ 
          code: messageLabels.Schedule.SCHEDULE_MIN_SITE_CODE,
          message: messageLabels.Schedule.SCHEDULE_MIN_SITE_MESSAGE,
        });
      }     

      const DAYS_DIFF = 14;
      let daysDiffAfter = new Date();
      daysDiffAfter.setDate(daysDiffAfter.getDate()+DAYS_DIFF);      
      console.log('_dateTimeStartAt > daysDiffAfter', _dateTimeStartAt, daysDiffAfter)
      if(_dateTimeStartAt > daysDiffAfter) {
        return res.status(422).json({ 
          code: messageLabels.Schedule.SCHEDULE_MAX_SITE_CODE,
          message: messageLabels.Schedule.SCHEDULE_MAX_SITE_MESSAGE
        });
      }          

      const verificaHorarioAgendadoParaTodos = await Schedule.find({ 
        status: { $in: ['REQUESTED', 'PENDING'] }, 
        dateTimeStartAt: { $lte: _dateTimeStartAt },      
        dateTimeEndAt: { $gt: _dateTimeStartAt },
        companyId: ObjectId(req.body.companyId),
      })

      console.log('schedulesVerify2', verificaHorarioAgendadoParaTodos)
      if(verificaHorarioAgendadoParaTodos && verificaHorarioAgendadoParaTodos.length > 0) {
     
          let alreadySchedule = true;
          let users = await User.find({ company: ObjectId(req.body.companyId), disabled: false });
          if(users.length > 1) {
              for(let i in users) {
                  let u = users[i];
                  // Caso existe algum usuario disponivel deixa agendar.... 
                  const verificaHorarioAgendadoPorUsuario = await Schedule.count({ 
                        status: { $in: ['REQUESTED', 'PENDING'] }, 
                        dateTimeStartAt: { $lte: _dateTimeStartAt },
                        dateTimeEndAt: { $gt: _dateTimeStartAt },
                        companyId: ObjectId(req.body.companyId),
                        'user._id': u._id
                  });
                  console.log(verificaHorarioAgendadoPorUsuario);
                  if(verificaHorarioAgendadoPorUsuario == 0) {
                      alreadySchedule = false;
                      break;
                  }
              }
          }
          if(alreadySchedule === true) { 
              return res.status(422).json({ 
                code: messageLabels.Schedule.THIS_TIME_ALREADY_IS_SCHEDULED_CODE,
                message: messageLabels.Schedule.THIS_TIME_ALREADY_IS_SCHEDULED_MESSAGE
              }); 
          }
      }

      
      const scheduleNew = { 
        customer: {
          name: req.body.customer.name,
          phone_number: req.body.customer.phone_number,
        },
        companyId: req.body.companyId,  
        dateTimeStartAt: _dateTimeStartAt,
        dateTimeEndAt: _dateTimeEndAt,
        services: req.body.services,
        status: 'REQUESTED',
        statusInitial: 'REQUESTED',
        createdBy: req.body.customer.name
      } 

      const schedule = await new Schedule(scheduleNew).save();  
      notificationSaveNewScheduleUsecase.save(schedule); // TODO Kafka Producer

      res.status(200).json(schedule);
    } catch (error) {
      console.error('schedules :: post', error);
      res.status(500).send(error);
    }
});

router.get('/_/site/:companyId', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try { 
 
    let start = new Date(); 
    start.setDate(start.getDate()-1);
    let end = new Date(); 
    end.setDate(end.getDate()+30);

    const schedules = await Schedule.find(
      { 
        companyId: req.params.companyId, 
        status: { $in: [ 'PENDING', 'REQUESTED' ] },
        dateTimeStartAt: { '$gte': start, '$lte': end }             
      } 
    );
    let schedulesSite = [];
    for(let i in schedules) {
      let sch = {customer: {}};
      if(schedules[i].customer.phone_number === req.query.phone_number) { 
          sch.name = 'Meu Agendamento';
      } else {
          sch.name = 'RESERVADO';
      }

      sch.dateTimeStartAt = schedules[i].dateTimeStartAt;
      sch.dateTimeEndAt = schedules[i].dateTimeEndAt;
      sch.status = schedules[i].status;
      schedulesSite.push(sch);
    }
    res.status(200).json(schedulesSite); 
  } catch (error) {
    console.error('schedules :: get :dateStart/:dateEnd', error);
    res.status(500).send(error);
  }
});

module.exports = router;
