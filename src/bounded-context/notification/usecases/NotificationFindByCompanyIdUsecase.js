const { ObjectId } = require('mongodb');
const NotificationModel = require("./model/NotificationModel");

module.exports.notificationFindByCompanyIdUsecase = () => {
    return {             
        async findByCompanyId(companyId) {
            console.log(`class=NotificationService, m=get, companyId=${companyId}`)
            return await NotificationModel.find({'companyId': ObjectId(companyId) }).sort({ createdAt: -1 })    
        },
    } 
}