
const dateUtils = require('../utils/dateUtils').dateUtils()
const planFreeService = require('../services/PlanFreeService').planFreeService()
const planBasicoService = require('../services/PlanBasicoService').planBasicoService()
const planGoldService = require('../services/PlanGoldService').planGoldService()
const planEhNoisService = require('../services/PlanEhNoisService').planEhNoisService()
const planoTamoJuntoService = require('../services/PlanTamoJuntoService').planoTamoJuntoService()
const planoInfinityService = require('../services/PlanInfinityService').planoInfinityService()
const planoCustomService = require('../services/PlanCustomService').planCustomService()

const planSimplesService = require('../services/PlanSimplesService').planSimplesService()
const planTopService = require('../services/PlanTopService').planTopService()
const planSmartService = require('../services/PlanSmartService').planSmartService()

const PLAN_FREE = 'Free';
const PLAN_PREMIUM_BASICO = 'Basico';
const PLAN_PREMIUM_GOLD = 'Gold';
const PLAN_PREMIUM_EH_NOIS = 'É Nóis';
const PLAN_PREMIUM_TAMO_JUNTO = 'Tamo Junto';
const PLAN_PREMIUM_INFINITY = 'Infinity';
const PLAN_PREMIUM_CUSTOM = 'Custom';

const PLAN_PREMIUM_SIMPLES = 'Simples';
const PLAN_PREMIUM_TOP = 'Top';
const PLAN_PREMIUM_SMART = 'Smart';

const allPlans = [
  PLAN_FREE,
  PLAN_PREMIUM_BASICO, 
  PLAN_PREMIUM_GOLD, 
  PLAN_PREMIUM_EH_NOIS,
  PLAN_PREMIUM_TAMO_JUNTO,
  PLAN_PREMIUM_INFINITY,
  PLAN_PREMIUM_CUSTOM,
  PLAN_PREMIUM_SIMPLES,
  PLAN_PREMIUM_TOP,
  PLAN_PREMIUM_SMART  
];
const planPremiums = [
  PLAN_PREMIUM_BASICO, 
  PLAN_PREMIUM_GOLD, 
  PLAN_PREMIUM_EH_NOIS,
  PLAN_PREMIUM_TAMO_JUNTO,
  PLAN_PREMIUM_INFINITY,
  PLAN_PREMIUM_CUSTOM,
  PLAN_PREMIUM_SIMPLES,
  PLAN_PREMIUM_TOP,
  PLAN_PREMIUM_SMART

];

