const Company = require('../../../models/Company');

module.exports.companyFindByPlanDateEnd = () => {
    return {
        async find(before3days, after3Days) {            
            return await Company.find({ 
                'plan.dateEnd': { $lte: after3Days },      
                'plan.dateEnd': { $gt: before3days }                
             });
        }
    }

}