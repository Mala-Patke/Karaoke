const rethink = require('rethinkdb');
require('dotenv').config();

class RethinkWrapper{
    /**
     * @returns {Promise<import('rethinkdb').Connection>}
     */
    static async connect(){
        return new Promise((res, rej) => {
            rethink.connect({
                host: process.env.RETHINKHOST,
                port: parseInt(process.env.RETHINKPORT),
                db: process.env.RETHINKMAINDB
            }, (err, conn) => {
                if(err) rej("Connection Error: " + err.stack);
                res(conn);
            });
        })
    }
    /**
     * @param {import("rethinkdb").Connection} connection 
     * @param {String} table 
     * @returns {Boolean}
     */
    static async doesTableExist(connection, table){
        return (await rethink.db(process.env.RETHINKMAINDB).tableList().run(connection)).includes(table);
    }
    /**
     * @param {import("rethinkdb").Connection} connection 
     * @param {String} member
     * @param {String} table 
     * @returns {Boolean}
     */
    static async doesMemberExistInTable(connection, member, table){
        return !!await rethink.table(table).get(member).run(connection);
        
    }
    /**
     * @param {import("rethinkdb").Connection} connection 
     * @param {String} guildId 
     */
    static async registerNewGuild(connection, guildId){
        return new Promise((res, rej) => {
            rethink.db(process.env.RETHINKMAINDB).tableCreate(guildId, {primary_key:'id'}).run(connection)
                .then(created => res(created))
                .catch(reason => rej(reason));
        })
    }

    /**
     * @param {import("rethinkdb").Connection} connection 
     * @param {String} memberId 
     * @param {String} guildId 
     * @returns {Promise<import("rethinkdb").WriteResult>}
     */
    static async registerNewGuildMember(connection, memberId, guildId){
        return new Promise((res, rej) => {
            rethink.table(guildId).insert({
                id:memberId,
                count:0
            }).run(connection)
                .then(val => res(val))
                .catch(err => rej(err));
        })
    }

    /**
     * @param {import("rethinkdb").Connection} connection 
     * @param {String} memberId 
     * @param {String} guildId 
     */
    static async incrementMemberCount(connection, memberId, guildId){
        let startdata = await rethink.table(guildId).get(memberId).run(connection);
        if(!await this.doesMemberExistInTable(connection, memberId, guildId)) startdata = await this.registerNewGuildMember(connection, memberId, guildId);
        startdata.count+=1;
        return rethink.table(guildId).get(memberId).update(startdata);
    }

    /**
     * @param {import("rethinkdb").Connection} connection 
     * @param {String} memberId 
     * @param {String} guildId 
     */
    static async getMemberCount(connection, memberId, guildId){
        if(!await this.doesMemberExistInTable(connection, memberId, guildId)) return 0;
        return await rethink.table(guildId).get(memberId).run(connection);
    }

}

module.exports = RethinkWrapper;