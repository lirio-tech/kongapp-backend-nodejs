const Company = require('../../../models/Company');

module.exports.companyFindByIdUsecase = () => {
    return {
        async findById(objectId) {
            return await Company.findOne({ _id: objectId });
        }
    }

}