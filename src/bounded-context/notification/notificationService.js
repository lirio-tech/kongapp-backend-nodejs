const { ObjectId } = require('mongodb');
const dateUtils = require('../../utils/dateUtils').dateUtils();
const NotificationModel = require('./NotificationModel');

module.exports.notificationService = () => {
    return {             
        async get(req) {
            console.log(`class=NotificationService, m=get, companyId=${req.headers['company']}`)
            return await NotificationModel.find({'company': ObjectId(req.headers['company']) }).sort({ createdAt: -1 })    
        },
        async getA() {
            console.log(`class=NotificationService, m=get`)
            return await NotificationModel.find({})
        },      
        async updateReadNotification(notificationId, companyId) {
            await NotificationModel.updateOne(
                {
                    _id: ObjectId(notificationId),
                    company: ObjectId(companyId)
                },
                {
                    isNotRead: false
                }
            )
        },
        async saveNewSchedule(schedule) {
            const dtTimeBR = dateUtils.dateToStringPtBR(schedule.dateTimeStartAt);
            const scheduleDate = dtTimeBR.substring(0, 5);
            const scheduleTime = dtTimeBR.substring(11, 16);
            const notification = {
                title: "Novo Agendamento",
                description: `${schedule.customer.name} realizou um novo Agendamento para o dia ${scheduleDate} às ${scheduleTime}, clica aqui para realizar a confirmação.`,
                isNotRead: true,     
                type: 'NEW_SCHEDULE', 
                view: 'LIST', 
                mdi: "mdi-clock",
                emojiIcon: "",
                path: `/admin/agendamentos/?_id=${schedule._id}&date=${ dateUtils.dateToStringEnUS(schedule.createdAt)}`,
                hyperLink: "",
                company: schedule.companyId,
                onlyAdmin: true
            }
            await NotificationModel(notification).save();
        },      
        async saveSignatureExpiration() {},
        async saveSignaturePaid() {},
        async saveSignaturePaid() {},                
        async saveMounthlyCloseInformation() {},
        async saveRecommendForFriends() {}
    } 
}