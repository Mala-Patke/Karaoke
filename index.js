const Karaokebot = require('./structures/karaokebot');
const karaoke = require('./main/karaoke');

const client = new Karaokebot();

client.on('ready', client.ready);

client.on('guildCreate', guild => {
    client.registerGuild(guild.id);
})

client.on('message', message => {
    if(message.author.bot) return;

    const server = client.getServerByID(message.guild.id);

    if(message.channel.id === server.karaokeChannel) karaoke(client, message);

    let prefix = server.prefix;
    if(!message.content.startsWith(prefix.toLowerCase())) return;
    let command = client.getCommand(message.content.split(/ +/)[0].slice(prefix.length));
    let args = message.content.split(/ +/).slice(prefix.split(/ +/).length);

    try{
        command.execute(message, args);
    } catch (e) {
        message.channel.send(`You've recieved an error: ${e}.`);
    }
})

client.start().then(time => console.log(`Initialization has completed in ${time}ms`));