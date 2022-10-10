const NotificationModel = require("./model/NotificationModel");

module.exports.notificationSaveSignatureExpiration = () => {
    return {
        async save(companyId) {
            const notification = {
                title: "Assinatura",
                description: `Sua assinatura está expirando, renove agora mesmo e continue com está expiriência incrivel com o Kongapp :)`,
                isNotRead: true,     
                type: 'SIGNATURE_EXPIRATION', 
                view: 'LIST', 
                mdi: "mdi-calendar",
                emojiIcon: "",
                path: `/admin/agendamentos`,
                hyperLink: "",
                company: companyId,
                onlyAdmin: true
            }
            await NotificationModel(notification).save();            
       }
    }
}