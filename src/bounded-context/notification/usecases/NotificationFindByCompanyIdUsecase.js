const { ObjectId } = require('mongodb');
const NotificationModel = require("./model/NotificationModel");

module.exports.notificationFindByCompanyIdUsecase = () => {
    return {             
        async findByCompanyId(objectCompanyId) {
            console.log(`class=NotificationService, m=get, companyId=${objectCompanyId}`)
            return await NotificationModel.find({'company': objectCompanyId }).sort({ createdAt: -1 })    
        },
    } 
}