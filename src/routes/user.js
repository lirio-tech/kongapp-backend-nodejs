const router = require('express').Router();
const axios = require('axios');
const User = require('../models/User');
const UserBalance = require('../models/UserBalance');
const RecoveryPassword = require('../models/RecoveryPassword');
const authorization = require('../middleware/auth-middleware');
const Company = require('../models/Company');
const planService = require('../services/PlanService.js').planService();
const btoa = require('btoa');
const basic_encoded = btoa(`${process.env.AUTH_USER}:${process.env.AUTH_PASS}`)

router.patch('/:_id', authorization(), async (req, res) => { 
    try {
      res.setHeader("Access-Control-Allow-Origin", "*"); 
      
      const userRequestInDB = await User.findOne({ _id: req.params._id });
 
      // Verifica se o Usuario esta se desabilitando
      if(req.userId === req.params._id ) {   
        let userLogged = await User.findOne({ _id: req.userId });
        console.log('req.params._id', userRequestInDB);
        console.log('req.userId', userLogged);
        if(req.body.disabled != userRequestInDB.disabled ) {
          const message = `Nao e possivel habilitar/desabilitar o proprio Usuario`;
          console.warn(message); 
          res.status(422).json({ message: message });  
          return;           
        }
      }

      let disabledAtRule = userRequestInDB.disabledAt;
      if(userRequestInDB.disabled === false && req.body.disabled === true) {
        disabledAtRule = new Date();
      }
 
      // TODO usar essa variavel para evitar Fralde ::=>  let isDisabling = false;
      // Se Usuario estiver tentando habilitar um usuario Desabilitado, 
      //  verifica o Plano para executar acao      
      if(userRequestInDB.disabled === true && req.body.disabled === false) {

        /* 
          TODO :: https://github.com/wiskritorio/appw/issues/14

          Verificar Regra qtde de dias desativados (3) 
          if desabilitado a menos de 3 dias => 422 
        */
        let diffHour = Math.abs(new Date() - userRequestInDB.disabledAt) / 1000 / 60 / 60;
        console.log('diffHour', diffHour)
        if(diffHour < 72) {  
          let msg = `Usuário foi desativado a menos de 3 dias, você poderá ativa-lo novamente somente após os 3 dias depois de desativa-lo`;
          res.status(422).json({message: msg}); 
          return;  
        }

        //isDisabling = true;
        let companyId = req.headers['company'];
        const company = await Company.findOne({_id:companyId});
        let allUsers = await User.find({ company: companyId });

        console.log('company',company);
        console.log('allUsers',allUsers); 

        let resultPlan = planService.validatePlanUpdateUserService(company, allUsers);
        if(resultPlan.isValid === false) {
          console.log('resultPlan', resultPlan);
          res.status(412).json(resultPlan); 
          return;           
        }      
      }

      await User.updateOne(
          { 
            _id: req.params._id 
          }, 
          {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            disabled: req.body.disabled,
            phone_number: req.body.phone_number,
            type: req.body.type, 
            disabledAt: disabledAtRule,
            allowEditOrder: req.body.allowEditOrder,
            percentCommission: req.body.percentCommission,
            services: req.body.services,
            hiddenCommission: req.body.hiddenCommission
          }
      );

      // TODO Create PubSub
      await UserBalance.updateOne({ 'user._id': req.params._id  }, { 'user.name': req.body.name });

      console.log('User updated success!!!');
      res.status(200).json({message: 'User updated success!!!'}); 
    } catch (error) {
      console.error('users :: patch _id', error);

      res.status(500).send(error);
    }
});

// TODO BACKENDAPI
router.patch('/:_id/change-password', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  try {
    const back = process.env.BACKEND_API;
    let url = `${back}/api/users/${req.params._id}/change-password`;
    await axios.put(
              url,
              req.body,
              { 
                headers: {
                  'Content-Type': 'application/json', 
                  'company': req.headers['company'], 
                  'Authorization': `Basic ${basic_encoded}` 
                }
              },              
      );
    res.status(200).json({message: 'Senha Alterada com Sucesso!!!'});
  } catch (error) {
    console.error('users :: patch _id/change-password', error);
    res.status(500).json({ message: 'Erro ao alterar senha' }); 
  }
});
 
