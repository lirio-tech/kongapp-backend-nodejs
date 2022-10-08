const { ObjectId } = require('mongodb');
const dateUtils = require('../../utils/dateUtils').dateUtils();
const NotificationModel = require('./NotificationModel');

module.exports.notificationService = () => {
    return {             
        async get(req) {
            console.log(`class=NotificationService, m=get, userId=${req.headers['company']}`)
            return await NotificationModel.find({'company': ObjectId(req.headers['company']) })
        },
        async getA() {
            console.log(`class=NotificationService, m=get`)
            //const user = await User.findOne({ _id: ObjectId(req.userId) })
            return await NotificationModel.find({})
        },      
        async saveSchedule(schedule) {
            const notification = {
                title: "Novo Agendamento",
                description: `${schedule.customer.name} realizou um novo Agendamento, clica aqui para realizar a confirmação.`,
                isNotRead: true,     
                type: 'NEW_SCHEDULE', 
                mdi: "mdi-clock",
                emojiIcon: "",
                path: `/admin/agendamentos/?_id=${schedule._id}&date=${ dateUtils.dateToStringEnUS(schedule.createdAt)}`,
                hyperLink: "",
                company: schedule.companyId,
                onlyAdmin: true
            }
            await NotificationModel(notification).save();
        } 
    } 
}