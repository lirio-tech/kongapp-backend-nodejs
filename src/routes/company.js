const router = require('express').Router();
const planSvcJs = require('../services/PlanService.js');
const planService = planSvcJs.planService();
const Company = require('../models/Company');
const PaymentsHistoric = require('../models/PaymentsHistoric');
const authorization = require('../middleware/auth-middleware');
const User = require('../models/User.js');
const { ObjectId } = require('mongodb');
const PlanCustomCompany = require('../models/PlanCustomCompany.js');
const notificationSaveSignaturePaidUsecase  = require('../bounded-context/notification/usecases/NotificationSaveSignaturePaidUsecase.js').notificationSaveSignaturePaid();
const companyService = require('../services/CompanyService.js').companyService();
const userService = require('../services/UserService').userService();

router.put('/:_id/upgrade/plan', authorization(), async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    let plan = req.body;

    const userSysAdmin = await User.findOne({_id: req.userId});
    if(!userSysAdmin || userSysAdmin.type !== 'sys_admin') {
      res.status(403).json({message: `Usuario tem Permissao`}); 
      return;
    }

    if(!planService.planPremiums().includes(plan.name)) { 
      res.status(422).json({
            message: 'Plano Invalido para realizar Upgrade', 
            allowedPlans: planService.planPremiums()
        });
      return;
    }
    
    let company = await Company.findOne({_id:req.params._id});
    company.planOld = company.plan;

    if(plan.name === 'Custom' && 
       plan.dateEnd && plan.dateStarted && plan.amountUsers && 
       plan.amountUsersAdmin && plan.amountUsersCommon && 
       (plan.payment && plan.payment.price)) {
        company.plan = plan;
    } 
    else if (plan.name === 'Custom') {
      res.status(422).json({message: 'Todos os campos sao obrigatorios'});    
      return;
    } else {
      plan.dateEnd = plan.dateEnd ? new Date(plan.dateEnd) : null; 
      plan.dateStarted = plan.dateStarted ? new Date(plan.dateStarted) : null;      
      let resultPlan = planService.getUpgrade(company, plan); // TODO funcao impura
      company.plan = resultPlan;
    }
    console.log('company', company); 
    await Company.updateOne({_id: company._id }, company);
    
    console.log('company.fake', company)
    if(!company.fake) {
      await new PaymentsHistoric({ plan: company.plan, company: company }).save();
    }

    res.status(200).json(company);   
})

router.put('/v2/:_id/upgrade/plan', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  let planApply = req.body;

  const userSysAdmin = await User.findOne({_id: req.userId});
  if(!userSysAdmin || userSysAdmin.type !== 'sys_admin') {
    res.status(403).json({message: `Usuario tem Permissao`}); 
    return;
  }

  if(!planService.planPremiums().includes(planApply.name)) { 
    res.status(422).json({
          message: 'Plano Invalido para realizar Upgrade', 
          allowedPlans: planService.planPremiums()
      });
    return;
  }
  
  let company = await Company.findOne({_id:req.params._id}); 
  company.planOld = company.plan;

  if(planApply.name === 'Smart' && 
    planApply.dateEnd && planApply.dateStart && planApply.amountUsers && 
    planApply.amountUsersAdmin && planApply.amountUsersCommon) {
      company.plan = planApply;
      company.plan.dateStarted = planApply.dateStart; 
      company.plan.payment.price = planApply.price;
      company.plan.payment.status = 'PERFORMED';
  } 
  else if (planApply.name === 'Smart') {
    res.status(422).json({message: 'Todos os campos sao obrigatorios'});    
    return;
  } else {
    planApply.dateEnd = planApply.dateEnd ? new Date(planApply.dateEnd) : null; 
    planApply.dateStart = planApply.dateStart ? new Date(planApply.dateStart) : null;
    let resultPlan = planService.getUpgradeV2(planApply);
    company.plan = resultPlan;
  }
  console.log('company', company); 
  await Company.updateOne({_id: company._id }, company);
  notificationSaveSignaturePaidUsecase.save(company._id); 
  console.log('company.fake', company)
  if(!company.fake) {
    await new PaymentsHistoric({ plan: company.plan, company: company }).save();
  }
  res.status(200).json(company);   
})

router.patch('/:_id/downgrade-plan-free', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");   
  console.log('req.userId', req.userId); 

  const userAdmin = await User.findOne({_id: req.userId});
  if(!userAdmin || (userAdmin.type !== 'administrator' && userAdmin.type !== 'sys_admin')) {
    res.status(403).json({message: `Usuario sem Permissao`}); 
    return;
  }

  let company = await Company.findOne({_id:req.params._id});

  await User.updateMany(
    {     
      _id: { $ne: ObjectId(req.userId) }, 
      company: ObjectId(company._id)
    },
    { 
      disabled: true
    }
  );

  if(companyService.isNotExpiredPlan(company, 2) === false) {
      company.downgradePlanFree = true;
  } else {
      company.planOld = company.plan;
      company.plan = companyService.getPlanFree();
      company.downgradePlanFree = false;
  }
  await Company.updateOne({_id: company._id }, company );
  res.status(200).json(company);   
})

router.post('/', authorization(), async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    try {
      if(req.body._id) { 
        // Update
        var company = await Company.updateOne({_id: req.body._id }, req.body);
        console.log('Company updated success!!!'); 
        res.status(200).json(company);        
      } else {
        // Novo
        delete req.body._id;
        const company = await new Company(req.body).save();
        console.log('Company saved success!!!');
        res.status(201).json(company);
      }
    } catch (error) {
      console.error('api-error:: company :: post', error);
      res.status(500).send(error);
    }
});

