const { ObjectId } = require('mongodb');
const dateUtils = require('../../utils/dateUtils').dateUtils();
const NotificationModel = require('./usecases/model/NotificationModel');

module.exports.notificationService = () => {
    return {             
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
                    isNotRead: false,
                    updatedAt: new Date()
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
                mdi: "mdi-calendar-clock",
                mdiColor: '',
                emojiIcon: "",
                path: `/admin/agendamentos/?_id=${schedule._id}&date=${ dateUtils.dateToStringEnUS(schedule.dateTimeStartAt)}`,
                hyperLink: "",
                company: schedule.companyId,
                onlyAdmin: true
            }
            await NotificationModel(notification).save();
        },      
        async saveSignaturePaid() {},
        async saveSignaturePaid() {},                
        async saveMounthlyCloseInformation() {},
        async saveRecommendForFriends() {}
    } 
}