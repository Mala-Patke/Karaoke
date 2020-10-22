const { Guild, Message, GuildMember, TextChannel, Collection } = require("discord.js");
const KaraokeBot = require('./karaokebot');

module.exports = class Server extends Guild{

    /**
     * @param {Guild} guild 
     * @param {string} prefix 
     * @param {TextChannel} karaokechannel 
     */
    constructor(client, guildoptions = {}, guild, prefix, karaokechannel){
        super(client, guildoptions)
        this.guild = guild;
        this.prefix = prefix || 'k+';
        this.karaokechannel = karaokechannel || null;
    }
    
    /**
     * @param {Message} message 
     * @returns {Server}
     */
    static serverfrommessage(message){
        return new Server(message.client, {}, message.guild);
    }

    /**
     * @param {GuildMember} member 
     * @returns {Server}
     */
    static serverfrommember(member){
        return new Server(member.client, {}, member.guild);
    }

    /**
     * @param {KaraokeBot} client 
     * @returns {Collection<string,Server>}
     */
    static serversfromclient(client){
        const ret = new Collection();
        client.guilds.cache.forEach(guild => ret.set(guild.id, new Server(client, {}, guild)));
        return ret;
    }

    /**
     * @returns {String}
     */
    get getPrefix(){
        return this.prefix;
    }

}