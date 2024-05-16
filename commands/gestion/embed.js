const Discord = require('discord.js')
const db = require('quick.db')
const {
    MessageActionRow,
    MessageButton,
    MessageMenuOption,
    MessageMenu
} = require('discord-buttons');

module.exports = {
    name: 'embed',
    aliases: ["embedbuilder"],

    run: async (client, message, args, prefix, color) => {

        const filterMessage = m => message.author.id === m.author.id;
        const filter = m => message.author.id === m.author.id;
        let perm = ""
        message.member.roles.cache.forEach(role => {
            if(db.get(`admin_${message.guild.id}_${role.id}`)) perm = null
            if(db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true

        })

        if(client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {

            let menuoptions = [{
                    value: "Copier un embed",
                    description: "Permet de copier un embed déja existant sur le serveur",
                    emoji: "📥"
                },
                {
                    value: "Modifier le titre",
                    description: "Permet de choisir le titre de vôtre embed",
                    emoji: "🖊"
                },
                {
                    value: "Supprimer le titre",
                    description: "Permet De Supprimer le titre de vôtre embed",
                    emoji: "💥"
                },
                {
                    value: "Modifier la description",
                    description: "Permet de choisir la description de vôtre embed",
                    emoji: "💬"
                },
                {
                    value: "Supprimer la description",
                    description: "Permet de supprimer la description de vôtre embed",
                    emoji: "📝"
                },
                {
                    value: "Modifier l'auteur",
                    description: "Permet de choisir l'auteur de vôtre embed",
                    emoji: "🕵️"
                },
                {
                    value: "Supprimer l'auteur",
                    description: "Permet de supprimer l'auteur de vôtre embed",
                    emoji: "✂"
                },
                {
                    value: "Modifier le footer",
                    description: "Permet de choisir le footer de vôtre embed",
                    emoji: "🔻"
                },
                {
                    value: "Supprimer le footer ",
                    description: "Permet de supprimer le footer de vôtre embed",
                    emoji: "🔺"
                },
                {
                    value: "Modifier le thumbnail",
                    description: "Permet de choisir la thumbnail de vôtre embed",
                    emoji: "🔳"
                },
                {
                    value: "Modifier l'image",
                    description: "Permet de choisir l'image de vôtre embed",
                    emoji: "🖼️"
                },
                {
                    value: "Modifier l'url du titre",
                    description: "Permet de choisir l'url de vôtre embed",
                    emoji: "🌐"
                },
                {
                    value: "Modifier la couleur",
                    description: "Permet de choisir la couleur de vôtre embed",
                    emoji: "🎨"
                },
                {
                    value: "Supprimer la couleur",
                    description: "Permet de supprimer la couleur de vôtre embed",
                    emoji: "🔵"
                },


            ]
            const embedbase = new Discord.MessageEmbed()
                .setDescription("** **")
            let interactiveButtons = new MessageMenu()
                .setID(message.id + 'MenuSelection')
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder('Faix un choix');
            menuoptions.forEach(option => {
                let row = new MessageMenuOption()
                    .setLabel(option.label ? option.label : option.value)
                    .setValue(option.value)
                    .setDescription(option.description)
                    .setDefault()
                if(option.emoji) row.setEmoji(option.emoji)
                interactiveButtons.addOption(row)
            })
            const bt = new MessageButton()
                .setStyle("gray")
                .setID("embed1" + message.id)
                .setEmoji("✅")
                .setLabel("Valider")
            const bt2 = new MessageButton()
                .setStyle("gray")
                .setID("embed2" + message.id)
                .setEmoji("📑")
                .setLabel("Reset un embed")
            const bt3 = new MessageButton()
                .setStyle("gray")
                .setID("embed3" + message.id)
                .setEmoji("❌")
                .setLabel("Reformuler votre choix")

            message.channel.send({
                embed: embedbase,
                components: [

                    {
                        type: 1,
                        components: [interactiveButtons]
                    },

                    {
                        type: 1,
                        components: [bt, bt2, bt3],
                    }
                ]
            }).then(async msgg => {
                setTimeout(() => {
                    msgg.edit("", {
                        components: []
                    })
                    // message.channel.send(embeds)
                }, 60000 * 15)
                client.on('clickMenu', async (menu) => {
                    menu.reply.defer(true)
                    if(message.author !== menu.clicker.user) return;
                    menuselection(menu)
                })
                client.on('clickButton', async (button) => {
                    if(message.author !== button.clicker.user || button.message.id !== msgg.id) return;
                    if(button.id === "embed3" + message.id) {
                        button.reply.defer(true)
                        msgg.edit(msgg.embeds)
                    }
                    if(button.id === "embed1" + message.id) {
                        button.reply.defer(true)
                        let valider = await message.channel.send("Quel est **le salon ou je dois envoyer l'embed ?**")

                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 60000,
                            errors: ['time']
                        }).then(async (collected) => {
                            const lowercase = collected.first().content.toLowerCase()


                            collected.first().delete()
                            valider.delete()
                            let collect = collected.first()
                            let channel = collect.mentions.channels.first() || message.guild.channels.cache.get(collected.first().content)
                            if(!channel) {
                                return message.channel.send(`Aucun salon trouvé pour \`${collect.content}\``).then(msg => msg.delete({
                                    timeout: 10000
                                }));

                            }
                            await channel.send(embedbase)
                            message.channel.send("Embed envoyer").then(msg => msg.delete({
                                timeout: 10000
                            }))

                        }).catch(async (err) => {

                            message.channel.send("Désolé, mais je ne peux pas envoyer l'embed").then(msg => msg.delete({
                                timeout: 10000
                            }));
                        })
                    }
                    if(button.id === "embed2" + message.id) {
                        button.reply.defer(true)
                        const msgQuestionChannel_ID = await message.channel.send("Quel est **le salon ou ce trouve le message à modifier ?** (*ID*)")
                        const channel_ID = (await message.channel.awaitMessages(filterMessage, {
                            max: 1,
                            time: 60000
                        })).first();
                        msgQuestionChannel_ID.delete();
                        channel_ID.delete();
                        if(!Number(channel_ID.content) || !message.guild.channels.cache.get(channel_ID.content)) return message.channel.send(`Aucun salon trouvé pour \`${channel_id.content}\``).then(msg => msg.delete({
                            timeout: 10000
                        }));

                        const msgQuestionMessage_ID = await message.channel.send("Quel est **le message de l'embed à modifier ?** (*Une ID*)")
                        const message_ID = (await message.channel.awaitMessages(filterMessage, {
                            max: 1,
                            time: 60000
                        })).first();
                        msgQuestionMessage_ID.delete();
                        message_ID.delete();
                        if(!Number(message_ID.content) || !message.guild.channels.cache.get(channel_ID.content).messages.fetch(message_ID.content)) return message.channel.send('Message Invalide').then(msg => msg.delete({
                            timeout: 10000
                        }));

                        const msg1 = await message.guild.channels.cache.get(channel_ID.content).messages.fetch(message_ID.content)
                        message.channel.send("Embed modifier").then(msg => msg.delete({
                            timeout: 10000
                        }));
                        msg1.edit(msgg.embeds);
                    }
                })
                async function menuselection(menu) {
                    switch(menu.values[0]) {
                        case "Modifier le titre":
                            let question = await message.channel.send("Quel est **le nouveau titre de l'embed ?**")

                            message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 60000,
                                errors: ['time']
                            }).then(async (collected) => {
                                const lowercase = collected.first().content.toLowerCase()

                                collected.first().delete()
                                question.delete()
                                embedbase.setTitle(collected.first().content)
                                msgg.edit(embedbase)
                            }).catch(async (err) => {

                                message.channel.send("**Désolé mais je ne peux pas modifier le Titre !**").then(msg => msg.delete({
                                    timeout: 10000
                                }));

                            })
                            break

                        case "Supprimer le titre":
                            embedbase.setTitle("** **")
                            msgg.edit(embedbase)
                            break

                        case "Modifier la description":
                            let descriptionques = await message.channel.send("Quel est **la nouvelle description de l'embed ?**")

                            message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 60000,
                                errors: ['time']
                            }).then(async (collected) => {
                                const lowercase = collected.first().content.toLowerCase()

                                collected.first().delete()
                                descriptionques.delete()
                                embedbase.setDescription(collected.first().content)
                                msgg.edit(embedbase)
                            }).catch(async (err) => {

                                message.channel.send("**Désolé mais je ne peux pas modifier la description !**").then(msg => msg.delete({
                                    timeout: 10000
                                }));

                            })
                            break

                        case "Supprimer la description":
                            embedbase.setDescription("** **")
                            msgg.edit(embedbase)
                            break

                        case "Modifier l'auteur":
                            const embedquest = new Discord.MessageEmbed()

                            let SELAMq = await message.channel.send("Quel est **le nouveau autheur de l'embed ?**", embedquest.setDescription("Vous pouvez mentionner un **Utilisateur** pour mettre son pseudo et sont Avatar"))

                            message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 60000,
                                errors: ['time']
                            }).then(async (collected) => {
                                const lowercase = collected.first().content.toLowerCase()

                                collected.first().delete()
                                SELAMq.delete()
                                if(collected.first().mentions.users.size <= 0) {
                                    auteur = collected.first().content;
                                    const question2 = await message.channel.send("Voulez-vous ajouter un **Avatar** a votre Author, sinon entrez `non`").then(msg => msg.delete({
                                        timeout: 10000
                                    }));
                                    const auteurImg = (await message.channel.awaitMessages(filter, {
                                        max: 1,
                                        time: 60000,
                                        errors: ['time']
                                    })).first();
                                    question2.delete();
                                    auteurImg.delete();
                                    const img = auteurImg.content
                                    const liens = [
                                        "https://",
                                        "http://",
                                        "https",
                                        "http"
                                    ];
                                    if(!liens.some(word => img.includes(word))) {
                                        embedbase.setAuthor(auteur)
                                        message.channel.send("Vous avez choisi de ne pas ajouter d'Avatar a votre Author ou le lien n'est pas Valide !").then(msg => msg.delete({
                                            timeout: 10000
                                        }));

                                    }

                                    if(liens.some(word => img.includes(word))) {
                                        embedbase.setAuthor(auteur, auteurImg.content)
                                    }
                                }
                                if(collected.first().mentions.users.size > 0) {
                                    auteur = collected.first().mentions.users.first();

                                    embedbase.setAuthor(auteur.username, auteur.displayAvatarURL({
                                        dynamic: true
                                    }));
                                }
                                msgg.edit(embedbase)
                            }).catch(async (err) => {

                                message.channel.send("**Désolé mais je ne peux pas modifier l'Author !**").then(msg => msg.delete({
                                    timeout: 10000
                                }));

                            })
                            break

                        case "Supprimer l'auteur":
                            embedbase.setAuthor("** **")
                            msgg.edit(embedbase)
                            break
                        case "Modifier le footer":
                            const embedtttt = new Discord.MessageEmbed()
                            let TDCQUEST2 = await message.channel.send("Quel **Footer** voulez-vous attribuez à l'embed ?", embedtttt.setDescription("Vous pouvez mentionner un **Utilisateur** pour mettre son pseudo et sont Avatar"))

                            message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 60000,
                                errors: ['time']
                            }).then(async (collected) => {
                                const lowercase = collected.first().content.toLowerCase()

                                collected.first().delete()
                                TDCQUEST2.delete()
                                if(collected.first().mentions.users.size <= 0) {
                                    footer = collected.first().content;
                                    const question2 = await message.channel.send("Voulez-vous ajouter un **Avatar** a votre Footer, sinon entrez `non`")

                                    const footerImg = (await message.channel.awaitMessages(filter, {
                                        max: 1,
                                        time: 60000,
                                        errors: ['time']
                                    })).first();
                                    question2.delete();
                                    footerImg.delete();
                                    const img = footerImg.content
                                    const liens = [
                                        "https://",
                                        "http://",
                                        "https",
                                        "http"
                                    ];
                                    if(!liens.some(word => img.includes(word))) {
                                        embedbase.setFooter(footer)
                                        message.channel.send("Vous avez choisi de ne pas ajouter d'Avatar au Footer ou le lien n'est pas Valide !").then(msg => msg.delete({
                                            timeout: 10000
                                        }));

                                    }

                                    if(liens.some(word => img.includes(word))) {
                                        embedbase.setFooter(footer, footerImg.content)
                                    }
                                }
                                if(collected.first().mentions.users.size > 0) {
                                    footer = collected.first().mentions.users.first();

                                    embedbase.setFooter(footer.username, footer.displayAvatarURL({
                                        dynamic: true
                                    }));
                                }
                                msgg.edit(embedbase)
                            }).catch(async (err) => {

                                message.channel.send("**Désolé mais je ne peux pas modifier le Footer !**").then(msg => msg.delete({
                                    timeout: 10000
                                }));

                            })

                            break

                        case "Supprimer le footer":
                            embedbase.setFooter("** **")
                            msgg.edit(embedbase)
                            break
                        case "Modifier le thumbnail":
                            let PASDETDCMEC = await message.channel.send("Quel **Thumbnail** voulez-vous attribuez à l'embed ?")

                            message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 60000,
                                errors: ['time']
                            }).then(async (collected) => {
                                const lowercase = collected.first().content.toLowerCase()

                                const thumbnail = collected.first().content
                                const liens = [
                                    "https://",
                                    "http://",
                                    "https",
                                    "http"
                                ];
                                if(!liens.some(word => thumbnail.includes(word))) {
                                    collected.first().delete()
                                    PASDETDCMEC.delete()
                                    return message.channel.send("L'opération a été Annulée, vous devez spécifier un Lien !").then(msg => msg.delete({
                                        timeout: 10000
                                    }));

                                }


                                collected.first().delete()
                                PASDETDCMEC.delete()
                                embedbase.setThumbnail(collected.first().content)
                                msgg.edit(embedbase)
                            }).catch(async (err) => {

                                message.channel.send("**Désolé mais je ne peux pas modifier le Thumbnail !**").then(msg => msg.delete({
                                    timeout: 10000
                                }));

                            })

                            break

                        case "Supprimer le thumbnail":
                            embedbase.setThumbnail("htps://slm.com")
                            msgg.edit(embedbase)
                            break
                        case "Modifier l'image":
                            let heh1 = await message.channel.send("Quel **Image** voulez-vous attribuez à l'embed ?")

                            message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 60000,
                                errors: ['time']
                            }).then(async (collected) => {
                                const lowercase = collected.first().content.toLowerCase()

                                const image = collected.first().content
                                const liens = [
                                    "https://",
                                    "http://",
                                    "https",
                                    "http"
                                ];
                                if(!liens.some(word => image.includes(word))) {
                                    collected.first().delete()
                                    heh1.delete()
                                    return message.channel.send("L'opération a été Annulée, vous devez spécifier un Lien !").then(msg => msg.delete({
                                        timeout: 10000
                                    }));

                                }


                                collected.first().delete()
                                heh1.delete()
                                embedbase.setImage(collected.first().content, {
                                    size: 4096
                                })
                                msgg.edit(embedbase)
                            }).catch(async (err) => {

                                message.channel.send("**Désolé mais je ne peux pas modifier l'Image !**").then(msg => msg.delete({
                                    timeout: 10000
                                }));

                            })
                            break

                        case "Supprimer l'image":
                            embedbase.setImage("htps://slm.com")
                            msgg.edit(embedbase)
                            break

                        case "Modifier l'url du titre":
                            let WASSIMLEMAITRE = await message.channel.send("Quel **URL** voulez-vous attribuez à l'embed ?")

                            message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 60000,
                                errors: ['time']
                            }).then(async (collected) => {
                                const lowercase = collected.first().content.toLowerCase()

                                const url = collected.first().content
                                const liens = [
                                    "https://",
                                    "http://",
                                    "https",
                                    "http"
                                ];
                                if(!liens.some(word => url.includes(word))) {
                                    collected.first().delete()
                                    WASSIMLEMAITRE.delete()
                                    return message.channel.send("L'opération a été Annulée, vous devez spécifier un Lien !").then(msg => msg.delete({
                                        timeout: 10000
                                    }));

                                }


                                collected.first().delete()
                                WASSIMLEMAITRE.delete()
                                embedbase.setURL(collected.first().content)
                                msgg.edit(embedbase)
                            }).catch(async (err) => {

                                message.channel.send("**Désolé mais je ne peux pas modifier l'Url !**").then(msg => msg.delete({
                                    timeout: 10000
                                }));

                            })
                            break

                        case "Supprimer l'url du titre":
                            embedbase.setURL("htps://")
                            msgg.edit(embedbase)
                            break
                        case "Supprimer l'image":
                            embedbase.setImage("** **")
                            msgg.edit(embedbase)
                            break

                        case "Modifier la couleur":
                            let HEHEHHE = await message.channel.send("Quel **Couleur** voulez-vous attribuez à l'embed ?")

                            message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 60000,
                                errors: ['time']
                            }).then(async (collected) => {
                                const lowercase = collected.first().content.toLowerCase()


                                collected.first().delete()
                                HEHEHHE.delete()
                                embedbase.setColor(collected.first().content)
                                msgg.edit(embedbase)
                            }).catch(async (err) => {

                                message.channel.send("**Désolé mais je ne peux pas modifier la Couleur !**").then(msg => msg.delete({
                                    timeout: 10000
                                }));

                            })
                            break

                        case "Supprimer la couleur":
                            embedbase.setColor("WASSIM")
                            msgg.edit(embedbase)
                            break



                        case "Copier un embed":
                            const channID = await message.channel.send("Quel est **le salon ou ce trouve le message à copier ?** (*ID*)")
                            const channel_id = (await message.channel.awaitMessages(filterMessage, {
                                max: 1,
                                time: 60000
                            })).first();
                            channID.delete();
                            channel_id.delete();
                            if(!Number(channel_id.content) || !message.guild.channels.cache.get(channel_id.content)) return message.channel.send(`Aucun salon trouvé pour \`${channel_id.content}\``).then(msg => msg.delete({
                                timeout: 10000
                            }));

                            const msgQuestionMessageID = await message.channel.send("Quel est **le message de l'embed à copier ?** (*Une ID*)")
                            const message_id = (await message.channel.awaitMessages(filterMessage, {
                                max: 1,
                                time: 60000
                            })).first();
                            msgQuestionMessageID.delete();
                            message_id.delete();
                            if(!Number(message_id.content) || !message.guild.channels.cache.get(channel_id.content).messages.fetch(message_id.content)) return message.channel.send('Message Invalide').then(msg => msg.delete({
                                timeout: 10000
                            }));

                            const msg = await message.guild.channels.cache.get(channel_id.content).messages.fetch(message_id.content);
                            if(msg.embeds.length === 0) return message.channel.send("Ce message n'est pas un embed").then(msg => msg.delete({
                                timeout: 10000
                            }));

                            if(msg.partial) {
                                try {
                                    await msg.fetch()
                                } catch {
                                    return
                                }
                            }
                            msgg.edit({
                                embed: msg.embeds[0].toJSON()
                            })

                            break


                    }
                }



            })
        }


    }
}
