const NotificationModel = require("./model/NotificationModel");

module.exports.notificationSaveSignatureExpiration = () => {
    return {
        async save(companyId, companyPlanName) {
            const notification = {
                title: "Assinatura",
                description: `Sua assinatura está expirando, renove agora mesmo e continue com está expiriência incrivel com o Kongapp :)`,
                isNotRead: true,     
                type: 'SIGNATURE_EXPIRATION', 
                view: 'LIST', 
                mdi: "mdi-calendar",
                mdiColor: 'red',
                emojiIcon: "",
                path: `/admin/payment/${companyPlanName}`,
                hyperLink: "",
                company: companyId,
                onlyAdmin: true
            }
            await NotificationModel(notification).save();            
       }
    }
}