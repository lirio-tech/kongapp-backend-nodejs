const Order = require('../../../../models/Order');

module.exports.findByCreatedAtBetweenUsecase = () => {
    return {                
        async findByCreatedAtBetween(dateStart, dateEnd) {
            
            return await Order.find({ 
                createdAtdateTimeStartAt: { $lte: dateStart },      
                createdAtdateTimeStartAt: { $gt: dateEnd },                
             });

        }                    
    }
}
