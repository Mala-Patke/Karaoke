const db = require('better-sqlite3')('./tempdb.sqlite');

class Database{

    static createBase(){
        db.prepare(`CREATE TABLE IF NOT EXISTS guilds (
            id TEXT PRIMARY KEY,
            prefix TEXT DEFAULT "k+" NOT NULL,
            karaokeChannelID TEXT,
            roleRewardID TEXT
            )`).run();
    }

    static insert(id){
        if(this.get(id, 'id')) return;
        db.prepare(`INSERT INTO guilds (id) VALUES ('${id}')`).run();
    }

    /**
     * @param {String} id
     * @param {('prefix'|'karaokeChannelID'|'roleRewardID')} key
     * @returns {String} 
     */
    static get(id, key){
        try{
            return db.prepare(`SELECT ${key} FROM guilds WHERE id = '${id}'`).get()[key];;
        } catch {
            return null;
        }
    }

    /**
     * @param {String} id 
     * @param {('prefix'|'karaokeChannelID'|'roleRewardID')} key
     * @param {String} value 
     */
    static set(id, key, value){
        db.prepare(`UPDATE guilds
        SET ${key} = '${value}' 
        WHERE id = '${id}'`).run();
    }

}

module.exports = Database;