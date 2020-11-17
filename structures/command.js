const emoji = require('../util/emoji');
const { MessageEmbed } = require('discord.js');

class commandoptions{
    /**
     * @param {string} category 
     * @param {string} description 
     * @param {string[]} aliases 
     * @param {boolean} guildOnly 
     * @param {string} usage 
     * @param {import('discord.js').PermissionString} requiredPermissions
     */
    constructor(
        category = null,
        description = null,
        aliases = [],
        guildOnly = false, 
        usage = this.description,
        requiredPermissions = null
    ){
        this.category = category;
        this.description = description;
        this.aliases = aliases;
        this.guildOnly = guildOnly;
        this.usage = usage;
        this.requiredPermissions = requiredPermissions;
        
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

    //Embeds
    setupembeds = {
        first(){
            return new MessageEmbed()
                .setTitle("Thank you for choosing Karaoke!")
                .setDescription("In a few simple prompts, we'll have your server set up with the bot.\n\nBefore we begin, please ensure that we have all required permissions")
                .addField("\u200b", "Say **cancel** to cancel\nSay anything else to continue");
        },
        second(){
            return new MessageEmbed()
                .setTitle("Step 1: Configuring a karaoke channel.")
                .setDescription("In order to begin the process, Karaoke needs a dedicated channel to begin in. This channel must not be active with any other messages for any other reason. Please mention the channel below.")
                .addField("\u200b", "Say **cancel** to cancel\nMention the channel name to continue");
        },
        third(){
            return new MessageEmbed()
                .setTitle("Step 2: Configuring a role reward")
                .setDescription("Should I give a role to a member who has last sent a message? Mention it below. WARNING: THIS ROLE WILL BE REMOVED ONCE ANOTHER USER SINGS.")
                .addField("\u200b", "Say **cancel** to cancel. Say **skip** to skip this step\nMention the role to continue.");
        },
        final(channel, role){
            return new MessageEmbed()
                .setTitle("Okay, here are the server's config settings!")
                .setDescription(`karaokechannel = <#${channel}>\nsingerRole = <@&${role}>`);
        }
    }

    errorEmbed(error){
        return new MessageEmbed()
            
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
            message.react('⏹');
            let filter = (r, m) => m.id === user.id;
            let collector = message.createReactionCollector(filter, { time: 30000 })
                .on('collect', (reaction, user) => {
                    collector.stop(1);
                    let validemote = emoji[reaction.emoji.name];
                    if(reaction.emoji.name === '⏹') rej('Cancelled by User');
                    try{
                        if(validemote > length+1) rej('Faulty emote selection')
                        res(validemote-1)
                    } catch {
                        rej('Faulty emote selection')
                    }
                }).on('end', (a, reason) => {
                    if(reason !== 1) rej('User did not decide'); 
                });
                
        })
    }
}