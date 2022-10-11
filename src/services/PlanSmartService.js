
module.exports.planSmartService = () => {
    return {
        PlanoSmart: {
            LABEL: 'Smart',
        },
        validatePlanNewOrderService: function(company, valueTotalMonth) {
            if(valueTotalMonth > company.plan.maxCash) {
                return this.getMsgJson(
                    `Valor Total no Mes Excedeu o valor de R$${company.plan.maxCash}, entre em contato conosco caso queira aumentar o valor Maximo Permitido`, 
                    this.PlanoSmart.LABEL,
                    false
                )
            }
            return this.ok()
        }, 
        validatePlanSaveNewUserService: function(company, totalUsers) {         
            if(company.plan.name === this.PlanoSmart.LABEL) {
                if(totalUsers >= company.plan.amountUsers) {
                    return this.getMsgJson(
                        `Você pode possuir somente ${company.plan.amountUsers} usuários ativos, entre em contato conosco caso queira cadastrar novos usuários`,
                        this.PlanoSmart.LABEL,
                        false
                    )
                }
                return this.ok()
            } 
            return this.getMsgJson(`Plano Nao eh o Smart`, this.PlanoSmart.LABEL,false)                        
        },
        validatePlanUpdateUserService: function(company, allUsers) {
            if(company.plan.name === this.PlanoSmart.LABEL) {
                let usersEnabledArray = allUsers.filter(user => user.disabled === false);
                console.log(usersEnabledArray);
                if(usersEnabledArray.length >= company.plan.amountUsers) {
                    return this.getMsgJson( 
                        `Você pode possuir somente ${company.plan.amountUsers} usuários ativos, entre em contato conosco caso queira aumentar os usuários ativos`,
                        this.PlanoSmart.LABEL,
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