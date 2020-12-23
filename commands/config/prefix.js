const Command = require('../../structures/command');

class PrefixCommand extends Command{
    constructor(client){
        super('prefix', client, {
                category: __dirname,                
                description: 'Says or sets the prefix of the server',
                aliases: [],
                guildOnly: true, 
                usage: 'prefix [prefix]'
            
        })
    }

    /**
    * @param {import('discord.js').Message} message 
    * @param {string[]} args 
    */
    async execute(message, args){
        const server = this.client.getServerByID(message.guild.id);
        if(!args.length) return message.channel.send(``, {
            embed:{
                description:`Prefix for server '${message.guild.name}:' \`${server.prefix}\``,
                footer:`To change this prefix, run ${server.prefix}prefix [new prefix]`
            }
        });
        server.set('prefix', args[0])
        message.channel.send(`Server prefix successfully changed to \`${server.prefix}\``)
    }
}

module.exports = PrefixCommand;