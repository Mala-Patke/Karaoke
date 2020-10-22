module.exports = class Command{
    constructor(name, options = {}){
        this.name = name;
        this.category = options.category;
        this.description = options.description || null;
        this.aliases = options.aliases || null;
        this.guildOnly = options.guildOnly || false;
        this.usage = options.usage || null;        
    }
    
    execute(message, args){
        return message.channel.send('Edit this to change the output of the command!');
    }
}