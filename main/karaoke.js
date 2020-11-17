const { MessageEmbed } = require('discord.js');
const parseLyrics = require('./parseLyrics');

/**
 * I have no idea what I'm doing send help
 * 
 * @param {import('../structures/karaokebot')} client
 * @param {import('discord.js').Message} message
 * @returns {void}
 */
function karaoke(client, message){
    const server = client.getServerByID(message.guild.id);

    if(!server.song){
        return message.delete()
            .then(() => {
                message.author.send('No song is set! Contact a server admin if you\'d like one to be set');
            });
    }

    //Check if user has rolereward
    if(server.lastSinger && message.author.id === server.lastSinger){
        return message.delete()
            .then(() => {
                message.author.send('Hey, you just sang! Give someone else a turn.');
            })
    }

    let lyricsline = server.song.split('\n')[server.line];
    let localline = parseLyrics(message.content);

    //check for banned words
    for(let i in server.bannedwords){
        lyricsline.replace(i, '*'.repeat(i.length));
        lyricsline.replace(i, '*'.repeat(i.length));
    }

    //Handle Incorrect Line
    if(lyricsline !== localline){
        return message.delete()
            .then(() => {
                message.author.send(
                    new MessageEmbed()
                        .setTitle('Error: Lines do not match.')
                        .setDescription(`Expected line: \`${lyricsline}\`\nYour Line: \`${localline}\``)
                        .setFooter('If you think this was a mistake, tell the owner')
                        .setColor('RED')
                )
            })
    }

    //Increment user and guild counts
    server.incrementMemberCount(message.author.id);
    server.set('lastSingerID', message.author.id);
    message.member.roles.add(server.roleReward);
    client.guildata.increment(message.guild.id, 'currentLine', 1);
    

    //Handle Song Completion
    if(server.song.length <= server.line){
        let finishtime = new Date(Date.now() - server.startTime);
        //Kill all of the database instances
        server.set('currentSong', null);
        server.set('currentLine', 0);
        server.set('lastSingerID', null);

        //Announce song has been complete
        message.guild.channels.cache.get(server.karaokeChannel).send(
            new MessageEmbed()
                .setTitle('Congrats! You\'ve completed the song!')
                .setDescription(`The song ${server.songName} has been completed in ${finishtime.getHours()} hours, ${finishtime.getMinutes} minutes, and ${finishtime.getSeconds()}`)
                .setFooter(`You can set a new song with the ${server.prefix}setsong command.`)
                .setColor('GREEN')
        );
    }


}

module.exports = karaoke;