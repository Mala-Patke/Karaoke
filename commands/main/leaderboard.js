const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/command');

class LeaderboardCommand extends Command{
    constructor(client){
        super('leaderboard', client, {
                category: __dirname,                
                description: '',
                aliases: ['lb', 'board', 'top'],
                guildOnly: true, 
                usage: ''
            
        })
    }

    /**
    * @param {import('discord.js').Message} message 
    * @param {string[]} args 
    */
    async execute(message, args){
        let arg = parseInt(args[0]);

        const temp = await message.channel.send(`Fetching members...`);
        let data = await this.client.rethink.getMembersFromGuild(this.client.connection, message.guild.id);

        let scalefactor = (!arg || arg*10 > data.length || arg === 1) ? 0 : 10*(arg+1);

        data = data
            .sort((a, b) => b.count - a.count)
            .slice(scalefactor, scalefactor+10);
        console.log(scalefactor);
        const members = await message.guild.members.fetch({ user: data.map(a => a.id) });
        console.log(members.keyArray());
        const str = data
            .reduce((prev, curr, index) => {
                return prev + `${index+1}) ${members.get(curr.id).user.tag} • ${curr.count}\n`
            }, '').trim();
        
        console.log(str);
        const embed = new MessageEmbed()
            .setDescription(str);

        message.channel.send(embed);
        await temp.delete();
    }
}

module.exports = LeaderboardCommand;