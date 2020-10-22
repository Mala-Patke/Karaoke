const Discord = require('discord.js');
const fs = require('fs');
const Karaokebot = require('./structures/karaokebot');
const Server = require('./structures/discordserver');

let categories = [];
let commands = new Discord.Collection();

for(let dir of fs.readdirSync('./commands')){
    categories.push(dir);
}

for(let cat of categories){
    let categorycommand = fs.readdirSync(`./commands/${cat}`);
    for(const filename of categorycommand){
        const command = new (require(`./commands/${cat}/${filename}`))();
        commands.set(command.name, command);
    }
}

const client = new Karaokebot(commands, categories);

client.on('ready', () => {
    
})

client.on('guildCreate', guild => {
    let server = new Server(guild.client, {}, guild);
})

client.on('message', message => {
    let guild = Server.serverfrommessage(message);
    if(!message.content.startsWith(guild.prefix)) return;
    
    let command = message.content.split(" ")[0].slice(guild.prefix.length);
    let args = message.content.split(" ").slice(guild.prefix.length + command.length);

    client.getcommand(command).execute(message, args);
})

client.start();