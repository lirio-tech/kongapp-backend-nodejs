const dateUtils = require('./utils/dateUtils').dateUtils();

module.exports.notifiers = () => {
    return {
        verifyIfhasNotificion(company) {

            if(!company.plan.dateEnd) {
                return []
            }

            const dueDate = new Date(company.plan.dateEnd)

            let tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate()+1)

            if(dueDate > tomorrow) {
                return []
            }

            if(
                dueDate.getFullYear() === tomorrow.getFullYear() &&
                dueDate.getMonth() === tomorrow.getMonth() &&
                dueDate.getDate() === tomorrow.getDate()
              ) {
                return [{
                  text: 'Seu plano vencerá amanhã, Renove agora mesmo e evite o bloqueio ;)',
                  textColor: 'black',
                  link: company.plan.name === 'Smart' ? '/public/simulator-plan' : `/admin/payment/${company.plan.name}`,
                  linkTitle: 'Renovar',
                  type: 'warning',
                  color: 'yellow',
                  closeable: true,
                }]
            }             
            let today = new Date()
            if(
                dueDate.getFullYear() === today.getFullYear() &&
                dueDate.getMonth() === today.getMonth() &&
                dueDate.getDate() === today.getDate()
              ) {
                return [{
                  text: 'Seu plano vence hoje, Renove agora mesmo :)',
                  textColor: 'white',
                  link: company.plan.name === 'Smart' ? '/public/simulator-plan' : `/admin/payment/${company.plan.name}`,
                  linkTitle: 'Renovar',
                  type: 'warning',
                  color: 'orange',
                  closeable: true,
                }]
            }             
            let yesterday = new Date()
            yesterday.setDate(yesterday.getDate()-1)

            if(
                dueDate.getFullYear() === yesterday.getFullYear() &&
                dueDate.getMonth() === yesterday.getMonth() &&
                dueDate.getDate() === yesterday.getDate()
              ) {
                return [{
                  text: 'Seu plano venceu ontem, Não se esqueça de renovar',
                  textColor: 'white',
                  link: company.plan.name === 'Smart' ? '/public/simulator-plan' : `/admin/payment/${company.plan.name}`,
                  linkTitle: 'Renovar',
                  type: 'warning',
                  color: 'red',
                  closeable: false,
                }]
            }                         
            return [{
                text: `Seu Plano está vencido há ${dateUtils.differenceOfTwoDates(dueDate, today)} dias, renove e continue utilizando o APP`,
                textColor: 'white',
                link: company.plan.name === 'Smart' ? '/public/simulator-plan' : `/admin/payment/${company.plan.name}`,
                linkTitle: 'Renovar',
                type: 'warning',
                color: 'red',
                closeable: false,
            }]
        },        
    }
}