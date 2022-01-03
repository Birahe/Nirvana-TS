"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const lodash_1 = __importDefault(require("lodash"));
exports.command = {
    name: "sözler",
    aliases: ["ly", "lyrics"],
    description: "Sunucuda çalan şarkının sözlerini gösterir.",
    usage: "sözler",
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
                        .setTitle(":x: Gösterebileceğim bir şarkı yok.")
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
        const songTitle = player.queue.current?.title;
        let lyrics = await lyricsFinder(songTitle);
        if (!lyrics)
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle(`${songTitle} için bir şarkı sözü bulunamadı.`)
                        .setColor("RED")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
        lyrics = lyrics.split("\n");
        let SplitedLyrics = lodash_1.default.chunk(lyrics, 40);
        let Pages = SplitedLyrics.map((ly) => {
            let em = new discord_js_1.MessageEmbed()
                .setAuthor(`Şarkı Sözleri: ${songTitle}`, "")
                .setColor("RANDOM")
                .setDescription(ly.join("\n"));
            if (args.join(" ") !== songTitle)
                em.setThumbnail(player.queue.current?.displayThumbnail("maxresdefault"));
            return em;
        });
        if (!Pages.length || Pages.length === 1)
            return message.channel.send({ embeds: [Pages[0]] });
        else
            return client.pagination(message, Pages, client);
    },
};
