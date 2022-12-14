const companyFindByPlanDateEnd = require('../../company/usecases/CompanyFindByPlanDateEndUsecase').companyFindByPlanDateEnd();
const notificationSaveSignatureExpiration = require('./NotificationSaveSignatureExpirationUsecase').notificationSaveSignatureExpiration();

module.exports.notificationVerifyAndSaveSignatureExpiration = () => {
    return {             
        async verifyAndSaveSignatureExpiration() {
            console.log(`class=NotificationVerifyAndSaveSignatureExpirationUsecase, m=verifyAndSaveSignatureExpiration, s=init`)

            let after3Days = new Date();
            after3Days.setDate(after3Days.getDate() + 3);            
            
            let before3days = new Date();
            before3days.setDate(before3days.getDate() - 3);       

            let companies = await companyFindByPlanDateEnd.find(before3days, after3Days);     
            console.log(`class=NotificationVerifyAndSaveSignatureExpirationUsecase, m=verifyAndSaveSignatureExpiration, s=processing, companies=${companies.length}`)

            for(let i in companies) {
                await notificationSaveSignatureExpiration.save(companies[i]._id, companies[i].plan.name, companies[i].plan.dateEnd);            
                console.log(`class=NotificationVerifyAndSaveSignatureExpirationUsecase, m=verifyAndSaveSignatureExpiration, s=created, companyId=${companies[i]._id}`)
            }
            console.log(`class=NotificationVerifyAndSaveSignatureExpirationUsecase, m=verifyAndSaveSignatureExpiration, s=finished`) 
        },
        async get() {
            let after3Days = new Date();
            after3Days.setDate(after3Days.getDate() + 3);            
            
            let before3days = new Date();
            before3days.setDate(before3days.getDate() - 3);       

            return await companyFindByPlanDateEnd.find(before3days, after3Days);     

        },

    } 
}