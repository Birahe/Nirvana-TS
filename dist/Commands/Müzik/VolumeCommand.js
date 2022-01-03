"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
exports.command = {
    name: "ses",
    aliases: ["volume", "vol"],
    description: "Sunucuda çalan şarkının sesini ayarlarsınız.",
    usage: "ses <Yeni Ses>",
    permLevel: 0,
    category: "Müzik",
    cooldownBoolean: false,
    guildOnly: true,
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
                        .setTitle(":x: Sunucuda çalan bir şarkı yok.")
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
                        .setTitle(":x: Lütfen bir sayı belirtin.")
                        .setColor("RED")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
        if (Number(args[0]) < 0 || Number(args[0]) > 1000)
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("Şu Anki Ses Düzeyi " + player.volume)
                        .setColor("RANDOM")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
        player.setVolume(Number(args[0]));
        message.channel.send({
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setTitle("✅ Ses Düzeyi Artık " + args[0])
                    .setColor("RANDOM")
                    .setFooter(client.user.username, client.user.displayAvatarURL()),
            ],
        });
    },
};
