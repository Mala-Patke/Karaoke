const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/command');

class ScoreCommand extends Command{
    constructor(client){
        super('score', client, {
                category: __dirname,                
                description: 'View a user\'s server score',
                aliases: ['points'],
                guildOnly: true, 
                usage: 'score <user>'
            
        })
    }

    /**
    * @param {import('discord.js').Message} message 
    */
    async execute(message){
        const server = this.client.getServerByID(message.guild.id);
        let user = message.mentions.users.first() || message.author;
        let servercounts = await server.getTotalMemberCount(user.id);

        message.channel.send(new MessageEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic:true }))
            .setTitle(`Server points`)
            .setDescription(`Points in this server: ${(await server.getMemberCount(user.id)).count}\nTotal points in all servers: ${servercounts.reduce((p, n) => p+n)}\nAverage points per server: ${servercounts.reduce((p,n) => p+n)/servercounts.length}`)
            .setTimestamp()
            .setColor('YELLOW')
        )
    }
}

module.exports = ScoreCommand;