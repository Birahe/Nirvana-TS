"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
exports.command = {
    name: "çal",
    aliases: ["play", "p", "oynat"],
    description: "Bulunduğunuz ses kanalında şarkı çalar.",
    usage: "çal <Şarkı>",
    permLevel: 0,
    category: "Müzik",
    cooldownBoolean: false,
    guildOnly: true,
    run: async function (client, message, args, prefix) {
        try {
            const { channel } = message.member.voice;
            if (!channel)
                return message.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setTitle(":x: Bu komutu kullanmak için bir ses kanalına olmalısınız.")
                            .setColor("RED")
                            .setFooter(client.user.username, client.user.displayAvatarURL()),
                    ],
                });
            if (!args[0])
                return message.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setTitle(":x: Lütfen bir terim belirtin!")
                            .setColor("RED")
                            .setFooter(client.user.username, client.user.displayAvatarURL()),
                    ],
                });
            let player = client.manager.get(message.guild.id);
            message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("🔎 Aranıyor...")
                        .setDescription("```" + args.join(" ") + "```")
                        .setColor("BLURPLE")
                        .setFooter(client.user.username, client.user?.displayAvatarURL()),
                ],
            });
            const res = await client.manager.search(args.join(" "), message.author);
            if (!player) {
                player = client.manager.create({
                    guild: message.guild.id,
                    textChannel: message.channel.id,
                    selfDeafen: true,
                    volume: 15,
                    voiceChannel: message.member?.voice.channel?.id,
                });
                player.set("author", message.author.id);
                player.connect();
                player.queue.add(res.tracks[0]);
                player.play();
            }
            else {
                if (channel.id !== player.voiceChannel)
                    return message.reply({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setTitle(":x: Botla aynı ses kanalında değilsin!")
                                .setDescription(`Botun ses kanalı: **${client.channels.cache.get(player.voiceChannel).name}**`)
                                .setColor("RED")
                                .setFooter(client.user.username, client.user.displayAvatarURL()),
                        ],
                    });
                if (message.author.id !== player.get("author"))
                    return message.reply({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setTitle(":x: Bu komutu sadece sıra sahibi kullanabilir!")
                                .setDescription(`Sıra sahibi: **<@!${player.get("author")}>**`)
                                .setColor("RED")
                                .setFooter(client.user.username, client.user.displayAvatarURL()),
                        ],
                    });
                player.queue.add(res.tracks[0]);
                message.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setAuthor(`🎵 Şarkı Kuyruğa Eklendi: ${res.tracks[0].title}`, undefined, res.tracks[0].uri)
                            .addField("Sıradaki Yeri", String(player.queue.totalSize - 1))
                            .setColor("YELLOW")
                            .setFooter(client.user.username, client.user?.displayAvatarURL())
                            .setImage(res.tracks[0].displayThumbnail("mqdefault")),
                    ],
                });
            }
            switch (res.loadType) {
                case "NO_MATCHES":
                    if (!player.queue.current)
                        player.destroy();
                    message.reply("Şarkıyı bulamadım!");
                    break;
                case "LOAD_FAILED":
                    if (!player.queue.current)
                        player.destroy();
                    message.reply("Bir sorun oldu.Lütfen tekrar deneyin.");
                    break;
                case "PLAYLIST_LOADED":
                    player.queue.add(res.tracks);
                    message.reply({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setTitle(`🎵Playlist Kuyruğa Eklendi: [${res.playlist.name}](${args[0]})`)
                                .setColor("YELLOW")
                                .setThumbnail(res.tracks[0].displayThumbnail())
                                .addField("Şarkı Sayısı", String(res.tracks.length)),
                        ],
                    });
                    break;
            }
        }
        catch (err) {
            message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle(":x: Bir Sorun Oldu!")
                        .setDescription("```" + err + "```")
                        .setColor("RED")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
        }
    },
};
