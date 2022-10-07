const CONST_MAX_CASH = 10000;
const CONST_USERS_ENABLED = 6;
const CONST_AMOUNT_MONTH = 1;

module.exports.planEhNoisService = () => {
    return {
        PlanoEhNois: {
            LABEL: 'É Nóis',
            PAYMENT_PRICE: 24.90,
            MAX_CASH: CONST_MAX_CASH,
            MAX_CASH_MSG: `Valor Total no Mes Excedeu o valor de R$${CONST_MAX_CASH} permitido do Plano Premium É Nóis`,
            USERS_ENABLED: CONST_USERS_ENABLED,
            ADMIN_ENABLED: 2, 
            COMMON_ENABLED: 4,
            USERS_ENABLED_MSG: `Voce pode possuir somente ${CONST_USERS_ENABLED} Usuarios Ativos no Plano Premium É Nóis, para cadastrar mais usuarios confira nossos outros Planos`
        },
        validatePlanNewOrderService: function(company, valueTotalMonth) {
            if(company.plan.name === this.PlanoEhNois.LABEL) { 
                if(valueTotalMonth > this.PlanoEhNois.MAX_CASH) {
                    return this.getMsgJson(
                        this.PlanoEhNois.MAX_CASH_MSG, 
                        this.PlanoEhNois.LABEL,
                        false
                    )
                }
            }
            return this.ok()
        }, 
        validatePlanSaveNewUserService: function(company, totalUsers) {         
            if(company.plan.name === this.PlanoEhNois.LABEL) {
                if(totalUsers >= this.PlanoEhNois.USERS_ENABLED) {
                    return this.getMsgJson(
                        this.PlanoEhNois.USERS_ENABLED_MSG,
                        this.PlanoEhNois.LABEL,
                        false
                    )
                }
            }                                              
            return this.ok()
        },
        validatePlanUpdateUserService: function(company, allUsers) {
            console.log('validatePlanUpdateUserService :: ', allUsers, company)
            if(company.plan.name === this.PlanoEhNois.LABEL) {
                let usersEnabledArray = allUsers.filter(user => user.disabled === false);
                console.log(usersEnabledArray);
                if(usersEnabledArray.length >= this.PlanoEhNois.USERS_ENABLED) {
                    return this.getMsgJson(
                        this.PlanoEhNois.USERS_ENABLED_MSG,
                        this.PlanoEhNois.LABEL,
                        false
                    )
                }
            }                                            
            return this.ok()
        },
        getDateEnd(dateStart) {
            return dateEnd = new Date(
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