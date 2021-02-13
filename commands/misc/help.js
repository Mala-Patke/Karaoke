const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/command');

class HelpCommand extends Command{
    constructor(client){
        super('help', client, {
                category: __dirname,                
                description: 'Displays info and commands',
                aliases: ['commands', 'cmds'],
                guildOnly: false, 
                usage: 'help <command name>'
        })
    }

    /**
    * @param {import('discord.js').Message} message 
    * @param {string[]} args 
    */
    async execute(message, args){
        const embed = new MessageEmbed().setAuthor(this.client.user.tag, this.client.user.avatarURL({ dynamic: true }));
        const prefix = this.client.getServerByID(message.guild.id).prefix;

        if(!args.length){
            embed
                .setTitle('Here\'s a list of all of my commands!')
                .setFooter(`To get info on a more specific command or category, run ${prefix}help <command/category name>`);
            for(const cat of this.client.categories){
                if(cat !== 'ownerOnly')
                    embed.addField(cat, this.client.commands.array()
                        .filter(com => com.options.category === cat)
                        .map(val => `\`${val.name}\``)
                        .join(', '), true);
            }
        } else if(this.client.categories.includes(args[0])){
            let category = this.client.categories.find(a => a === args[0]);
            embed
                .setTitle(`Info on category ${category}`)
                .setFooter(`To view a list of all of my categories, run ${prefix}help <command>`);
            let desc = '';
            this.client.commands.array().filter(a => a.options.category === category).forEach(elem => {
                desc += `**${elem.name}**  ${elem.options.description}\n`
            })
            embed.setDescription(desc);
        } else if(this.client.commands.has(args[0])){
            const command = this.client.getCommand(args[0]);
            embed
                .setTitle(`Info for command ${command.name}`)
                .addFields(
                    {name: `Aliases`, value: command.options.aliases ? command.options.aliases.join(', ') : 'No aliases', inline: true},
                    {name: `Description`, value: command.options.description || none, inline: true},
                    {name: `Required Permissions`, value: command.options.requiredPermissions ? command.options.requiredPermissions.replace('GUILD','SERVER') : 'None', inline: true},
                    {name: `Can be run in DMs?`, value: command.options.guildOnly ? 'No' : 'Yes', inline: true},
                    {name: `Usage`, value: prefix+command.options.usage || prefix+command.name, inline: true}
                )
                .setFooter(`To see a list of all of my commands, run \`${prefix}help\` with no arguments!`);
        } else {
            embed
                .setColor('RED')
                .setTitle(`Error: Could not find a command or category matching ${args[0]}`)
                .setDescription(`Run ${prefix}help to see all of my commands!`);
        }

        message.channel.send(embed);
    }
}

module.exports = HelpCommand;