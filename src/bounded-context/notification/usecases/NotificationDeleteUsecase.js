const NotificationModel = require("./model/NotificationModel");

module.exports.notificationDeleteUsecase = () => {
    return {             
        async delete(objectId) {
            console.log(`class=NotificationDeleteUsecase, m=delete, _id=${objectId}`)
            return await NotificationModel.deleteOne({'_id': objectId })
        },
    } 
}