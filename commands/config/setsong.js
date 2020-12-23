const Command = require('../../structures/command');
const { MessageEmbed } = require('discord.js');
const genius = require('../../geniusapiwrapper/genius');
const parseLyrics = require('../../main/parseLyrics');

class SetSongCommand extends Command{
    constructor(client){
        super('setsong', client, {
                category: __dirname,                
                description: 'Sets the song for the server',
                aliases: [],
                guildOnly: true, 
                usage: `setsong <song name>`,
                requiredPermissions: 'MANAGE_GUILD'
        })
    }

    /**
     * @param {import('discord.js').Message} message 
     * @param {string[]} args 
     */
    async execute(message, args){
        if(!args.length) return message.channel.send('Error: No song provided');
        const server = this.client.getServerByID(message.guild.id);
        if(!server.karaokeChannel) return message.channel.send(`Error: No karaoke channel set. Set one with the ${server.prefix}setup command.`)

        let searchresults = await genius.search(args.join(" ")).catch(() => console.log(1));
        let embeddescription = '';
        for(let i = 0; i < 5; i++){
            let result = searchresults.hits[i].result;
            embeddescription += `${i+1}) [${result.full_title}](${result.url})\n`
        }

        const embed = new MessageEmbed()
            .setTitle(`Here's what we found for "${args.join(" ")}"`)
            .setDescription(embeddescription);
        let sentMessage = await message.channel.send(embed);

        let selection = await this.createReactionMenu(sentMessage, message.author, 5)
            .catch(err => message.channel.send(`Reaction menu closed: ${err}`));

        let temp = await message.channel.send(`Fetching lyrics...`);

        let actualsonglyrics = await genius.lyrics(searchresults.hits[selection].result.url).catch(err => { throw new Error(err)});

        await temp.delete();

        server.set('currentSong', parseLyrics(actualsonglyrics));
        server.set('currentSongName', searchresults.hits[selection].result.full_title)
        server.set('songStartTime', Date.now());
        server.set('currentLine', 0);

        if(message.guild.members.cache.get(this.client.user.id).hasPermission('MANAGE_CHANNELS'))
            message.guild.channels.cache.get(server.karaokeChannel).setTopic(`Current Song: ${server.songName}`)

        return message.channel.send(`Success! Set song to \`${searchresults.hits[selection].result.full_title}\`. Start singing in <#${server.karaokeChannel}>!`)
    }
}

module.exports = SetSongCommand;