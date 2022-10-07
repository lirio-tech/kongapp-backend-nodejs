const CONST_MAX_CASH = 10000;
const CONST_USERS_ENABLED = 6;
const CONST_AMOUNT_MONTH = 1;

module.exports.planTopService = () => {
    return {
        PlanoTop: {
            LABEL: 'Top',
            PAYMENT_PRICE: 24.90,
            MAX_CASH: CONST_MAX_CASH,
            MAX_CASH_MSG: `Valor Total no Mes Excedeu o valor de R$${CONST_MAX_CASH} permitido do Plano Premium Top`,
            USERS_ENABLED: CONST_USERS_ENABLED,
            ADMIN_ENABLED: 2, 
            COMMON_ENABLED: 4,
            USERS_ENABLED_MSG: `Voce pode possuir somente ${CONST_USERS_ENABLED} Usuarios Ativos no Plano Premium Top, para cadastrar mais usuarios confira nossos outros Planos`
        },
        validatePlanNewOrderService: function(company, valueTotalMonth) {
            if(company.plan.name === this.PlanoTop.LABEL) { 
                if(valueTotalMonth > this.PlanoTop.MAX_CASH) {
                    return this.getMsgJson(
                        this.PlanoTop.MAX_CASH_MSG, 
                        this.PlanoTop.LABEL,
                        false
                    )
                }
            }
            return this.ok()
        }, 
        validatePlanSaveNewUserService: function(company, totalUsers) {         
            if(company.plan.name === this.PlanoTop.LABEL) {
                if(totalUsers >= this.PlanoTop.USERS_ENABLED) {
                    return this.getMsgJson(
                        this.PlanoTop.USERS_ENABLED_MSG,
                        this.PlanoTop.LABEL,
                        false
                    )
                }
            }                                              
            return this.ok()
        },
        validatePlanUpdateUserService: function(company, allUsers) {
            console.log('validatePlanUpdateUserService :: ', allUsers, company)
            if(company.plan.name === this.PlanoTop.LABEL) {
                let usersEnabledArray = allUsers.filter(user => user.disabled === false);
                console.log(usersEnabledArray);
                if(usersEnabledArray.length >= this.PlanoTop.USERS_ENABLED) {
                    return this.getMsgJson(
                        this.PlanoTop.USERS_ENABLED_MSG,
                        this.PlanoTop.LABEL,
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