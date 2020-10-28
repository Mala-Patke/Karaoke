const { MessageEmbed } = require('discord.js');

module.exports = {
    first(){
        return new MessageEmbed()
            .setTitle("Thank you for choosing Karaoke!")
            .setDescription("In a few simple prompts, we'll have your server set up with the bot.\n\nBefore we begin, please ensure that we have all required permissions")
            .addField("\u200b", "Say **cancel** to cancel\nSay anything else to continue");
    },
    second(){
        return new MessageEmbed()
            .setTitle("Step 1: Configuring a karaoke channel.")
            .setDescription("In order to begin the process, Karaoke needs a dedicated channel to begin in. This channel must not be active with any other messages for any other reason. Please mention the channel below.")
            .addField("\u200b", "Say **cancel** to cancel\nMention the channel name to continue");
    },
    third(){
        return new MessageEmbed()
            .setTitle("Step 2: Configuring a role reward")
            .setDescription("Should I give a role to a member who has last sent a message? Mention it below. WARNING: THIS ROLE WILL BE REMOVED ONCE ANOTHER USER SINGS.")
            .addField("\u200b", "Say **cancel** to cancel. Say **skip** to skip this step\nMention the role to continue.");
    },
    final(channel, role){
        let str = `karaokechannel = #${channel.name}\nsingerRole = @${role.name}`;
        return new MessageEmbed()
            .setTitle("Okay, here are the server's config settings!")
            .setDescription("```" + str + "```");
    }
}