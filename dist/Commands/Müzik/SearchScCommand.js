"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const moment_1 = __importDefault(require("moment"));
require("moment-duration-format");
exports.command = {
    name: "arasc",
    aliases: ["searchsc", "findsc", "bulsc"],
    description: "SoundCloud'dan şarkı aratır.",
    usage: "arasc <Şarkı Adı>",
    permLevel: 0,
    guildOnly: true,
    category: "Müzik",
    cooldownBoolean: false,
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
            if (!args.join(" "))
                return message.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setTitle(":x: Lütfen bir terim belirtin!")
                            .setColor("RED")
                            .setFooter(client.user.username, client.user.displayAvatarURL()),
                    ],
                });
            let player = client.manager.get(message.guild.id);
            let msgg = await message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("<:soundcloud:826185485050970223>🔎 Aranıyor...")
                        .setDescription("```" + args.join(" ") + "```")
                        .setColor("BLURPLE")
                        .setFooter(client.user.username, client.user?.displayAvatarURL()),
                ],
            });
            let result = await client.manager.search({
                query: args.join(" "),
                source: "soundcloud",
            }, message.author);
            let searchResult = "";
            for (let i = 0; i < 10; i++) {
                try {
                    searchResult += `**${i + 1}**.[${result.tracks[i].title}](${result.tracks[i].uri}) - \`${moment_1.default
                        .duration(result.tracks[i].duration / 1000, "seconds")
                        .format()}\`\n`;
                }
                catch {
                    searchResult = "\n";
                }
            }
            let userinput;
            msgg
                .edit({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setColor("RANDOM")
                        .setTitle("Şarkı Seçimi")
                        .setFooter("Aramayı iptal etmek için iptal yazınız veya 20 saniye bekleyiniz.")
                        .setDescription(searchResult.substr(0, 2048)),
                ],
            })
                .then((msg) => {
                msg.channel
                    .awaitMessages({
                    filter: (m) => m.author.id === message.author.id,
                    max: 1,
                    time: 20000,
                    errors: ["time"],
                })
                    .then((collected) => {
                    userinput = Number(collected.first().content);
                    if (isNaN(userinput)) {
                        return message.channel.send({
                            embeds: [
                                new discord_js_1.MessageEmbed()
                                    .setTitle(`:x: | Arama İptal Edildi!`)
                                    .setColor("RED")
                                    .setFooter(client.user.username, client.user.displayAvatarURL()),
                            ],
                        });
                    }
                    if (Number(userinput) <= 0 || Number(userinput) > 10) {
                        message.channel.send("Geçersiz sayı.İlk şarkıyı oynatıyorum.");
                        userinput = 1;
                    }
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
                        player.queue.add(result.tracks[userinput - 1]);
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
                        player.queue.add(result.tracks[userinput - 1]);
                        message.reply({
                            embeds: [
                                new discord_js_1.MessageEmbed()
                                    .setAuthor(`🎵 Şarkı Kuyruğa Eklendi: ${result.tracks[userinput - 1].title}`, undefined, result.tracks[userinput - 1].uri)
                                    .setColor("YELLOW")
                                    .setFooter(client.user.username, client.user?.displayAvatarURL())
                                    .setImage(result.tracks[userinput - 1].displayThumbnail("mqdefault")),
                            ],
                        });
                    }
                    switch (result.loadType) {
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
                    }
                })
                    .catch((e) => {
                    msg.delete();
                    return message.channel.send({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setTitle(`:x: | Arama İptal! 20 Saniye Geçti!`)
                                .setColor("RED")
                                .setFooter(client.user.username, client.user.displayAvatarURL()),
                        ],
                    });
                });
            });
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
