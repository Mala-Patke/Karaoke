const { MessageEmbed } = require('discord.js');
const Command = require("../../structures/command");
const genius = require("../../geniusapiwrapper/genius");
const parseLyrics = require('../../main/parseLyrics');

module.exports = class ParsedLyricsCommand extends Command{
    constructor(client){
        super('parsedlyrics', client, {
            category:__dirname
        })
    }

    /**
     * @param {import('discord.js').Message} message 
     * @param {String[]} args 
     */
    async execute(message, args){
        let searchresults = await genius.search(args.join(" ")).catch(err => console.log(1));
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
        message.channel.send(`\`\`\`${parseLyrics(actualsonglyrics, this.client.getServerByID(message.guild.id).bannedwords)}\`\`\``, {split:{append:'```', prepend:'```'}});
    }

}