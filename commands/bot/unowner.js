const Discord = require('discord.js')
const db = require('quick.db')
const axios = require("axios");
const {
	MessageActionRow,
	MessageButton,
	MessageMenuOption,
	MessageMenu
} = require('discord-buttons');


module.exports = {
    name: 'unowner',
    aliases: [],
    run: async (client, message, args, prefix, color) => {

        if (client.config.owner.includes(message.author.id)) {

            if (args[0]) {
                let member = client.users.cache.get(message.author.id);
                if (args[0]) {
                    member = client.users.cache.get(args[0]);
                } else {
                    return message.channel.send(`Aucun membre trouvé pour \`${args[0] || " "}\``)

                }
                if (message.mentions.members.first()) {
                    member = client.users.cache.get(message.mentions.members.first().id);
                }
                if (!member) return message.channel.send(`Aucun membre trouvé pour \`${args[0] || " "}\``)
                if (db.get(`ownermd_${client.user.id}_${member.id}`) === null) return message.channel.send(`<@${member.id}> n'est pas owner`)
                db.delete(`ownermd_${client.user.id}_${member.id}`)
                message.channel.send(`<@${member.id}> n'est plus owner`)
            }
        }

    }
}
