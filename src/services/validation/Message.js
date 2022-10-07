
module.exports.messageLabels = () => {
    return {
        Order: {
            PREFIX: '100',
        },
        Payments: {
            PREFIX: '200',
        },
        
        Schedule: {
            PREFIX: '300',
            YOU_ALREADY_SCHEDULE_REQUESTED_CODE: '301',
            YOU_ALREADY_SCHEDULE_REQUESTED_MESSAGE: 'Você já possui um agendamento solicitado, aguarde entraremos em contato',

            THIS_TIME_ALREADY_IS_SCHEDULED_CODE: '302',
            THIS_TIME_ALREADY_IS_SCHEDULED_MESSAGE: 'Este horário já encontra-se agendado. Olhe no nosso calendário um horário disponivel.',
            
            DAY_IS_CLOSED: '303',
            SUNDAY_CLOSED: `Domingo estamos fechados, confira nossos dias e horas de funcionamento.`,
            MONDAY_CLOSED: `Segunda-Feira estamos fechados, confira nossos dias e horas de funcionamento.`,
            TUESDAY_CLOSED: `Terça-Feira estamos fechados, confira nossos dias e horas de funcionamento.`,
            WEDNESDAY_CLOSED: `Quarta-Feira estamos fechados, confira nossos dias e horas de funcionamento.`,
            THURSDAY_CLOSED: `Quinta-Feira estamos fechados, confira nossos dias e horas de funcionamento.`,
            FRIDAY_CLOSED: `Sexta-Feira estamos fechados, confira nossos dias e horas de funcionamento.`,
            SATURDAY_CLOSED: `Sábado estamos fechados, confira nossos dias e horas de funcionamento.`,

            HOUR_NOT_ALLOW_START: '304',
            hourNotAllowStart: function(dayOfWeek, timeStartAt, timeEndAt) {
                return `Horário não permitido para realizar agendamento, ${dayOfWeek} o horário de funcionamento é das ${timeStartAt} às ${timeEndAt}.`
            },        
            
            HOUR_NOT_ALLOW_END: '305',
            hourNotAllowEnd: function(dayOfWeek, timeStartAt, timeEndAt) {
                return `Horário não permitido, agendamento minimo é de 1 hora, ${dayOfWeek} o horário de funcionamento é das ${timeStartAt} às ${timeEndAt}.`
            },

            SCHEDULE_MAX_SITE_CODE: '306',
            SCHEDULE_MAX_SITE_MESSAGE: 'Seu agendamento deve ser ter no máximo 15 dias, mais que isso não é permitido.',

            SCHEDULE_MIN_SITE_CODE: '307',
            SCHEDULE_MIN_SITE_MESSAGE: `Você deve agendar com no minimo 2 horas de antecedência`

        },
        Employees: {
            PREFIX: '400',
        },
        Site: {
            PREFIX: '500',
        },        
        XP: {
            PREFIX: '600',
        },
    }
}
