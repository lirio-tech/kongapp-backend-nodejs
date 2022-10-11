const CONST_MAX_CASH = 1000;
const CONST_USERS_ENABLED = 1;

module.exports.planFreeService = () => {
    return {
        PlanoFree: {
            LABEL: 'Free',
            MAX_CASH: CONST_MAX_CASH,
            MAX_CASH_MSG: `Valor Total no Mes Excedeu o valor de R$${CONST_MAX_CASH} permitido do Plano Free`,
            USERS_ENABLED: CONST_USERS_ENABLED,
            ADMIN_ENABLED: 1, 
            COMMON_ENABLED: 0,
            USERS_ENABLED_MSG: `Você pode possuir somente ${CONST_USERS_ENABLED} único usuário no Plano Free, para cadastrar mais usuários garanta nosso Plano Premium`,
            USERS_ENABLED_UPDATE_MSG: `Você não pode habilitar o usuário porque seu Plano FREE permite somente ${CONST_USERS_ENABLED} usuário Ativo `
        },
        validatePlanNewOrderService: function(company, valueTotalMonth) {
            if(company.plan.name === this.PlanoFree.LABEL) { 
                if(valueTotalMonth > this.PlanoFree.MAX_CASH) {
                    return this.getMsgJson(
                        this.PlanoFree.MAX_CASH_MSG, 
                        this.PlanoFree.LABEL, 
                        false
                    )
                } 
            }
            return this.ok()
        }, 
        validatePlanSaveNewUserService: function(company, totalUsers) {         
            if(company.plan.name === this.PlanoFree.LABEL) {
                if(totalUsers >= this.PlanoFree.USERS_ENABLED) {
                    return this.getMsgJson(
                        this.PlanoFree.USERS_ENABLED_MSG,
                        this.PlanoFree.LABEL,
                        false
                    )
                }
            }                                              
            return this.ok()
        },
        validatePlanUpdateUserService: function(company, allUsers) {
            console.log('validatePlanUpdateUserService :: ', allUsers, company)
            if(company.plan.name === this.PlanoFree.LABEL) {
                let usersEnabledArray = allUsers.filter(user => user.disabled === false);
                console.log(usersEnabledArray);
                if(usersEnabledArray.length >= this.PlanoFree.USERS_ENABLED) {
                    return this.getMsgJson(
                        this.PlanoFree.USERS_ENABLED_MSG,
                        this.PlanoFree.LABEL,
                        false
                    ) 
                }
            }                                            
            return this.ok()
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