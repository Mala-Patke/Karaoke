const KaraokeBot = require('./karaokebot');
const Cache = require('./minicache');
const rethink = require('../database/rethinkwrapper');

module.exports = class Server{
    /**
     * @param {KaraokeBot} client 
     * @param {string} id 
     */
    constructor(client, id){
        this.client = client;
        this.id = id;
    }
    
    cache = new Cache();

    /**
     * @param {string} thing
     * @param {boolean} cache 
     * @private
     * @return {string}
     */
    _get(thing, cache = true){
        if(!this.cache.get(thing)){
            let dbresponse = this.client.guildata.get(this.id, thing);
            if(cache) this.cache.tset(thing, dbresponse, 600000);
            return dbresponse;
        } 
        return this.cache.get(thing).val;
    }

    /**
     * @param {string} userid
     */
    incrementMemberCount(userid){
        rethink.incrementMemberCount(this.client.connection, userid, this.id);
    }

    /**
     * @param {string} userid 
     * @returns {number}
     */
    async getMemberCount(userid){
        return await rethink.getMemberCount(this.client.connection, userid, this.id);
    }

    /**
     * @param {string} userid 
     * @returns {number[]}
     */
    async getTotalMemberCount(userid){
        return await rethink.getMemberGuildCounts(this.client.connection, userid);
    }

    /**
     * @param {('prefix'|'karaokeChannelID'|'roleRewardID'|'lastSingerID'|'currentSong'|'currentSongName'|'currentLine'|'bannedWords'|'songStartTime')} key 
     * @param {string} val 
     */
    set(key, val){
        this.client.guildata.set(this.id, key, val);
        this.cache.tset(key, val, 600000);
    }

    /**
     * @param {('prefix'|'karaokeChannelID'|'roleRewardID'|'lastSingerID'|'currentSong'|'currentSongName'|'currentLine'|'bannedWords'|'songStartTime')} key 
     * @param {string} val 
     */
    add(key, val){
        if(!this._get(key, false)) return this.client.guildata.set(this.id, key, val);
        this.client.guildata.add(this.id, key, val);
    }

    /**
     * @param {('prefix'|'karaokeChannelID'|'roleRewardID'|'lastSingerID'|'currentSong'|'currentSongName'|'currentLine'|'bannedWords'|'songStartTime')} key 
     * @param {string} val 
     */
    remove(key, val){
        const curr = this._get(key, false);
        if(!curr) throw new Error('No value set')
        if(!curr.split(',').includes(val)) throw new Error('Invalid value');
        console.log(curr.replace(val, ''))
        this.client.guildata.set(this.id, key, curr.replace(val, '').replace(/,{2,}/g, ''));
    }

    /**
     * @returns {string}
     */
    get prefix(){
        return this._get('prefix');
    } 

    /**
     * @returns {string}
     */
    get karaokeChannel(){
        return this._get('karaokeChannelID');
    }

    /**
     * @returns {string}
     */
    get roleReward(){
        return this._get('roleRewardID');
    }

    /**
     * @returns {string}
     */
    get song(){
        return this._get('currentSong');
    }

    /**
     * @returns {string}
     */
    get songName(){
        return this._get('currentSongName');
    }

    /**
     * @returns {number}
     */
    get line(){
        return this._get('currentLine');
    }

    /**
     * @returns {string}
     */
    get lastSinger(){
        return this._get('lastSingerID');
    }

    get startTime(){
        return this._get('songStartTime');
    }

    /**
     * @returns {string[]}
     */
    get bannedwords(){
        try{
            return this._get('bannedWords', false).split(",");
        } catch {
            return [];
        }
    }
}