"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const discord_js_1 = require("discord.js");
const string_progressbar_1 = require("string-progressbar");
const ytdl_core_1 = require("ytdl-core");
exports.command = {
    name: "çalan",
    aliases: ["np", "nowplaying", "çalıyor", "playing"],
    description: "Sunucuda çalan şarkıyı gösterir.",
    usage: "çalan",
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
                        .setTitle(":x: Bitirebileceğim bir sıra yok.")
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
        const vidDetails = await (0, ytdl_core_1.getInfo)(player.queue.current.uri);
        let döngü = "Kapalı";
        if (player.queueRepeat)
            döngü = "Sıra Döngüsü";
        if (player.trackRepeat)
            döngü = "Şarkı Döngüsü";
        message.reply({
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setTitle(`Şu An Çalan Şarkı: ${player.queue.current.title}`)
                    .setURL(player.queue.current?.uri)
                    .addField("\u200b", `👍${vidDetails.videoDetails.likes} | 👎${vidDetails.videoDetails.dislikes} | :eye:${vidDetails.videoDetails.viewCount}`)
                    .addField("Döngü Durumu", döngü)
                    .setColor("RANDOM")
                    .setThumbnail(player.queue.current.displayThumbnail("maxresdefault"))
                    .setDescription(`${(0, string_progressbar_1.splitBar)(Number(player.queue.current.duration.toFixed(0)), Number(player.position), 20)[0]} - ${(0, pretty_ms_1.default)(player.position, {
                    colonNotation: true,
                    secondsDecimalDigits: 0,
                })}/${(0, pretty_ms_1.default)(player.queue.current.duration, {
                    colonNotation: true,
                    secondsDecimalDigits: 0,
                })}`),
            ],
        });
    },
};
