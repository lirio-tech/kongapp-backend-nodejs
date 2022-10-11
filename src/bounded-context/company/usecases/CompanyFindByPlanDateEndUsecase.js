const Company = require('../../../models/Company');

module.exports.companyFindByPlanDateEnd = () => {
    return {
        async find(before3days, after3Days) {            
            /**
             *  it will return "_id" and "plan.dateEnd"
             */

            // return await Company.find({ 
            //     'plan.dateEnd': { $lte: after3Days },      
            //     'plan.dateEnd': { $gt: before3days }                
            //  });

            return await Company.aggregate([
                {
                  '$project': {
                    'plan.dateEnd': {
                      '$dateFromString': {
                        'dateString': '$plan.dateEnd'
                      }
                    },
                    'plan.name': '$plan.name'  
                  }
                }, {
                  '$match': {
                    'plan.dateEnd': { 
                        $lte: after3Days,      
                        $gte: before3days 
                    }                                    
                  }
                }
            ]);            

        }
    }

}