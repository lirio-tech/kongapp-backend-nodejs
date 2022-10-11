const { ObjectId } = require('mongodb');
const NotificationModel = require("./model/NotificationModel");

module.exports.notificationFindAllPageUsecase = () => {
    return {             
        async findAll(page, size, sort) {
            
            let sortSplited = sort.split(',');
            var _field = sortSplited[0];
            const _sortNumber = sortSplited[1] === 'asc' ? 1 : -1;
              
            return await NotificationModel
                            .find({})
                            .sort( [[_field, _sortNumber]] ) 
                            .skip(page > 0 ? page * size : 0 ) 
                            .limit(size)
        }
    }  
}