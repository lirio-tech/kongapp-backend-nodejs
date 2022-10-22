const NotificationModel = require("./model/NotificationModel");
const dateUtils = require('../../../utils/dateUtils').dateUtils();

module.exports.notificationSaveNewScheduleUsecase = () => {
    return {
        async save(schedule) {
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
        }
    }
}