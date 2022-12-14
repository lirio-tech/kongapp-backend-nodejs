const NotificationModel = require("./model/NotificationModel");

module.exports.notificationSaveSignatureExpiration = () => {
    return {
        async save(companyId, companyPlanName, companyPlanDateEnd) {
            let diffDays = Math.ceil( (companyPlanDateEnd.getTime() - new Date().getTime()) / (1000 * 3600 * 24) );
            let description = 'Sua assinatura Venceu, clique aqui e renove agora mesmo';
            let title = 'Assinatura Vencendo';
            if(diffDays > 1) {
                description = `Faltam ${diffDays} dias para a sua assinatura expirar, renove agora mesmo e continue com essa experiência incrível 😎 `
                title = 'Assinatura Vencendo';
            } 
            else if (diffDays === 1) {
                description = `Sua assinatura irá expirar amanhã, não se esqueça de renovar ;)`
                title = 'Assinatura Vencendo';
            }
            else if (diffDays === 0) {
                description = `Sua assinatura vence Hoje, não deixe de renovar para continuar utilizando o Aplicativo :)`
                title = 'Assinatura Vencendo';
            }            
            else if (diffDays === -1) {
                description = `Sua assinatura venceu ontem, mantenha o funcionamento no App e renove o plano clicando aqui :/`
                title = 'Assinatura Vencida';
            }            
            else if (diffDays < -1) {
                description = `Sua assinatura venceu há ${diffDays*-1} dais, em breve seu acesso ao aplicativo será reduzido :(`
                title = 'Assinatura Vencida';
            }         
            
            let _path = `/admin/payment/${companyPlanName}`;
            if(companyPlanName === 'Smart') {
                _path = '/public/simulator-plan'
            }

            let _mdiColor = 'yellow';
            if(diffDays === 0) {
                _mdiColor = 'orange'  
            } else if(diffDays < 0) {
                _mdiColor = 'red'  
            }

            const notification = {
                title: title,
                //description: `Sua assinatura está expirando, renove agora mesmo e continue com está expiriência incrivel com o Kongapp :)`,
                description: description,
                isNotRead: true,     
                type: 'SIGNATURE_EXPIRATION', 
                view: 'LIST', 
                mdi: "mdi-rocket-outline",
                mdiColor: _mdiColor,
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