module.exports.planService = () => {
    return {
        planPremiums() {
          return planPremiums;
        },
        allPlans() {
          return allPlans;
        },
        validatePlanNewOrderService: function(company, valueTotalMonth) {
            console.log('validatePlanNewOrderService :: '+valueTotalMonth, company)
            // TODO veirificacao sendo feito na facade e nos services
            if(company.plan.name === PLAN_FREE) {
                return planFreeService.validatePlanNewOrderService(company, valueTotalMonth);
            }
            if(company.plan.name === PLAN_PREMIUM_BASICO) {
                return planBasicoService.validatePlanNewOrderService(company, valueTotalMonth);
            }
            if(company.plan.name === PLAN_PREMIUM_GOLD) {
                return planGoldService.validatePlanNewOrderService(company, valueTotalMonth);
            }         
            if(company.plan.name === PLAN_PREMIUM_EH_NOIS) {
                return planEhNoisService.validatePlanNewOrderService(company, valueTotalMonth);
            }                
            if(company.plan.name === PLAN_PREMIUM_TAMO_JUNTO) {
                return planoTamoJuntoService.validatePlanNewOrderService(company, valueTotalMonth);
            }          
            if(company.plan.name === PLAN_PREMIUM_INFINITY) {
                return planoInfinityService.validatePlanNewOrderService(company, valueTotalMonth)
            }      
            if(company.plan.name === PLAN_PREMIUM_CUSTOM) {
              return planoCustomService.validatePlanNewOrderService(company, valueTotalMonth)
            }
            // ...
            if(company.plan.name === PLAN_PREMIUM_SIMPLES) {
                return planSimplesService.validatePlanNewOrderService(company, valueTotalMonth)
            }     
            if(company.plan.name === PLAN_PREMIUM_TOP) {
                return planTopService.validatePlanNewOrderService(company, valueTotalMonth)
            }             
            if(company.plan.name === PLAN_PREMIUM_SMART) {
                return planSmartService.validatePlanNewOrderService(company, valueTotalMonth)
            }                  
            return this.ok()
        }, 
        validatePlanSaveNewUserService: function(company, totalUsers) {
            if(company.plan.name === PLAN_FREE) {
                return planFreeService.validatePlanSaveNewUserService(company, totalUsers)
            }            
            if(company.plan.name === PLAN_PREMIUM_BASICO) {
                return planBasicoService.validatePlanSaveNewUserService(company, totalUsers)
            }            
            if(company.plan.name === PLAN_PREMIUM_GOLD) {
                return planGoldService.validatePlanSaveNewUserService(company, totalUsers)
            }      
            if(company.plan.name === PLAN_PREMIUM_EH_NOIS) {
                return planEhNoisService.validatePlanSaveNewUserService(company, totalUsers)
            }                         
            if(company.plan.name === PLAN_PREMIUM_TAMO_JUNTO) {
                return planoTamoJuntoService.validatePlanSaveNewUserService(company, totalUsers)
            }            
            if(company.plan.name === PLAN_PREMIUM_INFINITY) {
                return planoInfinityService.validatePlanSaveNewUserService(company, totalUsers)
            }          
            if(company.plan.name === PLAN_PREMIUM_CUSTOM) {
              return planoCustomService.validatePlanSaveNewUserService(company, totalUsers)
            }             
            // ...
            if(company.plan.name === PLAN_PREMIUM_SIMPLES) {
                return planSimplesService.validatePlanSaveNewUserService(company, totalUsers)
            }     
            if(company.plan.name === PLAN_PREMIUM_TOP) {
                return planTopService.validatePlanSaveNewUserService(company, totalUsers)
            }             
            if(company.plan.name === PLAN_PREMIUM_SMART) {
                return planSmartService.validatePlanSaveNewUserService(company, totalUsers)
            }                                               
            return this.ok()
        },
        validatePlanUpdateUserService: function(company, allUsers) {
            console.log('validatePlanUpdateUserService :: ', allUsers, company)
            if(company.plan.name === PLAN_FREE) {
                return planFreeService.validatePlanUpdateUserService(company, allUsers);
            }
            if(company.plan.name === PLAN_PREMIUM_BASICO) {
                return planBasicoService.validatePlanUpdateUserService(company, allUsers);
            }        
            if(company.plan.name === PLAN_PREMIUM_GOLD) {
                return planGoldService.validatePlanUpdateUserService(company, allUsers);
            }          
            if(company.plan.name === PLAN_PREMIUM_EH_NOIS) {
                return planEhNoisService.validatePlanUpdateUserService(company, allUsers)
            }  
            if(company.plan.name === PLAN_PREMIUM_TAMO_JUNTO) {
                return planoTamoJuntoService.validatePlanUpdateUserService(company, allUsers)
            }           
            if(company.plan.name === PLAN_PREMIUM_INFINITY) {
                return planoInfinityService.validatePlanUpdateUserService(company, allUsers)
            }          
            if(company.plan.name === PLAN_PREMIUM_CUSTOM) {
              return planoCustomService.validatePlanUpdateUserService(company, allUsers)
            }      
            // ...
            if(company.plan.name === PLAN_PREMIUM_SIMPLES) {
                return planSimplesService.validatePlanUpdateUserService(company, allUsers)
            }     
            if(company.plan.name === PLAN_PREMIUM_TOP) {
                return planTopService.validatePlanUpdateUserService(company, allUsers)
            }             
            if(company.plan.name === PLAN_PREMIUM_SMART) {
                return planSmartService.validatePlanUpdateUserService(company, allUsers)
            }                                                                           
            return this.ok()
        },
        getUpgrade(company, plan) {
            console.log('plan', plan) 

            let dateEnd = plan.dateEnd ? plan.dateEnd : null; 
            let dateStarted = plan.dateStarted ? plan.dateStarted : new Date(); 
            let amountUsers = plan.amountUsers ? plan.amountUsers : null;
            let amountUsersAdmin = plan.amountUsersAdmin ? plan.amountUsersAdmin : null;
            let amountUsersCommon = plan.amountUsersCommon ? plan.amountUsersCommon : null;
            let maxCash = plan.maxCash ? plan.maxCash : null;
            let paymentPrice = plan.payment && plan.payment.price ? plan.payment.price : null;

            if(plan.name === PLAN_PREMIUM_BASICO) {
              dateEnd = dateEnd ? dateEnd : planBasicoService.getDateEnd(dateStarted);
              amountUsers = planBasicoService.PlanoBasico.USERS_ENABLED; 
              amountUsersAdmin = planBasicoService.PlanoBasico.ADMIN_ENABLED; 
              amountUsersCommon = planBasicoService.PlanoBasico.COMMON_ENABLED;
              maxCash = planBasicoService.PlanoBasico.MAX_CASH;
              paymentPrice = paymentPrice ? paymentPrice : planBasicoService.PlanoBasico.PAYMENT_PRICE;
            }
            if(plan.name === 'Gold') {
              dateEnd = dateEnd ? dateEnd : planGoldService.getDateEnd(dateStarted);
              amountUsers = planGoldService.PlanoGold.USERS_ENABLED; 
              amountUsersAdmin = planGoldService.PlanoGold.ADMIN_ENABLED; 
              amountUsersCommon = planGoldService.PlanoGold.COMMON_ENABLED;         
              maxCash = planGoldService.PlanoGold.MAX_CASH;     
              paymentPrice = paymentPrice ? paymentPrice : planGoldService.PlanoGold.PAYMENT_PRICE;
            }
            if(plan.name === 'É Nóis') {
              dateEnd = dateEnd ? dateEnd : planEhNoisService.getDateEnd(dateStarted);
              amountUsers = planEhNoisService.PlanoEhNois.USERS_ENABLED; 
              amountUsersAdmin = planEhNoisService.PlanoEhNois.ADMIN_ENABLED; 
              amountUsersCommon = planEhNoisService.PlanoEhNois.COMMON_ENABLED;                     
              maxCash = planEhNoisService.PlanoEhNois.MAX_CASH;
              paymentPrice = paymentPrice ? paymentPrice : planEhNoisService.PlanoEhNois.PAYMENT_PRICE;
            }    
            if(plan.name === 'Tamo Junto') {
              dateEnd = dateEnd ? dateEnd : planoTamoJuntoService.getDateEnd(dateStarted);
              amountUsers = planoTamoJuntoService.PlanoTamoJunto.USERS_ENABLED; 
              amountUsersAdmin = planoTamoJuntoService.PlanoTamoJunto.ADMIN_ENABLED; 
              amountUsersCommon = planoTamoJuntoService.PlanoTamoJunto.COMMON_ENABLED;          
              maxCash = planoTamoJuntoService.PlanoTamoJunto.MAX_CASH;
              paymentPrice = paymentPrice ? paymentPrice : planoTamoJuntoService.PlanoTamoJunto.PAYMENT_PRICE;
            }        
            if(plan.name === 'Infinity') {
              dateEnd = dateEnd ? dateEnd : planoInfinityService.getDateEnd();
              amountUsers = planoInfinityService.PlanoInfinity.USERS_ENABLED; 
              amountUsersAdmin = planoInfinityService.PlanoInfinity.ADMIN_ENABLED; 
              amountUsersCommon = planoInfinityService.PlanoInfinity.COMMON_ENABLED;   
              maxCash = planoInfinityService.PlanoInfinity.MAX_CASH;
              paymentPrice = paymentPrice ? paymentPrice : planoInfinityService.PlanoInfinity.PAYMENT_PRICE;
            }                   
            let planResult = {
                name: plan.name,
                amountUsers: amountUsers,
                amountUsersAdmin: amountUsersAdmin,
                amountUsersCommon: amountUsersCommon,  
                dateStarted: dateUtils.yyyyMMdd(dateStarted),
                dateEnd: dateUtils.yyyyMMdd(dateEnd), 
                maxCash: maxCash,
                payment: { price: paymentPrice, status: 'PERFORMED' }
              } 
            return planResult; 
        },  
        getUpgradeV2(plan) {
            console.log('plan', plan) 

            let dateEnd = plan.dateEnd ? plan.dateEnd : null; 
            let dateStarted = plan.dateStart ? plan.dateStart : new Date(); 
            let amountUsers = plan.amountUsers ? plan.amountUsers : null;
            let amountUsersAdmin = plan.amountUsersAdmin ? plan.amountUsersAdmin : null;
            let amountUsersCommon = plan.amountUsersCommon ? plan.amountUsersCommon : null;
            let maxCash = plan.maxCash ? plan.maxCash : null;
            let paymentPrice = plan.price || plan.price == 0 ? plan.price : null;

            if(plan.name === PLAN_PREMIUM_SIMPLES) {
              dateEnd = dateEnd ? dateEnd : planSimplesService.getDateEnd(dateStarted);
              amountUsers = planSimplesService.PlanoSimples.USERS_ENABLED; 
              amountUsersAdmin = planSimplesService.PlanoSimples.ADMIN_ENABLED; 
              amountUsersCommon = planSimplesService.PlanoSimples.COMMON_ENABLED;
              maxCash = planSimplesService.PlanoSimples.MAX_CASH;
              paymentPrice = paymentPrice || paymentPrice == 0 ? paymentPrice : planSimplesService.PlanoSimples.PAYMENT_PRICE;
            }
            if(plan.name === PLAN_PREMIUM_TOP) {
              dateEnd = dateEnd ? dateEnd : planTopService.getDateEnd(dateStarted);
              amountUsers = planTopService.PlanoTop.USERS_ENABLED; 
              amountUsersAdmin = planTopService.PlanoTop.ADMIN_ENABLED; 
              amountUsersCommon = planTopService.PlanoTop.COMMON_ENABLED;         
              maxCash = planTopService.PlanoTop.MAX_CASH;     
              paymentPrice = paymentPrice || paymentPrice == 0 ? paymentPrice : planTopService.PlanoTop.PAYMENT_PRICE;
            }                
            let planResult = {
                name: plan.name,
                amountUsers: amountUsers,
                amountUsersAdmin: amountUsersAdmin,
                amountUsersCommon: amountUsersCommon,  
                dateStarted: dateUtils.yyyyMMdd(dateStarted),
                dateEnd: dateUtils.yyyyMMdd(dateEnd), 
                maxCash: maxCash,
                payment: { price: paymentPrice, status: 'PERFORMED' }
              } 
            return planResult; 
        },          
        getMsgJson(msg, plan, valid) { 
            return {
                message: msg,
                isValid: valid,
                plan: plan
            } 
        },
        ok() {
            return this.getMsgJson('OK', "Its OK", true)
        },        
    } 
}