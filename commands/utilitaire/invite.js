const Discord = require('discord.js')
const db = require('quick.db')
const {
	MessageActionRow,
	MessageButton,
	MessageMenuOption,
	MessageMenu
} = require('discord-buttons');

module.exports = {
	name: 'invites',
	aliases: ["invite"],
	run: async (client, message, args, prefix, color) => {
		let perm = ""
		message.member.roles.cache.forEach(role => {
			if (db.get(`modsp_${message.guild.id}_${role.id}`)) perm = true
			if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true
			if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = true
		})
		if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm || db.get(`channelpublic_${message.guild.id}_${message.channel.id}`) === true) {

			const use = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author
			const member = client.users.cache.get(use.id)
			let inv = db.fetch(`invites_${message.guild.id}_${member.id}`);
			let leaves = db.fetch(`leaves_${message.guild.id}_${member.id}`);
			let Regular = db.fetch(`Regular_${message.guild.id}_${member.id}`);
			const embed = new Discord.MessageEmbed()
			embed.setAuthor('Invitations')
			embed.setColor(color)
			embed.setDescription(`<@${member.id}>, Possède Actuellement **${inv || 0}** ${inv || 0 > 1 ? "Invite(s)" : "Invite(s)"}\n(**${Regular || 0}** Join(s), **${leaves || 0}** Leave(s)`)
			embed.setFooter(`${client.config.name}`)
			embed.setTimestamp()

			message.channel.send(embed);


		}
	}
}