router.post('/:_id/recovery', authorization(), async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    let userLogged = await User.findOne({ _id: req.userId });
    if(userLogged.type !== 'administrator' && userLogged.type !== 'sys_admin') {
      const message = `Voce nao possui permissao para executar essa acao`; 
      console.warn(message); 
      res.status(403).json({ message: message });  
      return;          
    }
    await RecoveryPassword.deleteMany({userId: req.params._id });
    const rpass = await new RecoveryPassword({ code: Date.now().toString(36), userId: req.params._id }).save();
    console.log('rpass', rpass);
    // TODO falha de seguraca, codigo/link deve ser envia por email ou sms/whatsapp direto do backend
    res.status(200)
       .json(
          {
            message: `Codigo gerado = ${rpass.code}`, 
            link: `https://app.wiskritorio.com.br/#/public/recovery/${rpass.code}`
          }); 
  } catch (error) {
    console.error('users :: post _id/recovery', error);
    res.status(500).send(error); 
  }
});

router.patch('/recovery/:code', async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    if(!req.params.code) {
      console.log('Recovery Code Invalid');
      res.status(400).json({message: 'Codigo de Recuperacao invalido'}); 
      return; 
    }
    let rpass = await RecoveryPassword.findOne({ code: req.params.code });
    let user = await User.findOne({ _id: rpass.userId });
    rpass.code = 'STARTED_RECOVERY-'+Date.now().toString(36);
    await RecoveryPassword.updateOne({ _id: rpass._id }, { code: rpass.code });
    res.status(200).json({ usr: user, cd: rpass });
  } catch (error) {
    console.error('users :: patch recovery/:code', error);
    res.status(500).send(error);
  }
});

router.patch('/:_id/configuration', authorization(), async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    const configuration = req.body;
    await User.updateOne( 
      { _id: req.params._id },
      { configuration: configuration }
    );    
    res.status(200).json({message: 'Atualizado com sucesso'});
  } catch (error) {
    console.error('users :: patch _id/configuration', error);
    res.status(500).send(error); 
  }
});

router.patch('/:_id/become-admin', authorization(), async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*"); 

    let userLogged = await User.findOne({ _id: req.userId });
    if(userLogged.type !== 'administrator' && userLogged.type !== 'sys_admin') {
      const message = `Voce nao possui permissao para executar essa acao`; 
      console.warn(message); 
      res.status(403).json({ message: message });  
      return;          
    }

    const company = await Company.findOne({_id:req.headers['company']});
    if(company.plan.name === 'Free') {
      const message = `Voce nao pode alterar o usuario para Admin, assine nosso plano Premium e veja o melhor para VC ;-)`;
      console.warn(message); 
      res.status(412).json({ message: message }); 
      return;
    }

    const amountUsersAdmin = await User.count({ company: company._id, type: 'administrator' });
    if(amountUsersAdmin >= company.plan.amountUsersAdmin) {  
      const message = `Vc atingiu o numero de usuarios (${company.plan.amountUsersAdmin}) Admin do seu plano, veja nossa tabela de planos ou entre em contato conosco!`;
      console.warn(message); 
      res.status(412).json({ message: message }); 
      return;    
    }
    await User.updateOne({ _id: req.params._id }, { type: 'administrator' });
    console.log('User updated success!!!');
    res.status(200).json({message: 'User updated success!!!'}); 
    

  } catch (error) {
    console.error('users :: patch _id/become-admin', error);
    res.status(500).send(error);
  }
});

router.patch('/:_id/become-common', authorization(), async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*"); 

    let userLogged = await User.findOne({ _id: req.userId });
    if(userLogged.type !== 'administrator' && userLogged.type !== 'sys_admin') {
      const message = `Voce nao possui permissao para executar essa acao`; 
      console.warn(message); 
      res.status(403).json({ message: message });  
      return;          
    }

    await User.updateOne({ _id: req.params._id }, { type: 'hairdresser' });
    console.log('User updated success!!!');
    res.status(200).json({message: 'User updated success!!!'}); 
    
  } catch (error) {
    console.error('users :: patch _id/become-common', error);
    res.status(500).send(error);
  }
});

router.get('/:username', async (req, res, next) => {
  try {
      //let companyId = req.headers['company'];
      const user = await User.findOne({ 'username': req.params.username });
      res.setHeader("Access-Control-Allow-Origin", "*");  
      res.status(200).json(user); 
    } catch (error) {
      console.error('users :: get username', error);
      res.status(500).send(error);
    }    
});

