const router = require('express').Router();
const UserBalance = require('../models/UserBalance');
const authorization = require('../middleware/auth-middleware');
const UserBalanceDetail = require('../models/UserBalanceDetail');
const User = require('../models/User');
const { Promise } = require('mongoose');

router.get('/', authorization(), async (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");  
    try {
      let companyId = req.headers['company'];
      const usersBalance = await UserBalance.find({ 'user.company': companyId }).sort({ balance: 1 });
      let result = [];
      let promises = usersBalance.map(async(ub, i) => {
          if(ub.balance > 0) { // if have balance 
            result.push(ub);
          } else { 
            const user = await User.findOne({ _id: ub.user._id });
            if(user.disabled === false) { 
              result.push(ub);
            } 
          }
      });
      await Promise.all(promises);
      res.status(200).json(result);
    } catch (error) {
      console.error('usersBalance :: get by-company', error);
      res.status(500).send(error);
    }    
});


router.get('/user/:userId', authorization(), async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
    const userBalance = await UserBalance.findOne({ 'user._id': req.params.userId });
    res.status(200).json(userBalance);
  } catch (error) { 
    console.error('usersBalance :: user/:userId', error);
    res.status(500).send(error);
  }    
});

router.get('/user/:userId/detail', authorization(), async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  console.log('extrato => /user/:userId/detail', req.params.userId);
  try {
    let userBalanceDetail = await UserBalanceDetail.find({ userId: req.params.userId }).sort({ date: -1, updatedAt: -1 });
    res.status(200).json(userBalanceDetail); 
    return;
  } catch (error) { 
    console.error('usersBalance :: user/:userId/detail', error);
    res.status(500).send(error);
  }    
});

router.post('', authorization(), async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
    console.log('POST pagto/vale', req.body);
    let userLogged = await User.findOne({ _id: req.userId });
    if(userLogged.type !== 'administrator' && userLogged.type !== 'sys_admin') {
      const message = `Voce nao possui permissao para executar essa acao`; 
      console.warn(message); 
      res.status(403).json({ message: message });
      return;          
    }    

    if(req.body.value <= 0) {
      res.status(422).json({ message: `Valor deve ser maior que ZERO` });
      return;
    }
 
    const userBalanceDetailWillSave = {
      userId: req.body.userId, 
      value: req.body.value,
      date: req.body.date,
      type: req.body.type,
      orderId: null,
      description: req.body.description
    }    
    const userBalanceDetail = await new UserBalanceDetail(userBalanceDetailWillSave).save(); 
 
    let userBalance = await UserBalance.findOne({ 'user._id': userBalanceDetail.userId });
    let debitBalance = userBalance.balance - userBalanceDetail.value;
    await UserBalance.updateOne( { 'user._id': userBalanceDetail.userId }, { balance: debitBalance } );

    res.status(200).json(userBalanceDetail);
 
  } catch (error) { 
    console.error('usersBalance :: post', error);
    res.status(500).send(error);
  }    
});

router.delete('/:userBalanceId/:userBalanceDetailId', authorization(), async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
    console.log('DELETE /:userBalanceId/:userBalanceDetailId', req.params.userBalanceId, req.params.userBalanceDetailId);
    let userLogged = await User.findOne({ _id: req.userId });
    if(userLogged.type !== 'administrator' && userLogged.type !== 'sys_admin') {
      const message = `Voce nao possui permissão para executar essa ação`; 
      return res.status(403).json({ message: message });          
    }    
    const userBalanceDetail = await UserBalanceDetail.findOne({ _id: req.params.userBalanceDetailId });

    if(canDelete(userBalanceDetail)) {
        await UserBalanceDetail.deleteOne({ _id: req.params.userBalanceDetailId });
        let userBalance = await UserBalance.findOne({ _id: req.params.userBalanceId });
        let debitBalance = userBalance.balance + userBalanceDetail.value;
        await UserBalance.updateOne( { _id: req.params.userBalanceId }, { balance: debitBalance } );
        console.log(`Lançamento excluído com sucesso`);
        return res.status(200).json({ message: `Lançamento excluído com sucesso` });
    } else {
      console.log('Não Permitido Excluir Pagamento ou Vale após 1 dia do Lançamento.' );
      return res.status(403).json({ message: 'Não Permitido Excluir Pagamento ou Vale após 1 dia do Lançamento.' });      
    }
 
  } catch (error) { 
    console.error('usersBalance :: deletet', error);
    return res.status(500).send(error);
  }    
});

function canDelete(detail) {
  if(detail.type === 'PAYMENT' || detail.type === 'MONEY_VOUCHER') {  
    let today = new Date();
    let createdPlusOne = new Date(detail.createdAt);
    createdPlusOne.setDate(createdPlusOne.getDate()+1);
    return createdPlusOne > today;
  }
  return false;
}

module.exports = router;
