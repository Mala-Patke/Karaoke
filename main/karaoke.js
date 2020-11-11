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
    let lyricsline = server.song.split('\n')[server.line+1];
    let localline = parseLyrics(message.content);
    
    /*
        Things that need to be checked
        - Bannedwords
        - funny/optional characters
    */
    if(message.split(/ +/).find(elem => server.bannedwords.includes(elem))) return message.delete();
}

module.exports = karaoke;