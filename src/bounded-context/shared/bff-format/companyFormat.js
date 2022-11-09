const dateUtils = require('../../../utils/dateUtils').dateUtils();

module.exports.companyFormat = () => {
    return {             
        async formart(company) {
            return {  
                name: company.name,
                shortName: company.shortName,
                path: company.path,
                plan: {
                    name: company.plan.name,
                    dateStarted: dateUtils.dateToStringPtBR(new Date(company.plan.dateEnd)),
                    dateStartedBR: company.plan.dateEnd,
                    dateStarted: company.plan.dateStarted,
                    dateEnd: company.plan.dateEnd,   
                    amountUsers: company.plan.amountUsers,
                    amountUsersAdmin: company.plan.amountUsersAdmin,
                    amountUsersCommon: company.plan.amountUsersCommon,
                    maxCash: company.plan.maxCash,
                    payment: company.plan.payment,
                },
                planOld: company.planOld,
                cpfCnpj: company.cpfCnpj,    
                email: company.email,
                services: company.services, 
                signupAmountUsers: company.signupAmountUsers,
                companyType: company.companyType,
                downgradePlanFree: company.downgradePlanFree,
                percentCommission: company.percentCommission,
                viewOnlyCommission: company.viewOnlyCommission,
                expireToken: company.expireToken,
                products: company.products,
                cardRate: company.cardRate,
                pixCopyPast: company.pixCopyPast
            }
        }
    } 
}