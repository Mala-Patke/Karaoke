const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/command');

class SettingsCommand extends Command{
    constructor(client){
        super('settings', client, {
                category: __dirname,                
                description: 'Shows server\'s settings',
                aliases: [],
                guildOnly: true,             
        })
    }

    /**
    * @param {import('discord.js').Message} message 
    * @param {string[]} args 
    */
    async execute(message, args){
        const server = this.client.getServerByID(message.guild.id);
        const embed = new MessageEmbed()
            .setTitle(`Server settings`)
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
            .addField('Prefix', server.prefix, true)
            .addField('Karaoke Channel', `<#${server.karaokeChannel}>`, true)
            .addField('Role Reward', `<@&${server.roleReward}>`, true)
            .addField('Banned Words', server.bannedwords.join(', ') || 'none', true);

        message.channel.send(embed);
    }
}

module.exports = SettingsCommand;