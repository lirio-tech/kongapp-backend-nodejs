const HAIRDRESSER = 'hairdresser';
const ADMINISTRATOR = 'administrator';
const SYS_ADMIN = 'sys_admin';

module.exports.userService = () => {
    return {                
        isAdmin(type) {
            return type === ADMINISTRATOR || type === SYS_ADMIN;
        },         
    } 
}