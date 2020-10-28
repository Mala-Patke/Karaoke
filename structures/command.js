class commandoptions{
    /**
     * @param {string} category 
     * @param {string} description 
     * @param {string[]} aliases 
     * @param {boolean} guildOnly 
     * @param {string} usage 
     */
    constructor(
        category = null,
        description = null,
        aliases = [],
        guildOnly = false, 
        usage = this.description
    ){
        this.category = category;
        this.description = description;
        this.aliases = aliases;
        this.guildOnly = guildOnly;
        this.usage = usage;
    }
}

module.exports = class Command{
    /**
     * @param {string} name 
     * @param {import('../structures/karaokebot')} client
     * @param {commandoptions} options 
     */
    constructor(name, client, options){
        this.name = name;
        this.client = client;
        this.options = options;
    }
    
    execute(message, args){
        return message.channel.send('Edit this to change the output of the command!');
    }
}