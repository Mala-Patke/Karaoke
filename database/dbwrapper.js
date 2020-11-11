const db = require('better-sqlite3')('./tempdb.sqlite');

class SQLWrapper{

    static createBase(){
        db.prepare(`CREATE TABLE IF NOT EXISTS guilds (
            id TEXT PRIMARY KEY,
            prefix TEXT DEFAULT "k+" NOT NULL,
            karaokeChannelID TEXT,
            roleRewardID TEXT,
            lastSingerID TEXT,
            currentSong TEXT,
            currentLine INT,
            bannedWords TEXT
            )`).run();
    }

    static insert(id){
        if(this.get(id, 'id')) return;
        db.prepare(`INSERT INTO guilds (id) VALUES ('${id}')`).run();
    }

    /**
     * @param {string} id
     * @param {string} key
     * @returns {string} 
     */
    static get(id, key){
        try{
            return db.prepare(`SELECT ${key} FROM guilds WHERE id = '${id}'`).get()[key];;
        } catch {
            return null;
        }
    }

    /**
     * @param {string} id 
     * @param {string} key
     * @param {string} value 
     */
    static set(id, key, value){
        db.prepare(`UPDATE guilds
        SET ${key} = '${value}' 
        WHERE id = '${id}'`).run();
    }

    /**
     * @param {string} id 
     * @param {string} key 
     * @param {string} value 
     */
    static add(id, key, value){
        value = value.replace(/[,-*_.#@$%\/\\]/g, '').toLowerCase();
        db.prepare(`UPDATE guilds
        SET ${key} = CONCAT((SELECT ${key} FROM guilds WHERE id = '${id}'), ',${value}')
        WHERE id = '${id}'
        `).run();
    }

    /**
     * @param {string} id 
     * @param {string} key 
     * @param {number} value 
     */
    static increment(id, key, value){
        this.set(id, key, this.get(id, key)+value)
    }

}

module.exports = SQLWrapper;