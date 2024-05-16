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
	name: 'botinfo',
	aliases: ['infobot', 'uptime'],
	run: async (client, message, args, prefix, color) => {

		if (client.config.owner.includes(message.author.id)) {

            const embed = new Discord.MessageEmbed()

            embed.setTitle(`Information à Propos De : ${client.user.username}`)
            embed.setURL('https://discord.gg/nezeriarp')
            embed.setDescription('**Une description complète et détaillée du Bot** <@1107383816517062817>')
            embed.setColor(color)
            .setThumbnail(message.author.avatarURL({ dynamic:true }));
            embed.setTimestamp()
            embed.setFooter(`${client.config.name}`)
            embed.addFields(
                { name: '👑 Owner / Developer :', value: '<@991399165005406289>', inline: true },
                { name: '🔌 Latence Ping Bot :', value: `\`${client.ws.ping}Ms\`` },
                { name: '🚀 Total Server(s) :', value: `\`${client.guilds.cache.size}\``, inline: true },
                { name: '👥 Total User(s) :', value: `\`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\``, inline: true },
                { name: '📞 Support :', value: `[Clique ICI Pour Rejoindre Le Support](https://discord.gg/nezeriarp)`, inline: true },
                { name: '📗 Node.js Version :', value: `\`${process.version}\``, inline: true },
                { name: "📚 Discord.js Version :", value: `\`${Discord.version}\``, inline: true },
                { name: "🟢 Uptime :", value: `<t:${(Date.now()-client.uptime).toString().slice(0, -3)}:R>`, inline: true }, 
            )

            message.channel.send(embed);
        }

    }
}

