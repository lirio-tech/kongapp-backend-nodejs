const Company = require('../../../models/Company');
const notificationSaveSignaturePaidUsecase  = require('../../notification/usecases/NotificationSaveSignaturePaidUsecase.js').notificationSaveSignaturePaid();

module.exports.renovatePlanUsecase = () => {
    return {
        async renovate(objectCompanyId, objectUserId) {
            const userSysAdmin = await User.findOne({_id: objectUserId});
            if(!userSysAdmin || userSysAdmin.type !== 'sys_admin') {
              res.status(403).json({message: `Usuario tem Permissao`}); 
              return;
            }
            
            let company = await Company.findOne({ _id: objectCompanyId }); 
            company.planOld = company.plan;

            let dtEnd = new Date(company.plan.dateEnd);
            dtEnd.setMonth(dtEnd.getMonth()+1)
            company.plan.dateEnd = dtEnd;

            let dtStart = new Date(company.plan.dateStarted);
            dtStart.setMonth(dtStart.getMonth()+1)
            company.plan.dateStarted = dtStart;
            
            await Company.updateOne({_id: company._id }, company);
            notificationSaveSignaturePaidUsecase.save(company._id); 
            if(!company.fake) {
              await new PaymentsHistoric({ plan: company.plan, company: company }).save();
            }
            return company;
        }
    }

}