const notificationSaveSignatureExpiration = require('./NotificationSaveSignatureExpirationUsecase').notificationSaveSignatureExpiration();
const companyFindByIdUsecase = require('../../company/usecases/CompanyFindByIdUsecase').companyFindByIdUsecase();
const orderFindByCreatedAtBetweenUsecase = require('../../order/usecase/findbycreatedatbetween/OrderFindByCreatedAtBetweenUsecase').findByCreatedAtBetweenUsecase();

module.exports.notificationVerifyAndSaveSignatureExpiration = () => {
    return {             
        async verifyAndSaveSignatureExpiration() {
            console.log(`class=NotificationVerifyAndSaveSignatureExpirationUsecase, m=verifyAndSaveSignatureExpiration`)
            let today = new Date();
            let before30days = new Date();
            before30days.setDate(before30days.getDate() - 30);
            let orders = orderFindByCreatedAtBetweenUsecase.findByCreatedAtBetween(before30days, today);
            for(let o in orders) {

                let companyId = orders[o].company;
                const company = companyFindByIdUsecase.findById(companyId);
                
                let before3Days = new Date();
                before3Days.setDate(before3Days.getDate() - 3);
                if(company.plan.dateEnd && new Date(company.plan.dateEnd) <= before3Days) {
                    await notificationSaveSignatureExpiration.save(company);              
                } 
            }

        },


    } 
}