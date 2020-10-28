const { Client, Collection } = require('discord.js');
const { exec } = require('child_process');

const Command = require('./command');
const Server = require('./discordserver');

const rethink = require('../database/rethinkwrapper');
const sql = require('../database/dbwrapper');

require('dotenv').config();

module.exports = class KaraokeBot extends Client{

    /**
     * @param {Collection<String, Command>} commands 
     */
    constructor(commands = new Collection(), categories = [], options = {}){
        super(options);
        this.commands = commands;
        this.categories = categories;
    }

    connection;
    guildata = sql;

    get guildata(){
        return this.guildata;
    }

    async rethinkConnect(){
        exec('rethinkdb.exe', {
            cwd:'./database/RethinkDB'
        });
        rethink.connect().then(res => {
            this.connection = res;
            console.log('RethinkDB connected to bot');
        }).catch(err => console.error(err));
    }

    /**
     * @param {String} arg
     * @returns {Command} 
     */
    getCommand(arg){
        return this.commands.get(arg);
    }

    /**
     * @returns {Server[]}
     */
    get servers(){
        let ret = [];
        this.guilds.cache.each(guild => {
            ret.push(new Server(this, guild.id));
        })
        return ret;
    }

    registerGuild(id){
        this.guildata.insert(id)
    }

    //For use instead of ready event.
    async start(){
        await this.login(process.env.TOKEN)
        console.log('Bot logged in');

        await this.rethinkConnect();
        this.guildata.createBase();
        for(let i of this.servers){
            this.registerGuild(i.id);
        }
    }

}