router.get('/_/:_id', async (req, res, next) => {
  try {
      let companyId = req.headers['company'];
      const user = await User.findOne({ '_id': req.params._id, company: companyId });
      res.setHeader("Access-Control-Allow-Origin", "*");  
      res.status(200).json(user); 
    } catch (error) {
      console.error('users :: get /_/_id', error);
      res.status(500).send(error);
    }    
});

// OBSOLETO
router.get('/', authorization(), async (req, res, next) => {
  try {
      let companyId = req.headers['company'];
      let enabledType = req.query.enabledType;
      if(!enabledType) {
        enabledType = 'enabled';
      }
      var user = []; 
      if(enabledType && enabledType === 'all') {
        user = await User.find({ company: companyId }); 
      }  
      else {
        user = await User.find(
          { 
            disabled: { $ne: enabledType==='enabled' },
            company: companyId
          });
      }    
      res.setHeader("Access-Control-Allow-Origin", "*");  
      res.status(200).json(user); 
    } catch (error) {
      console.error('users :: get-with-enabledType', error);
      res.status(500).send(error);
    }    
});

router.get('/v2/company/:companyId', authorization(), async (req, res, next) => {
  try {
      let companyId = req.params.companyId;
      let enabledType = req.query.enabledType;
      if(!enabledType) {
        enabledType = 'enabled';
      }
      var user = []; 
      if(enabledType && enabledType === 'all') {
        user = await User.find({ company: companyId }); 
      }  
      else {
        user = await User.find(
          { 
            disabled: { $ne: enabledType==='enabled' },
            company: companyId
          });
      }    
      res.setHeader("Access-Control-Allow-Origin", "*");  
      res.status(200).json(user); 
    } catch (error) {
      console.error('users :: get-with-enabledType', error);
      res.status(500).send(error);
    }    
});

router.get('/site/company/:companyId', async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      let companyId = req.params.companyId;
      let enabledType = req.query.enabledType;
      if(!enabledType) {
        enabledType = 'enabled';
      }
      var user = []; 
      if(enabledType && enabledType === 'all') {
        user = await User.find({ company: companyId }); 
      }  
      else {
        user = await User.find(
          { 
            disabled: { $ne: enabledType==='enabled' },
            company: companyId
          });
      }    
      let usersSite = [];
      for(let i in user) {
        usersSite.push(  
          {
            name: user[i].name,
            username: user[i].username,
            services: user[i].services
         }
        );
      }
      res.status(200).json(usersSite); 
    } catch (error) {
      console.error('users :: get-with-enabledType', error);
      res.status(500).send(error);
    }    
});

router.patch('/update/commission', authorization(), async (req, res, next) => {
  try {
 
      let userLogged = await User.findOne({ _id: req.userId });
      if(userLogged.type !== 'administrator' && userLogged.type !== 'sys_admin') {
        const message = `Voce nao possui permissao para executar essa acao`; 
        console.warn(message); 
        res.status(403).json({ message: message });
        return;          
      }

      const users = req.body;
       
      const promisses = users.map(async(u,i) => {
        console.log('u', u.percentCommission);
        await User.updateOne(
          { 
            _id: u._id
          }, 
          {
            percentCommission: u.percentCommission
          }
        );

      }); 
      
      await Promise.all(promisses);

      res.setHeader("Access-Control-Allow-Origin", "*");  
      res.status(200).json(users);
    } catch (error) {
      console.error('users :: patch update/commission', error);
      res.status(500).send(error);
    }    
});

router.get('/update/user/allow/edit/order', async (req, res, next) => {
  try {
      let users = await User.find();
      let promises = users.map(async(u, i) => {
        console.log(u);
        await User.updateOne({_id: u._id }, { $set: { allowEditOrder: false } });
      });
      await Promise.all(promises);
      console.error(`Updated...`);
      let users_ = await User.find();
      res.setHeader("Access-Control-Allow-Origin", "*");  
      res.status(200).json(users_);
    } catch (error) {
      console.error('users :: patch update/user/allow/edit/order', error);
      res.status(500).send(error);
    }    
});
 
module.exports = router;
