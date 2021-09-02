const { Client, Collection } = require('discord.js');
//const { exec } = require('child_process');
const { readdirSync } = require('fs');
const { join } = require('path');

const Command = require('./command');
const Server = require('./discordserver');

const rethink = require('../database/rethinkwrapper');
const SQLWrapper = require('../database/dbwrapper');
const Cache = require('./minicache');

require('dotenv').config();

module.exports = class KaraokeBot extends Client{

    /**
     * @param {Collection<String, Command>} commands 
     */
    constructor(options = {}){
        super(options);
    }

    //Values that might come in handy later
    /**@type {Collection<string, Command>}*/
    commands = new Collection();
    /**@type {string[]}*/
    categories = [];
    /**@private*/
    _connection;

    serverCache = new Cache();

    guildata = SQLWrapper;
    rethink = rethink;

    /**
     * @returns {import('rethinkdb').Connection}
     */
    get connection(){
        return this._connection
    }

    async rethinkConnect(){
/*        exec('rethinkdb.exe', {
            cwd:'./database/RethinkDB',
        });
*/        this._connection = await rethink.connect()
            .catch(err => console.error(err));
    }

    /**
     * @param {String} arg
     * @returns {Command} 
     */
    getCommand(arg){
        return this.commands.get(arg) || this.commands.find(cmd => cmd.options.aliases && cmd.options.aliases.includes(arg)) || null;
    }

    /**
     * @param {string} id 
     * @returns {Server}
     */
    getServerByID(id){
        return this.serverCache.getOrSet(id, new Server(this, id), 600000);
    }

    cacheServer(id){
        this.serverCache.tset(id, new Server(this, id), 600000);
    }

    /**
     * @param {string} id 
     * @returns {Object}
     */
    previewServer(id){
        return {
            prefix: this.guildata.get(id, 'prefix'),
            karaokeChannel: this.guildata.get(id, 'karaokeChannelID')
        }
    }

    registerCategories(){
        for(let dir of readdirSync(join(__dirname, '../commands')).filter(a => !a.endsWith('.txt'))){
            this.categories.push(dir);
        }
    }

    registerCommands(){
        for(let cat of this.categories){
            let categorycommand = readdirSync(join(__dirname, `../commands/${cat}`));
            for(const filename of categorycommand){
                const command = new (require(join(__dirname,`../commands/${cat}/${filename}`)))(this);
                command.options.category = command.options.category.split(/\\+/)[command.options.category.split(/\\+/).length-1]
                this.commands.set(command.name, command);
            }
        }
    }

    async registerGuild(id){
        this.guildata.insert(id);
        await this.rethink.registerNewGuild(this.connection, id)
        this.serverCache.tset(id, new Server(this, id), 600000)
    }

    //Stuff that should be done before ready event.
    async start(){
        const startdate = Date.now();

        await this.login(process.env.TOKEN)
        console.log('Bot logged in');

        await this.rethinkConnect();
        console.log('RethinkDB connection active');

        this.registerCategories();
        this.registerCommands();
        console.log('Commands and Categories initialized.');

        this.guildata.createBase();

        return Date.now() - startdate;
    }

    //Stuff that should be done on ready
    async ready(){

    }

}