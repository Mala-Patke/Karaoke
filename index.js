const Discord = require('discord.js');
const fs = require('fs');
const Karaokebot = require('./structures/karaokebot');
const karaoke = require('./main/karaoke');

const client = new Karaokebot();

let categories = [];
let commands = new Discord.Collection();

for(let dir of fs.readdirSync('./commands').filter(a => !a.endsWith('.txt'))){
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

client.on('ready', client.ready);

client.on('guildCreate', guild => {
    client.registerGuild(guild.id);
})

client.on('message', message => {
    if(message.author.bot) return;
    if(message.channel.type !== 'text') return;
    const server = client.getServerByID(message.guild.id);

    if(message.channel.id === server.karaokeChannel) karaoke(client, message);

    let prefix = server.prefix;
    if(!message.content.startsWith(prefix.toLowerCase())) return;
    let command = message.content.split(/ +/)[0].slice(prefix.length);
    let args = message.content.split(/ +/).slice(prefix.split(/ +/).length);
    try{
        client.getCommand(command).execute(message, args);
    } catch (e) {
        message.channel.send(`You've recieved an error: ${e}.`);
    }
})

client.start().then(() => console.log('Initialization has completed.'));