const Discord = require('discord.js');
const fs = require('fs');
const Karaokebot = require('./structures/karaokebot');

const client = new Karaokebot();

let categories = [];
let commands = new Discord.Collection();

for(let dir of fs.readdirSync('./commands')){
    categories.push(dir);
}

for(let cat of categories){
    let categorycommand = fs.readdirSync(`./commands/${cat}`);
    for(const filename of categorycommand){
        const command = new (require(`./commands/${cat}/${filename}`))(client);
        commands.set(command.name, command);
    }
}

client.commands = commands;
client.categories = categories;

client.on('guildCreate', guild => {
    client.registerGuild(guild.id);
})

client.on('message', message => {
    let prefix = client.servers.find(a => a.id === message.guild.id).prefix;
    if(!message.content.startsWith(prefix.toLowerCase())) return;
    let command = message.content.split(" ")[0].slice(prefix.length);
    let args = message.content.split(" ").slice(prefix.length + command.length);
    try{
        client.getCommand(command).execute(message, args);
    } catch (e) {
        message.channel.send(`You've recieved an error: ${e}.`);
    }
})

client.start().then(() => console.log('Initialization has completed. Client is now ready for use.'));