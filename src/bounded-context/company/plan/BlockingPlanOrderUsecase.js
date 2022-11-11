const Company = require('../../../models/Company');
const companyService  = require('../../../services/CompanyService.js').companyService();


module.exports.blockingPlanOrderUsecase = () => {
    return {
        isNotExpiredPlan(company, dayAdded) {
            if(company.plan.name === 'Free') {
                return true;
            }
            let _3DaysAfter = new Date(dateUtils.getNewDateAddDay(-dayAdded));
            return new Date(company.plan.dateStarted) <= new Date() && 
                new Date(company.plan.dateEnd) >= _3DaysAfter;
        },                 
        async block(company) {
            if(company.plan.name === 'Free') {
                return false;
            }

            if(this.isNotExpiredPlan(company, company.daysForBlocking) === false) {
                if(company.downgradePlanFree === true) {
                    company.planOld = company.plan;
                    company.plan = companyService.getPlanFree();
                    company.downgradePlanFree = false;
                    await Company.updateOne({_id: company._id}, company);
                    return false;
                }
                return true;
            }
            return false;
        }
    }
}