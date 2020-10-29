const Command = require("../../structures/command");

module.exports = class EchoCommand extends Command{
    constructor(client){
        super('echo', client, {
            category:__dirname
        })
    }

    execute(message, args){
        return message.channel.send(args.join(" "));
    }

}