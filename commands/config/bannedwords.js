const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/command');

const comcase = {
    /**
    * @param {import('../../structures/discordserver')} server 
    * @param {string[]} args
    */
    'add': (server, args) => {
        args = args.map(a => a.replace(/[^a-z]/gi, ''))
        for(let arg of args){
            server.add('bannedWords', arg)
        }
        return new MessageEmbed()
            .setTitle('Added the following words to the server\'s banned words list:')
            .setDescription('> ' + args.join('\n> '))
            .setFooter(`View a list of all banned words with the \`${server.prefix}bannedwords list\` command`);
    },
    /**
    * @param {import('../../structures/discordserver')} server 
    * @param {string[]} args
    */
    'remove': (server, args) => {
        args = args.map(a => a.replace(/[^a-z]/gi, ''))
        for(let arg of args){
            server.remove('bannedWords', arg)
        }
        return new MessageEmbed()
            .setTitle('Removed the following words from the server\'s banned words list:')
            .setDescription('> ' + args.join('\n> '))
            .setFooter(`View a list of all banned words with the \`${server.prefix}bannedwords list\` command`); 
    },
    /**
    * @param {import('../../structures/discordserver')} server 
    * @param {string[]} args
    */
    'list': (server) => {
        console.log(server.bannedwords);
        return new MessageEmbed()
            .setTitle("Here's a list of banned words on this server!")
            .setDescription('> ' + server.bannedwords.join('\n> '));
    }
}

class BannedWordsCommand extends Command{
    constructor(client){
        super('bannedwords', client, {
                category: __dirname,                
                description: 'Adds, removes, or lists a server\'s banned words',
                aliases: ['blacklist'],
                guildOnly: true, 
                usage: ''
        })
    }

    /**
    * @param {import('discord.js').Message} message 
    * @param {string[]} args 
    */
    async execute(message, args){
        let subcom = args.shift();
        const server = this.client.getServerByID(message.guild.id);
        message.channel.send(comcase[subcom || 'list'](server, args));
    }
}

module.exports = BannedWordsCommand;