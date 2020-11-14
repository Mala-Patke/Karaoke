const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/command');

class NextLineCommand extends Command{
    constructor(client){
        super('nextline', client, {
                category: __dirname,                
                description: 'Gets the next line of the set song',
                aliases: [],
                guildOnly: true, 
                usage: 'nextline'
        })
    }

    /**
     * @param {import('discord.js').Message} message 
     * @param {string[]} args 
     */
    execute(message, args){
        const server = this.client.getServerByID(message.guild.id);
        
        if(!server.songName) return message.channel.send(`Error: No song specified. Set a song with the ${server.prefix}setsong command!`);
        
        let nextline = server.song.split('\n')[server.line];
        message.channel.send(new MessageEmbed()
            .setTitle(`Next lyric to the song ${server.songName}`)
            .setDescription(`\`${nextline}\``)
        )
    }
}

module.exports = NextLineCommand;