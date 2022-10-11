const NotificationModel = require("./model/NotificationModel");

module.exports.notificationSaveSignaturePaid = () => {
    return {
        async save(companyId) {
            const notification = {
                title: "Assinatura Renovada",
                description: `Sua assinatura foi renovada, continue utilizando o Kongapp, e compartilhe sua experiência conosco, assim poderemos melhorar cada vez mais :)`,
                isNotRead: true,     
                type: 'SIGNATURE_PAID', 
                view: 'LIST', 
                mdi: "mdi-money",
                emojiIcon: "",
                path: `/public/avalie-nos`,
                hyperLink: "",
                company: companyId,
                onlyAdmin: true
            }
            await NotificationModel(notification).save();            
       }
    }
}