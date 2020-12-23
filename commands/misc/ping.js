const Command = require("../../structures/command");

module.exports = class PingCommand extends Command{
    constructor(client){
        super('ping', client, {
            category:__dirname,
            aliases: ['pong']
        })
    }

    /**
     * @param {import('discord.js').Message} message 
     */
    execute(message){
        let now = Date.now();
        message.channel.send('pinging...')
        .then(m => {
            m.edit(``, {
                embed:{
                    title:`:ping_pong: Pong!`,
                    fields:[
                        {
                            name: 'Latency',
                            value: `${Date.now()-now}ms`,
                            inline:true
                        },
                        {
                            name: 'Websocket Ping',
                            value: `${this.client.ws.ping}ms`,
                            inline:true
                        }
                    ]
                }
            })
        })
    }
}