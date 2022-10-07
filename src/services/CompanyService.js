const dateUtils = require("../utils/dateUtils").dateUtils();

module.exports.companyService = () => {
    return {                
        isNotExpiredPlan(company, dayAdded) {
            if(company.plan.name === 'Free') {
                return true;
            }
            let _3DaysAfter = new Date(dateUtils.getNewDateAddDay(-dayAdded));
            return new Date(company.plan.dateStarted) <= new Date() && 
                new Date(company.plan.dateEnd) >= _3DaysAfter;
        },         
        getPlanFree() {  
            return { name: 'Free', payment: { price: 0 } };
        },
        getSignUpServices(companyType) {
            switch(companyType) {
                case 'BARBER' :
                    return [
                        { type: 'Corte de Cabelo', price: 20.00, time: '01:00'},
                        { type: 'Barba', price: 14.99, time: '01:00'},
                        { type: 'Sobrancelha',price: 0, time: '01:00'},
                        { type: 'Penteado',price: 0, time: '01:00'},
                        { type: 'Pigmentação',price: 0, time: '01:00'},
                        { type: 'Coloração',price: 0, time: '01:00'},
                        { type: 'Luzes',price: 0, time: '01:00'},
                        { type: 'Platinado',price: 0, time: '01:00'},
                        { type: 'Relaxamento',price: 0, time: '01:00'},
                        { type: 'Progressiva',price: 0, time: '01:00'},
                        { type: 'Gel',price: 0, time: '01:00'},
                        { type: 'Pomada',price: 0, time: '01:00'},
                        { type: 'Laquê', price: 0, time: '01:00'}
                    ];
                case 'LADY_SALON' :
                    return [
                        { type: 'Pé e Mão', price: 10.00, time: '01:00'},
                        { type: 'Plástica dos Pés', price: 10.00, time: '01:00'},
                        { type: 'Podologia',price: 10.00, time: '01:00'},
                        { type: 'Alongamento da Unha',price: 10.00, time: '01:00'},
                        { type: 'Bronze',price: 10.00, time: '01:00'},
                        { type: 'Cílios',price: 10.00, time: '01:00'},
                        { type: 'Cabelo',price: 10.00, time: '01:00'},
                        { type: 'Designer Sobrancelha e Henn',price: 10.00, time: '01:00'},
                        { type: 'Micropigmentação',price: 10.00, time: '01:00'},
                        { type: 'Limpeza de Pele',price: 10.00, time: '01:00'},
                        { type: 'Estética',price: 10.00, time: '01:00'}
                    ];
            }
        },
        getUserServices(companyType) {
            let services = this.getSignUpServices(companyType);
            for(let i in services) {
                services[i].percentCommission = 50;
            }
            return services;
        },
    } 
}