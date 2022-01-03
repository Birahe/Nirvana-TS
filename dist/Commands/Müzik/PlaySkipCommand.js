"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
exports.command = {
    name: "değiştir",
    aliases: ["playskip", "ps"],
    description: "Sunucuda çalan şarkıyı değiştirir.",
    usage: "değiştir <Yeni Şarkı>",
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
                        .setTitle(":x: Değiştirebileceğim bir şarkı yok.")
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
        if (!args[0])
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle(":x: Lütfen bir terim belirtin!")
                        .setColor("RED")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
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
        player.queue.unshift(res.tracks[0]);
        player.stop();
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
                message.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setTitle(":x: Bu Komut Playlist'leri desteklemiyor.")
                            .setColor("RED")
                            .setFooter(client.user.username, client.user.displayAvatarURL()),
                    ],
                });
                break;
        }
    },
};