router.patch('/:_id/services/:serviceType', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      const service = req.body;
      let user = await User.findOne({ _id: req.userId });
      if(!userService.isAdmin(user.type)) {
        res.status(403).json({message: 'Usuario nao permitido para executar essa acao'});        
      }

      console.log('service', service)
      console.log('req => ', req.params.serviceType)
      console.log('req => ', req.params._id)
      
      let company = await Company.findOne({_id: req.params._id });

      let isUpdated = false;
      for(let i in company.services) {
          if(company.services[i].type === req.params.serviceType) {
              company.services[i].type = service.type;
              company.services[i].price = service.price;
              company.services[i].time = service.time;
              isUpdated = true;
          }
      }

      if(isUpdated) {
          let users = await User.find({ company: req.params._id });
          for(let u in users) {
              for(let s in users[u].services) {
                  if(users[u].services[s].type === req.params.serviceType) { 
                      users[u].services[s].type = service.type;
                      users[u].services[s].price = service.price;
                      await User.updateOne({ _id: users[u]._id }, { services: users[u].services });        
                  } 
              }
          }
          await Company.updateOne({_id: req.params._id }, { services: company.services });
          res.status(200).json(company.services);
      }
  } catch(error) {
    console.error('api-error:: company :: patch :_id/services', error);
    res.status(500).send(error);    
  }
})

router.post('/:_id/services', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      const service = req.body;
      let user = await User.findOne({ _id: req.userId });
      if(!userService.isAdmin(user.type)) {
        res.status(403).json({message: 'Usuario nao permitido para executar essa acao'});        
      }
      
      let company = await Company.findOne({_id: req.params._id });
      company.services.push(service);

      let users = await User.find({ company: req.params._id });
      for(let u in users) {
          users[u].services.push({ type: service.type, price: service.price, percentCommission: 50 });
          await User.updateOne({ _id: users[u]._id }, { services: users[u].services });        
      }
      await Company.updateOne({_id: req.params._id }, { services: company.services });
      res.status(200).json(company.services);
  } catch(error) {
    console.error('api-error:: company :: patch :_id/services', error);
    res.status(500).send(error);    
  }
})

router.delete('/:_id/services/:serviceType', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      let user = await User.findOne({ _id: req.userId });
      if(!userService.isAdmin(user.type)) {
        res.status(403).json({message: 'Usuario nao permitido para executar essa acao'});        
      }
      
      let company = await Company.findOne({_id: req.params._id });
      let service = company.services.filter(it => it.type === req.params.serviceType)[0];
      
      let users = await User.find({ company: req.params._id });
      for(let u in users) {
          let svc = users[u].services.filter(it => it.type === req.params.serviceType)[0];
          users[u].services.splice(users[u].services.indexOf(svc), 1);
          await User.updateOne({ _id: users[u]._id }, { services: users[u].services });        
      }      

      company.services.splice(company.services.indexOf(service), 1);
      await Company.updateOne({_id: req.params._id }, { services: company.services });

      res.status(200).json(company.services);
  } catch(error) {
    console.error('api-error:: company :: patch :_id/services', error);
    res.status(500).send(error);    
  }
})

router.get('/:_id', authorization(), async (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");  
    try {
        console.log('path => _id', req.params._id)
        const company = await Company.findOne({ '_id': ObjectId(req.params._id) });
        res.status(200).json(company); 
      } catch (error) {
        console.error('api-error:: company :: get :_id', error);
        res.status(500).send(error);
      }    
});

router.get('', authorization(), async (req, res, next) => {
  try {
      const company = await Company.find({}).sort({ date: -1, createdAt: -1 })    
      res.setHeader("Access-Control-Allow-Origin", "*");  
      res.status(200).json(company); 
    } catch (error) {
      console.error('api-error:: company :: get-all', error);
      res.status(500).send(error);
    }    
});

router.delete('/:_id', authorization(), async (req, res, next) => {
  try {
      await Company.deleteOne({ '_id': req.params._id });
      res.setHeader("Access-Control-Allow-Origin", "*"); 
      res.status(204).json({'message': 'Deleteado'}); 
    } catch (error) {
      console.error('api-error:: company :: delete-by-id', error);
      res.status(500).send(error);
    }    
}); 

router.post('/plan-custom', authorization(), async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  try {

    console.log('req.body.plan', req.body.plan);

    const user = await User.findOne({_id: req.userId}); 
    if(user.type !== 'administrator' && user.type !== 'sys_admin') {
      res.status(403).json({'message': ''}); 
      return;
    }

    const company = await Company.findOne({_id: req.headers['company']}); 
    let planCustomCompany = new PlanCustomCompany
          (
            {
              plan: req.body.plan,
              companyId: company._id,
              userId: user._id
            }
          ).save();

    res.status(201).json(planCustomCompany); 
  } catch(error) {
    console.error('api-error:: company :: plan-custom', error);
    res.status(500).send(error);    
  }
});

router.patch('/:_id/payment-types', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      const cardRate = req.body.cardRate;
      const pixCopyPast = req.body.pixCopyPast;

      let user = await User.findOne({ _id: req.userId });
      if(!userService.isAdmin(user.type)) {
        res.status(403).json({message: 'Usuario nao permitido para executar essa acao'});        
      }
      await Company.updateOne({_id: req.params._id }, { cardRate: cardRate, pixCopyPast: pixCopyPast });
      res.status(200).json({ cardRate: cardRate });
  } catch(error) {
    console.error('api-error:: company :: /:_id/payment-types', error);
    res.status(500).send(error);    
  }
})

module.exports = router;