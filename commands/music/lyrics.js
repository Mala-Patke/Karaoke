const { MessageEmbed } = require('discord.js');
const Command = require("../../structures/command");
const genius = require("../../geniusapiwrapper/genius");

module.exports = class LyricsCommand extends Command{
    constructor(client){
        super('lyrics', client, {
            category:__dirname,
            description: 'Get\'s the parsed lyrics of the song, as they\'re interpretted by the karaoke feature.',
            aliases: [],
            usage: 'lyrics [song name]'
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
        message.channel.send(`\`\`\`${actualsonglyrics}\`\`\``, {split:{append:'```', prepend:'```'}});
    }

}