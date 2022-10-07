const CONST_MAX_CASH = 25000;
const CONST_USERS_ENABLED = 8;

module.exports.planoInfinityService = () => {
    return {
        PlanoInfinity: {
            LABEL: 'Infinity',
            PAYMENT_PRICE: 900,
            MAX_CASH: CONST_MAX_CASH,
            MAX_CASH_MSG: `Valor Total no Mes Excedeu o valor de R$${CONST_MAX_CASH} permitido do Plano Premium Infinity`,
            USERS_ENABLED: CONST_USERS_ENABLED,
            ADMIN_ENABLED: 3, 
            COMMON_ENABLED: 5,
            USERS_ENABLED_MSG: `Voce pode possuir somente ${CONST_USERS_ENABLED} Usuarios Ativos no Plano Premium Infinity, para cadastrar mais usuarios confira nossos outros Planos`
        },
        validatePlanNewOrderService: function(company, valueTotalMonth) {
            if(company.plan.name === this.PlanoInfinity.LABEL) { 
                if(valueTotalMonth > this.PlanoInfinity.MAX_CASH) {
                    return this.getMsgJson(
                        this.PlanoInfinity.MAX_CASH_MSG, 
                        this.PlanoInfinity.LABEL, 
                        false
                    )
                }
            }
            return this.ok()
        }, 
        validatePlanSaveNewUserService: function(company, totalUsers) {         
            if(company.plan.name === this.PlanoInfinity.LABEL) {
                if(totalUsers >= this.PlanoInfinity.USERS_ENABLED) {
                    return this.getMsgJson(
                        this.PlanoInfinity.USERS_ENABLED_MSG,
                        this.PlanoInfinity.LABEL,
                        false
                    )
                }
            }                                              
            return this.ok()
        },
        validatePlanUpdateUserService: function(company, allUsers) {
            if(company.plan.name === this.PlanoInfinity.LABEL) {
                let usersEnabledArray = allUsers.filter(user => user.disabled === false);
                console.log(usersEnabledArray);
                if(usersEnabledArray.length >= this.PlanoInfinity.USERS_ENABLED) {
                    return this.getMsgJson(
                        this.PlanoInfinity.USERS_ENABLED_MSG,
                        this.PlanoInfinity.LABEL,
                        false
                    )
                }
            }                                            
            return this.ok()
        },
        getDateEnd() {
            return dateEnd = new Date(2099, 5, 20)
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