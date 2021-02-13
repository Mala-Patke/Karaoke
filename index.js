const Karaokebot = require('./structures/karaokebot');
const karaoke = require('./main/karaoke');

const client = new Karaokebot();

client.on('ready', client.ready);

client.on('guildCreate', guild => {
    client.registerGuild(guild.id);
})

client.on('message', message => {
    if(message.author.bot) return;

    const server = client.previewServer(message.guild.id);

    if(message.channel.id === server.karaokeChannel) {
        client.cacheServer(message.guild.id);
        return karaoke(client, message);
    }

    let prefix = server.prefix;
    if(!message.content.startsWith(prefix.toLowerCase())) return;
    client.cacheServer(message.guild.id);

    let command = client.getCommand(message.content.split(/ +/)[0].slice(prefix.length));
    if(!command) return;

    let args = message.content.split(/ +/).slice(prefix.split(/ +/).length);

    if(command.options.guildOnly && message.channel.type === 'dm')
        return message.channel.send(`The command \`${command.name}\` cannot be executed in DMs.`);
    if(command.options.requiredPermissions && !message.member.hasPermission(command.options.requiredPermissions))
        return message.channel.send(`You need the \`${command.options.requiredPermissions}\` permission to be able to run this command!`);

    try{
        command.execute(message, args);
    } catch (e) {
        message.channel.send(`You've recieved an error: ${e}.`);
    }
})

client.start().then(time => console.log(`Initialization has completed in ${time}ms`));