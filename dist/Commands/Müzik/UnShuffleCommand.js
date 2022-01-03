"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
exports.command = {
    name: "karıştırma",
    aliases: ["unshuffle", "unmix"],
    description: "Sıradaki karıştırmayı geri alır.",
    usage: "karıştırma",
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
                        .setTitle(":x: Karıştırabileceğim bir sıra yok.")
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
        if (!player.get(`beforeshuffle`))
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setColor("RED")
                        .setTitle(`:x: Sıra Henüz Karıştırılmamış!`)
                        .setDescription(`Karıştırmak için: \`${prefix}karıştır\``),
                ],
            });
        player.queue.clear();
        for (const track of player.get(`beforeshuffle`))
            player.queue.add(track);
        return message.reply({
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setTitle(`✅ Sıra Karıştırılması Geri Alındı!`)
                    .setColor("RANDOM")
                    .setFooter(client.user.username, client.user.displayAvatarURL()),
            ],
        });
    },
};
