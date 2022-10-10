const NotificationModel = require("../NotificationModel");

module.exports.notificationSaveSignatureExpiration = () => {
    return {
        async save(company) {
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
                company: company._id,
                onlyAdmin: true
            }
            await NotificationModel(notification).save();            
       }
    }
}