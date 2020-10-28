const Command = require('../../structures/command');
const Embeds = require('../../embedwrappers/setupembeds');
const { Message } = require('discord.js');

module.exports = class SetupCommand extends Command{
    /**
     * 
     * @param {import('../../structures/karaokebot')} client 
     */
    constructor(client){
        super('setup', client, {
            category: __dirname,
            aliases: ["config"],
            description: "Configure the server to use the karaoke feature",
            guildOnly: true,
        })
    }

    /**
     * @param {Message} message 
     */
    execute(message){
        const filter = m => m.author === message.author;
        const collector = message.channel.createMessageCollector(filter, {time:300000});
        let increment = 1;
        message.channel.send(Embeds.first())
        collector.on('collect', () => {
            if(message.channel.lastMessage.content.toLocaleLowerCase() === 'cancel') return collector.stop('Cancelled');
            increment++;
            const options = {
                2: () => message.channel.send(Embeds.second()),
                3: () => message.channel.send(Embeds.third()),
                4: () => collector.stop('completed')
            }
            options[increment]();
        })

        collector.on('end', (collected, reason) => {
            if(reason !== 'completed') return message.channel.send("Prompt cancelled");
            let messages = collected.array();

            this.client.guildata.set(message.guild.id, 'karaokeChannelID', messages[1].mentions.channels.first().id);
            this.client.guildata.set(message.guild.id, 'roleRewardID', messages[2].mentions.roles.first().id);

            let checkpoint1 = this.client.guildata.get(message.guild.id, 'karaokeChannelID');
            let checkpoint2 = this.client.guildata.get(message.guild.id, 'roleRewardID');

            message.channel.send(Embeds.final(checkpoint1, checkpoint2));

        })
    }

}