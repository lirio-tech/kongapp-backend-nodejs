module.exports.dateFormat = () => {
    return {
        // US
        yyyyMMdd(date) {
            return date.getFullYear() + "-" + 
                    ("0" + (date.getMonth() + 1)).slice(-2) + "-" + 
                    ("0" + (date.getDate())).slice(-2);
        },
        dateBRToStringEnUS(date) {
            const [day, month, year] = date.toLocaleString('pt-BR').substring(0,10).split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        },    
        // BR Formats            
        dateTimeToStringPtBR(date) {
            return date.toLocaleString('pt-BR')
        },
        dateToStringPtBR(date) {
            return date.toLocaleString('pt-BR').substring(0,10)
        },        
    } 
}