const { Client, Collection } = require('discord.js');
const Command = require('./command');
require('dotenv').config();

module.exports = class KaraokeBot extends Client{

    /**
     * @param {Collection<String, Command>} commands 
     */
    constructor(commands, categories, options = {}){
        super(options);
        this.commands = commands;
        this.categories = categories;
    }

    getcommand(a){
        return this.commands.get(a);
    }

    start(){
        this.login(process.env.TOKEN);
    }

    
}

