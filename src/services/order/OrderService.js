const Order = require('../../models/Order');
const { ObjectId } = require('mongodb');
const User = require('../../models/User');
const Company = require('../../models/Company');
const UserBalanceDetail = require('../../models/UserBalanceDetail');
const UserBalance = require('../../models/UserBalance');
const companyService = require('../../services/CompanyService.js').companyService();
const planService = require('../../services/PlanService.js').planService();

module.exports.orderService = () => {
    return {                
        getResultFalse(status, message, planName) {
          return {
            isValid: false,
            status: status,
            message: message,
            plan: planName,
            order: null
          }
        },      
        // OBSOLETO
        async analyticsV3(req, res) {
          try {     
            
            const user = await User.findOne({ _id: ObjectId(req.userId) })
            const company = await Company.findOne({ _id: ObjectId(req.headers['company']) })

            if(user.username !== 'diego') {
              console.log('version-app', req.headers['version'], user.username, req.headers['company']);
            }

            let notify = [];
            if(company.plan.dateEnd && new Date(company.plan.dateEnd) <= new Date()) {
                message = {
                  text: 'Seu plano venceu, Renove agora mesmo :)',
                  link: company.plan.name === 'Custom' ? '/public/simulator-plan' : `/admin/payment/${company.plan.name}`,
                  linkTitle: 'Renovar',
                  type: 'warning',
                  closeable: true,
                }
                notify.push(message);
            } 

            if(user.type === 'administrator' || user.type === 'sys_admin') {
              const orders = await Order.aggregate([
                  {
                    '$match': {
                      'company': ObjectId(req.headers['company']),
                      'date': {
                        '$gte': req.params.dateIni,
                        '$lte': req.params.dateEnd
                      } 
                    }
                  }, {
                    '$group': {
                      '_id': '$user.name', 
                      'total': {
                        '$sum': '$total'
                      }, 
                      'amount': {
                        '$sum': 1
                      }, 
                      'cash': {
                        '$sum': {
                          '$cond': [
                            {
                              '$eq': [
                                '$paymentType', 'cash'
                              ]
                            }, '$total', 0
                          ]
                        }
                      }, 
                      'card': {
                        '$sum': {
                          '$cond': [
                            {
                              '$eq': [
                                '$paymentType', 'card'
                              ]
                            }, '$total', 0
                          ]
                        }
                      }, 
                      'pix': {
                        '$sum': {
                          '$cond': [
                            {
                              '$eq': [
                                '$paymentType', 'pix'
                              ]
                            }, '$total', 0
                          ]
                        }
                      }, 
                      'commission': {
                        '$sum': '$commission'
                      },            
                      'totalCompany': {
                        '$sum': '$totalCompany'
                      }
                    }
                  },
                  { '$sort' : { _id: 1 } }
              ]); 
              const result = {
                  user: user,
                  orders: orders,
                  company: company,
                  notifications: notify
              }
              res.status(200).json(result);  
            } 
            else if(user.type === 'hairdresser') {
              const orders = await Order.aggregate([
                {
                  '$match': {
                    'user._id': ObjectId(user._id),
                    'company': ObjectId(req.headers['company']),
                    'date': {
                      '$gte': req.params.dateIni, 
                      '$lte': req.params.dateEnd  
                    }
                  }
                }, {
                  '$group': {
                    '_id': '$user.name', 
                    'total': {
                      '$sum': '$total'
                    }, 
                    'amount': {
                      '$sum': 1
                    }, 
                    'cash': {
                      '$sum': {
                        '$cond': [
                          {
                            '$eq': [
                              '$paymentType', 'cash'
                            ]
                          }, '$total', 0
                        ]
                      }
                    }, 
                    'card': {
                      '$sum': {
                        '$cond': [
                          {
                            '$eq': [
                              '$paymentType', 'card'
                            ]
                          }, '$total', 0
                        ]
                      }
                    }, 
                    'pix': {
                      '$sum': {
                        '$cond': [
                          {
                            '$eq': [
                              '$paymentType', 'pix'
                            ]
                          }, '$total', 0
                        ]
                      }
                    }, 
                    'commission': {
                      '$sum': '$commission'
                    },            
                    'totalCompany': {
                      '$sum': '$totalCompany'
                    }
                  }
                },
                { '$sort' : { _id: 1 } }
              ]); 
              const result = {
                user: user,
                orders: orders,
                company: company,
                notifications: notify
              }
              res.status(200).json(result);     
            } else {
              res.status(500).json({message: `Nao identificado o tipo do usuario`});        
            }
          } catch (error) {
              console.error(error);
              res.status(500).send(error);
          } 
        },       
        async analyticsV4(req, res) {
          try {     
            
            const user = await User.findOne({ _id: ObjectId(req.userId) })
            const company = await Company.findOne({ _id: ObjectId(req.headers['company']) })

            if(user.username !== 'diego') {
              console.log(`version-app=${req.headers['version']}, user=${user.username}, company=${company.shortName}, agent=${req.headers['user-agent']}`);
            }

            let notify = [];
            if(company.plan.dateEnd && new Date(company.plan.dateEnd) <= new Date()) {
                message = {
                  text: 'Seu plano venceu, Renove agora mesmo :)',
                  link: company.plan.name === 'Smart' ? '/public/simulator-plan' : `/admin/payment/${company.plan.name}`,
                  linkTitle: 'Renovar',
                  type: 'warning',
                  closeable: true,
                }
                notify.push(message);
            } 

            if(user.type === 'administrator' || user.type === 'sys_admin') {
              const orders = await Order.aggregate([
                  {
                    '$match': {
                      'company': ObjectId(req.headers['company']),
                      'date': {
                        '$gte': req.params.dateIni,
                        '$lte': req.params.dateEnd
                      } 
                    }
                  }, {
                    '$group': {
                      '_id': '$user.name', 
                      'total': {
                        '$sum': '$total'
                      }, 
                      'amount': {
                        '$sum': 1
                      }, 
                      'cash': {
                        '$sum': {
                          '$cond': [
                            {
                              '$eq': [
                                '$paymentType', 'cash'
                              ]
                            }, '$total', 0
                          ]
                        }
                      }, 
                      'card': {
                        '$sum': {
                          '$cond': [
                            {
                              '$eq': [
                                '$paymentType', 'card'
                              ]
                            }, '$total', 0
                          ]
                        }
                      }, 
                      'pix': {
                        '$sum': {
                          '$cond': [
                            {
                              '$eq': [
                                '$paymentType', 'pix'
                              ]
                            }, '$total', 0
                          ]
                        }
                      }, 
                      'commission': {
                        '$sum': '$commission'
                      },            
                      'totalCompany': {
                        '$sum': '$totalCompany'
                      },
                      'cardRateValueDiscount': {
                        '$sum': '$cardRateValueDiscount'
                      },       
                      'netTotal': {
                        '$sum': '$netTotal'
                      },                                          
                    }
                  },
                  { '$sort' : { _id: 1 } }
              ]); 
              const result = {
                  user: user,
                  orders: orders,
                  company: company,
                  notifications: notify
              }
              res.status(200).json(result);  
            } 
            else if(user.type === 'hairdresser') {
              const orders = await Order.aggregate([
                {
                  '$match': {
                    'user._id': ObjectId(user._id),
                    'company': ObjectId(req.headers['company']),
                    'date': {
                      '$gte': req.params.dateIni, 
                      '$lte': req.params.dateEnd  
                    }
                  }
                }, {
                  '$group': {
                    '_id': '$user.name', 
                    'total': {
                      '$sum': '$total'
                    }, 
                    'amount': {
                      '$sum': 1
                    }, 
                    'cash': {
                      '$sum': {
                        '$cond': [
                          {
                            '$eq': [
                              '$paymentType', 'cash'
                            ]
                          }, '$total', 0
                        ]
                      }
                    }, 
                    'card': {
                      '$sum': {
                        '$cond': [
                          {
                            '$eq': [
                              '$paymentType', 'card'
                            ]
                          }, '$total', 0
                        ]
                      }
                    }, 
                    'pix': {
                      '$sum': {
                        '$cond': [
                          {
                            '$eq': [
                              '$paymentType', 'pix'
                            ]
                          }, '$total', 0
                        ]
                      }
                    }, 
                    'commission': {
                      '$sum': '$commission'
                    },            
                    'totalCompany': {
                      '$sum': '$totalCompany'
                    },
                    'cardRateValueDiscount': {
                      '$sum': '$cardRateValueDiscount'
                    },       
                    'netTotal': {
                      '$sum': '$netTotal'
                    },                         
                  }
                },
                { '$sort' : { _id: 1 } }
              ]); 
              const result = {
                user: user,
                orders: orders,
                company: company,
                notifications: notify
              }
              res.status(200).json(result);     
            } else {
              res.status(500).json({message: `Nao identificado o tipo do usuario`});        
            }
          } catch (error) {
              console.error(error);
              res.status(500).send(error);
          } 
        },         
        // OBSOLETO   
        async saveV8(order, userId, companyId) {
          try {
            order.company = companyId;
            console.log('m=saveV8',order);
            
            const userLogged = await User.findOne({ '_id': userId });
            if(userLogged.disabled === true) {  
                console.log('Usuario desabilitado!');
                return this.getResultFalse(401, 'Usuario desabilitado');
            }
        
            const user = await User.findOne({ '_id': order.user._id });
            order.user = user;

            let company = await Company.findOne({ '_id': companyId });
        
            order.commission = 0;
            order.totalCompany = 0;
            order.total = 0;

            for(let i in order.services) {
                console.log(user.services);
                const service = user.services.filter(it => it.type === order.services[i].type)[0];
                if(!service) {
                  return this.getResultFalse(422, `${user.name} nao possui o service ${order.services[i].type}`);
                }
                order.services[i].percentCommission = service.percentCommission;
                order.services[i].priceCommission = order.services[i].price * service.percentCommission / 100;
                order.services[i].priceCompany = order.services[i].price - order.services[i].priceCommission;
                
                order.commission += order.services[i].priceCommission;
                order.totalCompany += order.services[i].priceCompany;
                order.total += order.services[i].price;
            }

            if(!order.user.username) { 
              console.log('Usuario Invalido', order.user);
              return this.getResultFalse(422, 'Usuario desabilitado');
            } 
        
            let today = new Date(); 
            let dateRequest = new Date(order.date);
            if(dateRequest > today) {
              return this.getResultFalse(422, 'Não permitido uma data futura');
            }
        
            // TODO Bug
            if(dateRequest.getMonth()-today.getMonth() <= -2) {
              return this.getResultFalse(422, 'Não é permitido lançamento de mais de 1 Mês anterior');
            }     
        
            let m = new Date();
            let ini = new Date();
            ini.setFullYear(m.getFullYear(), m.getMonth(), 1);
            let end = new Date();
            end.setFullYear(m.getFullYear(), m.getMonth()+1, 0);
        
            let monthStart = String(ini.getMonth()+1).padStart(2, "0");
            let dayStart = String(ini.getDate()).padStart(2, "0");
            let monthEnd = String(end.getMonth()+1).padStart(2, "0");
            let dayEnd = String(end.getDate()).padStart(2, "0");
            let period = {
              firstDay: ini.getFullYear() + '-' + monthStart + '-' +dayStart,
              lastDay: end.getFullYear() + '-' + monthEnd + '-' +dayEnd
            }      
        
            const aggregateMonth = await Order.aggregate([
              { 
                $match: 
                  {
                    date: {
                      $gte: period.firstDay,
                      $lte: period.lastDay
                    },
                    company: company._id
                  }
              },
              { 
                $group: {
                  _id: null,
                  totalValue: { $sum: "$total" },
                  count: { $sum: 1 }
                } 
              } 
            ])    
        
            console.log('total: === ', aggregateMonth)
        
            if(company.plan.name !== 'Free') {
              if(companyService.isNotExpiredPlan(company, 2) === false) {
                if(company.downgradePlanFree === true) {
                  company.planOld = company.plan;
                  company.plan = companyService.getPlanFree();
                  company.downgradePlanFree = false;
                  await Company.updateOne({_id: company._id}, company);
                } else {
                  // flag addMoreOneDay = true
                  const msg = 'Seu Plano está vencido, renove seu plano agora mesmo ou entre em contato conosco!';
                  console.log('Plan Expired', msg); 
                  return this.getResultFalse(412, msg, company.plan.name);
                }
              } else if(company.plan.payment.status !== 'PERFORMED') {
                  const msg = 'Bloqueado por falta de pagamento.';
                  console.log('Blocked', msg); 
                  return this.getResultFalse(412, msg, company.plan.name);
              }
            }
        
            let total = aggregateMonth.length > 0 ? aggregateMonth[0].totalValue : 0;
        
            let resultPlan = planService.validatePlanNewOrderService(company, total); 
            if(resultPlan.isValid === false) { 
              return this.getResultFalse(412, resultPlan.message, resultPlan.plan) ;
            }
        
            let userBalance = await UserBalance.findOne({ 'user._id': order.user._id });
            console.log('userBalance '+ order.user._id, userBalance); 
            
            if(order._id) {  
        
              const orderFind = await Order.findOne({_id: order._id });
              // Update
              let orderUpdated = await Order.updateOne({_id: order._id }, order);
         
              const balanceUpdate = userBalance.balance + order.commission - orderFind.commission;
              await UserBalance.updateOne( 
                { 'user._id': order.user._id }, 
                { balance: balanceUpdate }
              );  

              order.updatedByUserId = userId;
         
              await UserBalanceDetail.updateOne( 
                { 
                  orderId: order._id
                },   
                {
                  userId: order.user._id,
                  value: order.commission,
                  date: order.date,
                  description: order.customer.name 
                }
              )
        
              console.log('Order updated success!!!');
              return {
                isValid: true,
                status: 200,
                message: 'Order updated success!!!',
                plan: company.plan.name,
                order: orderUpdated
              }                          
            } else {
              // Novo
              delete order._id;
              order.createdByUserId = userId;
              const orderSaved = await new Order(order).save();
        
              let balanceAdd = userBalance.balance + order.commission;
              console.log('balanceAdd', balanceAdd);
              await UserBalance.updateOne(  
                { 'user._id': orderSaved.user._id }, 
                { balance: balanceAdd } 
              );
         
              const userBalanceDetail = {
                userId: orderSaved.user._id, 
                value: orderSaved.commission,
                date: orderSaved.date,
                type: 'SERVICE_PERFORMED',
                orderId: orderSaved._id,
                description: order.customer.name
              }
              await new UserBalanceDetail(userBalanceDetail).save(); 
        
              console.log('Order saved success!!!');
              return {
                isValid: true,
                status: 201,
                message: 'Order saved success!!!',
                plan: company.plan.name,
                order: orderSaved
              }                   
            }
          } catch (error) {
            console.error('OrderService :: save', error);
            return {
              isValid: false,
              status: 500,
              message: error,
              plan: null,
              order: null
            }                  
          }        
        },     
        async saveV9(order, userId, companyId) {
          try {
            order.company = companyId;
            console.log('m=saveV9',order);
            
            const userLogged = await User.findOne({ '_id': userId });
            if(userLogged.disabled === true) {  
                console.log('Usuario desabilitado!');
                return this.getResultFalse(401, 'Usuario desabilitado');
            }
        
            const user = await User.findOne({ '_id': order.user._id });
            order.user = user;

            if(!order.user.username) { 
              console.log('Usuário Inválido', order.user);
              return this.getResultFalse(422, 'Usuário desabilitado');
            }             

            let company = await Company.findOne({ '_id': companyId });
        
            order.commission = 0;
            order.totalCompany = 0;
            order.total = 0;
            
            for(let i in order.services) {
                console.log(user.services);
                const service = user.services.filter(it => it.type === order.services[i].type)[0];
                if(!service) {
                  return this.getResultFalse(422, `${user.name} não possui o serviço ${order.services[i].type}`);
                }
                order.services[i].percentCommission = service.percentCommission;
                order.services[i].priceCommission = order.services[i].price * service.percentCommission / 100;
                order.services[i].priceCompany = order.services[i].price - order.services[i].priceCommission;
                
                order.commission += order.services[i].priceCommission;
                order.totalCompany += order.services[i].priceCompany;
                order.total += order.services[i].price;
            }

            if(order.paymentType !== 'card') { 
              order.cardRate = 0;
            }
            order.cardRateValueDiscount = order.total * order.cardRate / 100;
            order.netTotal = order.total - order.cardRateValueDiscount;
            order.totalCompany -= order.cardRateValueDiscount
            console.log(`discountRate=${order.cardRateValueDiscount}, netTotal=${order.netTotal}`);

            let today = new Date(); 
            let dateRequest = new Date(order.date);
            if(dateRequest > today) {
              return this.getResultFalse(422, 'Não permitido uma data futura');
            }
        
            // TODO Bug
            if(dateRequest.getMonth()-today.getMonth() <= -2) {
              return this.getResultFalse(422, 'Não é permitido lançamento de mais de 1 Mês anterior');
            }     
        
            let m = new Date();
            let ini = new Date();
            ini.setFullYear(m.getFullYear(), m.getMonth(), 1);
            let end = new Date();
            end.setFullYear(m.getFullYear(), m.getMonth()+1, 0);
        
            let monthStart = String(ini.getMonth()+1).padStart(2, "0");
            let dayStart = String(ini.getDate()).padStart(2, "0");
            let monthEnd = String(end.getMonth()+1).padStart(2, "0");
            let dayEnd = String(end.getDate()).padStart(2, "0");
            let period = {
              firstDay: ini.getFullYear() + '-' + monthStart + '-' +dayStart,
              lastDay: end.getFullYear() + '-' + monthEnd + '-' +dayEnd
            }      
        
            const aggregateMonth = await Order.aggregate([
              { 
                $match: 
                  {
                    date: {
                      $gte: period.firstDay,
                      $lte: period.lastDay
                    },
                    company: company._id
                  }
              },
              { 
                $group: {
                  _id: null,
                  totalValue: { $sum: "$total" },
                  count: { $sum: 1 }
                } 
              } 
            ])    
        
            console.log('total: === ', aggregateMonth)
        
            if(company.plan.name !== 'Free') {
              if(companyService.isNotExpiredPlan(company, 2) === false) {
                if(company.downgradePlanFree === true) {
                  company.planOld = company.plan;
                  company.plan = companyService.getPlanFree();
                  company.downgradePlanFree = false;
                  await Company.updateOne({_id: company._id}, company);
                } else {
                  // flag addMoreOneDay = true
                  const msg = 'Seu Plano está vencido, renove seu plano agora mesmo ou entre em contato conosco!';
                  console.log('Plan Expired', msg); 
                  return this.getResultFalse(412, msg, company.plan.name);
                }
              } 
              // else if(company.plan.payment.status !== 'PERFORMED') {
              //     const msg = 'Bloqueado por falta de pagamento.';
              //     console.log('Blocked', msg); 
              //     return this.getResultFalse(412, msg, company.plan.name);
              // }
            }
        
            let total = aggregateMonth.length > 0 ? aggregateMonth[0].totalValue : 0;
        
            let resultPlan = planService.validatePlanNewOrderService(company, total); 
            if(resultPlan.isValid === false) { 
              return this.getResultFalse(412, resultPlan.message, resultPlan.plan) ;
            }
        
            let userBalance = await UserBalance.findOne({ 'user._id': order.user._id });
            console.log('userBalance '+ order.user._id, userBalance); 
            
            if(order._id) {  
        
              const orderFind = await Order.findOne({_id: order._id });
              // Update
              let orderUpdated = await Order.updateOne({_id: order._id }, order);
         
              const balanceUpdate = userBalance.balance + order.commission - orderFind.commission;
              await UserBalance.updateOne( 
                { 'user._id': order.user._id }, 
                { balance: balanceUpdate }
              );  

              order.updatedByUserId = userId;
         
              await UserBalanceDetail.updateOne( 
                { 
                  orderId: order._id
                },   
                {
                  userId: order.user._id,
                  value: order.commission,
                  date: order.date,
                  description: order.customer.name 
                }
              )
        
              console.log('Order updated success!!!');
              return {
                isValid: true,
                status: 200,
                message: 'Order updated success!!!',
                plan: company.plan.name,
                order: orderUpdated
              }                          
            } else {
              // Novo
              delete order._id;
              order.createdByUserId = userId;
              const orderSaved = await new Order(order).save();
        
              let balanceAdd = userBalance.balance + order.commission;
              console.log('balanceAdd', balanceAdd);
              await UserBalance.updateOne(  
                { 'user._id': orderSaved.user._id }, 
                { balance: balanceAdd } 
              );
         
              const userBalanceDetail = {
                userId: orderSaved.user._id, 
                value: orderSaved.commission,
                date: orderSaved.date,
                type: 'SERVICE_PERFORMED',
                orderId: orderSaved._id,
                description: order.customer.name
              }
              await new UserBalanceDetail(userBalanceDetail).save(); 
        
              console.log('Order saved success!!!');
              return {
                isValid: true,
                status: 201,
                message: 'Order saved success!!!',
                plan: company.plan.name,
                order: orderSaved
              }                   
            }
          } catch (error) {
            console.error('OrderService :: save', error);
            return {
              isValid: false,
              status: 500,
              message: error,
              plan: null,
              order: null
            }                  
          }        
        }                        
    }
}
