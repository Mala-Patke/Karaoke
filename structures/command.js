const emoji = require('../util/emoji');

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

    /**
     * @param {import('discord.js').Message} message 
     * @param {import('discord.js').User}
     * @param {Number} length 
     */
    createReactionMenu(message, user, length){
        return new Promise(async (res, rej) => {
            for(let i = 1; i < length+1; i++){
                message.react(emoji[i]);
            }
            let filter = (r, m) => m.id === user.id;
            let collector = message.createReactionCollector(filter, { time: 30000 })
                .on('collect', (reaction, user) => {
                    collector.stop(1);
                    let validemote = emoji[reaction.emoji.name]
                    try{
                        if(validemote > length+1) rej('Faulty emote selection')
                        res(validemote-1)
                    } catch {
                        rej('Faulty emote selection')
                    }
                }).on('end', (collected, reason) => {
                    if(reason !== 1) rej('User did not decide');
                });
                
        })
    }
}