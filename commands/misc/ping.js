const Command = require("../../structures/command");

module.exports = class PingCommand extends Command{
    constructor(client){
        super('ping', client, {
            category:__dirname
        })
    }

    execute(message, args){
        return message.channel.send(message.client.ws.ping);
    }

}