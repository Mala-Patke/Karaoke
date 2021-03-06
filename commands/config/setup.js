const Command = require('../../structures/command');

module.exports = class SetupCommand extends Command{
    constructor(client){
        super('setup', client, {
            category: __dirname,
            aliases: ["config"],
            description: "Configure the server to use the karaoke feature",
            guildOnly: true,
            requiredPermissions: 'MANAGE_GUILD'
        })
    }

    /**
     * @param {import('discord.js').Message} message 
     */
    execute(message){
        const collector = message.channel.createMessageCollector(m => m.author === message.author, {time:300000});
        let increment = 1;
        const options = {
            2: () => message.channel.send(this.setupembeds.second()),
            3: () => message.channel.send(this.setupembeds.third()),
            4: () => collector.stop('completed')
        }

        message.channel.send(this.setupembeds.first());

        collector.on('collect', () => {
            if(message.channel.lastMessage.content.toLocaleLowerCase() === 'cancel') return collector.stop('Cancelled by user');
            increment++;
            options[increment]();
        })

        collector.on('end', (collected, reason) => {
            if(reason !== 'completed') return message.channel.send(`Prompt cancelled: ${reason}`);
            let messages = collected.array().slice(1);

            const server = this.client.getServerByID(message.guild.id);

            server.set('karaokeChannelID', messages[0].mentions.channels.first().id);
            server.set('roleRewardID', messages[1].mentions.roles.first().id);

            let checkpoint1 = server.karaokeChannel;
            let checkpoint2 = server.roleReward;

            message.channel.send(this.setupembeds.final(checkpoint1, checkpoint2));

        })
    }

}