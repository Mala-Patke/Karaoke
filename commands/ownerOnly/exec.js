const Command = require('../../structures/command');
const { inspect } = require('util');

class ExecCommand extends Command{
    constructor(client){
        super('exec', client, {
                category: __dirname,                
                description: '',
                aliases: [],
                guildOnly: true, 
                usage: '',
                ownerOnly: true
        })
    }

    /**
    * @param {import('discord.js').Message} message 
    * @param {string[]} args 
    */
    async execute(message, args){
        try {
            let res = eval(args.join(" "));
            if(typeof res !== 'string'){
                res = inspect(res)
            }
            message.channel.send(res, { code: 'xl' }).catch(() => console.log(res))
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = ExecCommand;