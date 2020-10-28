const KaraokeBot = require('./karaokebot');
const rethink = require('../database/rethinkwrapper');

module.exports = class Server{
    /**
     * 
     * @param {KaraokeBot} client 
     * @param {String} id 
     */
    constructor(client, id){
        this.client = client;
        this.id = id;
    }
    
    get prefix(){
        return this.client.guildata.get(this.id, 'prefix');
    }

    get karaokeChannel(){
        return this.client.guildata.get(this.id, 'karaokeChannelID') || null;
    }
    
    get roleReward(){
        return this.client.guildata.get(this.id, 'roleRewardID') || null;
    }
}