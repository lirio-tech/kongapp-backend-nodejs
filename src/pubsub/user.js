const PubSub = require('pubsub-js');

module.exports.userTopic = () => {
    return {
        execute(userUpdated) {
            PubSub.publish('USER_UPDATED', userUpdated);
        },
        subscribe(subscribeMethod) {
            PubSub.subscribe('USER_UPDATED', subscribeMethod);
        }
    }
}