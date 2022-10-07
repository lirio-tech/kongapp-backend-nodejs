const { ObjectId } = require('mongodb');
const NotificationModel = require('./NotificationModel');

module.exports.notificationService = () => {
    return {             
        async get(req) {
            console.log(`class=NotificationService, m=get, userId=${req.headers['company']}`)
            return await NotificationModel.find({'companies': ObjectId(req.headers['company']) })
        },
        async getA() {
            console.log(`class=NotificationService, m=get`)
            //const user = await User.findOne({ _id: ObjectId(req.userId) })
            return await NotificationModel.find({})
        },        
    } 
}