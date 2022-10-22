const NotificationModel = require("./model/NotificationModel");

module.exports.notificationUpdateReadUsecase = () => {
    return {
        async update(objectNotificationId, objectCompanyId) {
            await NotificationModel.updateOne(
                {
                    _id: objectNotificationId,
                    company: objectCompanyId
                },
                {
                    isNotRead: false,
                    updatedAt: new Date()
                }
            )               
        }
    }
}