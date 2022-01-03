"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const lodash_1 = __importDefault(require("lodash"));
exports.command = {
    name: "kuyruk",
    aliases: ["sıra", "queue", "q"],
    description: "Sunucu sırasını gösterir.",
    usage: "kuyruk",
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
        let Songs = player.queue.map((t, index) => {
            t.index = index;
            return t;
        });
        let ChunkedSongs = lodash_1.default.chunk(Songs, 10); //How many songs to show per-page
        let Pages = ChunkedSongs.map((Tracks, index) => {
            let SongsDescription = Tracks.map((t) => `**${t.index + 1}.** [${t.title}](${t.uri}) - \`${(0, pretty_ms_1.default)(t.duration, {
                colonNotation: true,
            })}\``).join("\n");
            let Embed = new discord_js_1.MessageEmbed()
                .setTitle(`${message.guild.name} adlı sunucunun şarkı sırası.`)
                .setColor("RANDOM")
                .setDescription(`**Şu Anda Çalan:** \n[${player.queue.current.title}](${player.queue.current.uri}) - \`${(0, pretty_ms_1.default)(player.queue.current.duration, {
                colonNotation: true,
            })}\` \n\n**Sıradakiler:** \n${SongsDescription}\n\n`)
                .addField("Sıradaki Toplam Şarkı Sayısı: \n", `\`${player.queue.totalSize}\``, true)
                .setImage(player.queue.current.displayThumbnail("maxresdefault"));
            return Embed;
        });
        if (player.queue.totalSize === 1)
            return message.channel.send({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle(`${message.guild.name} adlı sunucunun şarkı sırası.`)
                        .setColor("RANDOM")
                        .setDescription(`**Şu Anda Çalan:** \n[${player.queue.current.title}](${player.queue.current.uri}) - \`${(0, pretty_ms_1.default)(player.queue.current.duration, {
                        colonNotation: true,
                    })}\``)
                        .addField("Sıradaki Toplam Şarkı Sayısı: \n", `\`${player.queue.totalSize}\``, true)
                        .setImage(player.queue.current.displayThumbnail("maxresdefault")),
                ],
            });
        else
            client.pagination(message, Pages, client);
    },
};
