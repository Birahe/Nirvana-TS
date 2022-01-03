"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
exports.command = {
    name: "gerile",
    aliases: ["rwd", "rewind"],
    description: "Sunucuda çalan şarkıyı geriler.",
    usage: "gerile <saniye>",
    permLevel: 0,
    category: "Müzik",
    guildOnly: true,
    cooldownBoolean: false,
    run: async function (client, message, args, prefix) {
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
        const player = client.manager.get(message.guild.id);
        if (!player)
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle(":x: Geriletebileceğim bir şarkı yok.")
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setColor("RED"),
                ],
            });
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
        if (!args[0] || isNaN(Number(args[0])))
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle(`:x: Lütfen bir sayı yazınız.`)
                        .setColor("RED")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
        let seektime = player.queue.current.duration - Number(args[0]) * 1000;
        if (seektime < 0)
            seektime = 0;
        if (seektime >=
            player.queue.current.duration * 1000 - player.queue.current.duration)
            seektime = 0;
        player.seek(seektime);
        message.reply({
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setTitle(`✅ Şarkı ${args[0]} saniye geriletildi.`)
                    .setColor("RANDOM")
                    .setFooter(client.user.username, client.user.displayAvatarURL()),
            ],
        });
    },
};
