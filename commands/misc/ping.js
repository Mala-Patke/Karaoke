const Command = require("../../structures/command");

module.exports = class PingCommand extends Command{
    constructor(){
        super('ping', {
            category:__dirname
        })
    }

    execute(message, args){
        return message.channel.send(message.client.ws.ping);
    }

}