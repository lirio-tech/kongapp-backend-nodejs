const NotificationModel = require("./model/NotificationModel");

module.exports.notificationSaveSignatureExpiration = () => {
    return {
        async save(companyId, companyPlanName, companyPlanDateEnd) {
            let diffDays = Math.ceil( (companyPlanDateEnd.getTime() - new Date().getTime()) / (1000 * 3600 * 24) );
            console.log(diffDays);
            let description = 'Sua assinatura Venceu, clique aqui e renove agora mesmo';
            if(diffDays > 1) {
                description = `Faltam ${diffDays} dias para a sua assinatura expirar, renove agora mesmo e continue com essa experiência incrível 😎 `
            } 
            else if (diffDays === 1) {
                description = `Sua assinatura irá expirar amanhã, não se esqueça de renovar ;)`
            }
            else if (diffDays === 0) {
                description = `Sua assinatura vence Hoje, não deixe de renovar para continuar utilizando o Aplicativo :)`
            }            
            else if (diffDays === -1) {
                description = `Sua assinatura venceu ontem, mantenha o funcionamento no App e renove o plano clicando aqui :/`
            }            
            else if (diffDays < -1) {
                description = `Sua assinatura venceu há ${diffDays*-1} dais, em breve seu acesso ao aplicativo será reduzido :(`
            }         
            
            let _path = `/admin/payment/${companyPlanName}`;
            if(companyPlanName === 'Smart') {
                _path = '/public/simulator-plan'
            }

            const notification = {
                title: "Assinatura",
                //description: `Sua assinatura está expirando, renove agora mesmo e continue com está expiriência incrivel com o Kongapp :)`,
                description: description,
                isNotRead: true,     
                type: 'SIGNATURE_EXPIRATION', 
                view: 'LIST', 
                mdi: "mdi-calendar",
                mdiColor: 'red',
                emojiIcon: "",
                path: _path,
                hyperLink: "",
                company: companyId,
                onlyAdmin: true
            }
            await NotificationModel(notification).save();            
       }
    }
}