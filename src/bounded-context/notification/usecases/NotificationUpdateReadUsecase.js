
module.exports.notificationUpdateReadUsecase = () => {
    return {
        async update(notificationId, companyId) {
            await NotificationModel.updateOne(
                {
                    _id: ObjectId(notificationId),
                    company: ObjectId(companyId)
                },
                {
                    isNotRead: false,
                    updatedAt: new Date()
                }
            )            
        }
    }
}