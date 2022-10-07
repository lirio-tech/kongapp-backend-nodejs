const CONST_MAX_CASH = 4000;
const CONST_USERS_ENABLED = 2;
const CONST_AMOUNT_MONTH = 12;

module.exports.planGoldService = () => {
    return {
        PlanoGold: {
            LABEL: 'Gold',
            PAYMENT_PRICE: 90,
            MAX_CASH: CONST_MAX_CASH,
            MAX_CASH_MSG: `Valor Total no Mes Excedeu o valor de R$${CONST_MAX_CASH} permitido do Plano Premium Gold`,
            USERS_ENABLED: CONST_USERS_ENABLED,
            ADMIN_ENABLED: 1, 
            COMMON_ENABLED: 1,
            USERS_ENABLED_MSG: `Voce pode possuir somente ${CONST_USERS_ENABLED} Usuarios Ativos no Plano Premium Gold, para cadastrar mais usuarios confira nossos outros Planos`
        },
        validatePlanNewOrderService: function(company, valueTotalMonth) {
            if(company.plan.name === this.PlanoGold.LABEL) { 
                if(valueTotalMonth > this.PlanoGold.MAX_CASH) {
                    return this.getMsgJson(
                        this.PlanoGold.MAX_CASH_MSG, 
                        this.PlanoGold.LABEL,
                        false
                    )
                }
            }
            return this.ok()
        }, 
        validatePlanSaveNewUserService: function(company, totalUsers) {         
            if(company.plan.name === this.PlanoGold.LABEL) {
                if(totalUsers >= this.PlanoGold.USERS_ENABLED) {
                    return this.getMsgJson(
                        this.PlanoGold.USERS_ENABLED_MSG,
                        this.PlanoGold.LABEL,
                        false
                    )
                }
            }                                              
            return this.ok()
        },
        validatePlanUpdateUserService: function(company, allUsers) {
            console.log('validatePlanUpdateUserService :: ', allUsers, company)
            if(company.plan.name === this.PlanoGold.LABEL) {
                let usersEnabledArray = allUsers.filter(user => user.disabled === false);
                console.log(usersEnabledArray);
                if(usersEnabledArray.length >= this.PlanoGold.USERS_ENABLED) {
                    return this.getMsgJson(
                        this.PlanoGold.USERS_ENABLED_MSG,
                        this.PlanoGold.LABEL,
                        false
                    )
                }
            }                                            
            return this.ok()
        },
        getDateEnd(dateStart) {
            return new Date(
                dateStart.getFullYear(),
                dateStart.getMonth()+CONST_AMOUNT_MONTH,
                dateStart.getDate()
            ); 
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