const CONST_MAX_CASH = 3000;
const CONST_USERS_ENABLED = 2;
const CONST_AMOUNT_MONTH = 1;
const CONST_PAYMENT_PRICE = 9.90;

module.exports.planBasicoService = () => {
    return {
        PlanoBasico: {
            LABEL: 'Basico',
            PAYMENT_PRICE: CONST_PAYMENT_PRICE,
            MAX_CASH: CONST_MAX_CASH,
            MAX_CASH_MSG: `Valor Total no Mês Excedeu o valor de R$${CONST_MAX_CASH} permitido para o Plano Free`,
            USERS_ENABLED: CONST_USERS_ENABLED,
            ADMIN_ENABLED: 1, 
            COMMON_ENABLED: 1,
            USERS_ENABLED_MSG: `Você pode possuir somente ${CONST_USERS_ENABLED} Usuários Ativos no Plano Premium Básico, para cadastrar mais usuários confira nossos outros Planos`
        },
        validatePlanNewOrderService: function(company, valueTotalMonth) {
            if(company.plan.name === this.PlanoBasico.LABEL) { 
                if(valueTotalMonth > this.PlanoBasico.MAX_CASH) {
                    return this.getMsgJson(
                        this.PlanoBasico.MAX_CASH_MSG, 
                        this.PlanoBasico.LABEL, 
                        false
                    )
                }
            }
            return this.ok()
        }, 
        validatePlanSaveNewUserService: function(company, totalUsers) {         
            if(company.plan.name === this.PlanoBasico.LABEL) {
                if(totalUsers >= this.PlanoBasico.USERS_ENABLED) {
                    return this.getMsgJson(
                        this.PlanoBasico.USERS_ENABLED_MSG,
                        this.PlanoBasico.LABEL,
                        false
                    )
                }
            }                                              
            return this.ok()
        },
        validatePlanUpdateUserService: function(company, allUsers) {
            console.log('validatePlanUpdateUserService :: ', allUsers, company)
            if(company.plan.name === this.PlanoBasico.LABEL) {
                let usersEnabledArray = allUsers.filter(user => user.disabled === false);
                console.log(usersEnabledArray);
                if(usersEnabledArray.length >= this.PlanoBasico.USERS_ENABLED) {
                    return this.getMsgJson(
                        this.PlanoBasico.USERS_ENABLED_MSG,
                        this.PlanoBasico.LABEL,
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