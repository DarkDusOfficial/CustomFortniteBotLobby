const nconf = require('nconf');
const postStatus = require('../client/postStatus')
const getUserData = require('../client/getData')
const config = nconf.file({ file: 'config.json' });
let data

const handleClientIsBanned = async (botClient) => {
    const userData = getUserData(botClient.user.self.displayName)
    await botClient.setStatus(nconf.get('client:status:matchmaking_banned'))
    data = {
        username: botClient.user.self.displayName,
        status: "Online",
        friends: userData.friends,
        party: "in_party",
        matchmaking: "banned",
        timestamp: new Date().toISOString()
    };
    await postStatus(data)
    
    await botClient.party.me.clearEmote()
    await botClient.party.me.setEmote('EID_Wave');

    if (!nconf.get('fortnite:banned_matchmaking')) {
        nconf.set('fortnite:banned_matchmaking', true);

        nconf.save((err) => {
            if (err) {
                console.error('Error saving configuration:', err);
            } else {
                console.log('Configuration updated successfully.');
            }
        });
    }
};

module.exports = handleClientIsBanned;