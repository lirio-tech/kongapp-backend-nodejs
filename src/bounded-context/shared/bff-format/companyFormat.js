const dateFormat = require('./dateFormat/dateFormat').dateFormat();

module.exports.companyFormat = () => {
    return {             
        format(company) {
            return {  
                id: company._id,
                name: company.name,
                shortName: company.shortName,
                path: company.path,
                plan: {
                    name: company.plan.name,
                    dateStarted: company.plan.dateStarted,
                    dateStartedBR: dateFormat.dateToStringPtBR(new Date(company.plan.dateStarted)),
                    dateEnd: company.plan.dateEnd,   
                    dateEndBR: dateFormat.dateToStringPtBR(new Date(company.plan.dateEnd)),
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