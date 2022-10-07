const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const RecoveryPassword = require('../models/RecoveryPassword');
const authorization = require('../middleware/auth-middleware');
const Company = require('../models/Company');
const { ObjectId } = require('mongodb');
const UserBalance = require('../models/UserBalance');
const CompanySite = require('../models/CompanySite');
const companyService = require('../services/CompanyService').companyService();
const companySiteService = require('../services/CompanySiteService').companySiteService();
const planService = require('../services/PlanService.js').planService()
const BCRYPT_SALT_ROUNDS = 10;

router.post('/signup', authorization(), async (req, res) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*"); 

      req.body.username = req.body.username.trim();

      const userVerify = await User.findOne({ 
        username: req.body.username
      }).exec();

      if (userVerify) {
        const message = `Username ja existe`;
        console.warn(message);
        res.setHeader("Access-Control-Allow-Origin", "*"); 
        res.status(422).json({ auth: false, message }); 
        return; 
      }   
      const countUsers = await User.count({ company: ObjectId(req.headers['company']), disabled: false });
      const company = await Company.findOne({_id: req.headers['company']})
      let resultPlan = planService.validatePlanSaveNewUserService(company, countUsers);
      if(resultPlan.isValid === false) {
        console.warn('auth :: ResultPlan', resultPlan); 
        res.setHeader("Access-Control-Allow-Origin", "*"); 
        res.status(412).json(resultPlan);  
        return;
      }       

      const hash = await bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS);
      req.body.password = hash;
      const user = await new User(req.body).save();
      await new UserBalance({user: user}).save(); // TODO Publish
      res.setHeader("Access-Control-Allow-Origin", "*"); 
      res.status(201).json(user);
    } catch (error) {
      console.error('User save Fail...');
      console.error('auth :: signup', error);
      res.status(500).send(error);
    }
});

router.patch('/recovery', async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    let rpass = await RecoveryPassword.findOne({ code: req.body.cd });
    const hash = await bcrypt.hash(req.body.pw, BCRYPT_SALT_ROUNDS);
    req.body.pw = hash;
    await User.updateOne({ _id: rpass.userId }, { password: req.body.pw }).exec();
    res.status(200).json({message:''});
  } catch (error) {
    console.error('User Recovery Fail...'); 
    console.error('auth :: recovery', error);
    res.status(500).send(error); 
  }
});

router.post('/signup/company', async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    
    const userVerifyPhonenumber = await User.findOne({ 
      phone_number: req.body.user.phone_number
    }).exec();

    if (userVerifyPhonenumber) {
      const message = `Numero de Celular ja cadastrado em nossa Base. Caso esqueceu sua senha entre em contato conosco!`;
      console.warn(message);
      return res.status(422).json({ auth: false, message }); 
    }       

        
    req.body.user.username = req.body.user.username.trim();
    const userVerify = await User.findOne({ 
      username: req.body.user.username
    }).exec();

    if (userVerify) {
      const message = `Username já existe, por favor escolha outro`;
      console.warn(message);
      return res.status(422).json({ auth: false, message });  
    }   

    let userNew = req.body.user;
    if(userNew.password !== userNew.confirmPassword) {
      res.status(422).json({ message: `Senhas nao conferem` }); 
      return;       
    }

    req.body.company.plan = companyService.getPlanFree();
    req.body.company.services = companyService.getSignUpServices(req.body.company.companyType);
    const companyNew = await new Company(req.body.company).save();

    const companySite = companySiteService.getNewCompanySite(companyNew, userNew.phone_number);
    console.log('companySite', companySite);
    await new CompanySite(companySite).save();

    userNew.company = companyNew._id;
    userNew.password = await bcrypt.hash(userNew.password, BCRYPT_SALT_ROUNDS); 
    userNew.type = 'administrator';
    userNew.device = req.headers['user-agent'];
    userNew.services = companyService.getUserServices(req.body.company.companyType);
    const userSaved = await new User(userNew).save(); 
    await new UserBalance({user: userSaved, balance: 0}).save(); // TODO Publish

    const tokenId = userSaved._id; 
    const token = jwt.sign({ tokenId }, process.env.JWT_SECRET, {
      expiresIn: 2880000, // expires in 48 hrs
    });

    let responseSignup = {
      token: token,
      user: userSaved,
      company: companyNew
    }

    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.status(201).json(responseSignup);
  } catch (error) {
    console.error('auth :: signup/company', error);
    res.status(500).send(error);
  }
});

router.post('/signin', async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    try {
          console.log(req.body);
          let user = await User.findOne({ username: req.body.username, disabled: false }).exec();
          if(!user) {
              user = await User.findOne({ phone_number: req.body.phone_number, disabled: false }).exec();
          }

          if (user === null) {
            const message = `Suas credenciais não conferem :(`;
            console.warn(message);
            res.status(401).json({ auth: false, message }); 
            return;
          }
          const compare = await bcrypt.compare(req.body.password, user.password);
          if (!compare) {
            const message = 'password does not match';
            console.warn('auth :: signin', message);
            res.status(401).json({ auth: false, message });
            return;
          }
          console.log('sign-in', user);
        
          const tokenId = user._id; 
          const token = jwt.sign({ tokenId }, process.env.JWT_SECRET, {
            expiresIn: 2880000, // expires in 48 hrs 
          });

          if(req.headers['user-agent']) {
            await User.updateOne({_id: user._id}, { device: req.headers['user-agent'] });
          } 
          const company = await Company.findOne({_id: user.company}).exec();
          res.status(200).json({ auth: true, token: token, user: user, company: company });
    } catch (error) {
      console.error('auth :: signin', error);
      res.status(500).send(error);
    }
});

router.post('/_/v2/signin', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  try {
        console.log(req.body);
        const user = await User.findOne({ phone_number: req.body.phone_number, disabled: false }).exec();

        if (user === null) {
          const message = `Suas credenciais nao conferem :(`;
          console.warn(message);
          res.status(401).json({ auth: false, message }); 
          return;
        }
        const compare = await bcrypt.compare(req.body.password, user.password);
        if (!compare) {
          const message = 'password does not match';
          console.warn('auth :: signin', message);
          res.status(401).json({ auth: false, message });
          return;
        }
        console.log('sign-in', user);
      
        const tokenId = user._id; 
        const token = jwt.sign({ tokenId }, process.env.JWT_SECRET, {
          expiresIn: 2880000, // expires in 48 hrs 
        });

        if(req.headers['user-agent']) {
          await User.updateOne({_id: user._id}, { device: req.headers['user-agent'] });
        } 
        const company = await Company.findOne({_id: user.company}).exec();
        res.status(200).json({ auth: true, token: token, user: user, company: company });
  } catch (error) {
    console.error('auth :: signin', error);
    res.status(500).send(error);
  }
});

module.exports = router;
