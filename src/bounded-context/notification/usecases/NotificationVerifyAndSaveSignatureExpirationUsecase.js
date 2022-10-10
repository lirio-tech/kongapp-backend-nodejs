const companyFindByPlanDateEnd = require('../../company/usecases/CompanyFindByPlanDateEndUsecase').companyFindByPlanDateEnd();
const notificationSaveSignatureExpiration = require('./NotificationSaveSignatureExpirationUsecase').notificationSaveSignatureExpiration();
const companyFindByIdUsecase = require('../../company/usecases/CompanyFindByIdUsecase').companyFindByIdUsecase();

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
                await notificationSaveSignatureExpiration.save(companies[i]);            
                console.log(`class=NotificationVerifyAndSaveSignatureExpirationUsecase, m=verifyAndSaveSignatureExpiration, s=creating, company=${companies[i]}`)
            }
            console.log(`class=NotificationVerifyAndSaveSignatureExpirationUsecase, m=verifyAndSaveSignatureExpiration, s=finished`) 
        },


    } 
}