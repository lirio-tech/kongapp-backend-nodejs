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

            // let diffDays = Math.ceil( (new Date().getTime() - c[0].plan.dateEnd.getTime()) / (1000 * 3600 * 24) );
            // console.log('diffDays',diffDays);
            // let description = 'Sua assinatura Venceu, clique aqui e renove agora mesmo';
            // if(diffDays > 1) {
            //     description = `Faltam ${diffDays} dias para a sua assinatura expirar, renove agora mesmo e continue com essa experiência incrível 😎 `
            // } 
            // else if (diffDays === 1) {
            //     description = `Sua assinatura irá expirar amanhã, não se esqueça de renovar ;)`
            // }
            // else if (diffDays === 0) {
            //     description = `Sua assinatura vence Hoje, não deixe de renovar para continuar utilizando o Aplicativo :)`
            // }            
            // else if (diffDays === -1) {
            //     description = `Sua assinatura venceu ontem, mantenha o funcionamento no App e renove o plano clicando aqui :/`
            // }            
            // else if (diffDays < -1) {
            //     description = `Sua assinatura venceu há ${diffDays*-1} dais, em breve seu acesso ao aplicativo será reduzido :(`
            // }         
            
            // return c;

        },

    } 
}