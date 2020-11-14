const { Client, Collection } = require('discord.js');
const { exec } = require('child_process');

const Command = require('./command');
const Server = require('./discordserver');

const rethink = require('../database/rethinkwrapper');
const SQLWrapper = require('../database/dbwrapper');

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

    //Values that might come in handy later
    /**@private*/
    _connection;
    /**@private*/
    _declaredServers = [];

    guildata = SQLWrapper;
    rethink = rethink;

    /**
     * @returns {import('rethinkdb').Connection}
     */
    get connection(){
        return this._connection
    }
    /**
     * @returns {import('./discordserver')[]}
     */
    get declaredServers(){
        return this._declaredServers;
    }

    async rethinkConnect(){
        exec('rethinkdb.exe', {
            cwd:'./database/RethinkDB'
        });
        this._connection = await rethink.connect()
            .catch(err => console.error(err));
    }

    /**
     * @param {String} arg
     * @returns {Command} 
     */
    getCommand(arg){
        return this.commands.get(arg);
    }

    /**
     * @param {String} id 
     * @returns {Server}
     */
    getServerByID(id){
        return this.declaredServers.find(a => a.id === id);
    }

    registerServers(){
        this.guilds.cache.each(guild => {
            this._declaredServers.push(new Server(this, guild.id));
        })
    }

    async registerGuild(id){
        this.guildata.insert(id);
        //await this.rethink.registerNewGuild(this.connection, id)
        this.declaredServers.push(new Server(this, id));
    }

    //Stuff that should be done before ready event.
    async start(){
        await this.login(process.env.TOKEN)
        console.log('Bot logged in')
        await this.rethinkConnect();
        console.log('RethinkDB connection active')
        this.guildata.createBase();
        this.registerGuild('690801248143671296');
    }

    //Stuff that should be done on ready
    async ready(){
        this.registerServers();
        console.log('All Guilds locally registered.')
    }

}