"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const ModlogSchema_1 = __importDefault(require("../../Models/ModlogSchema"));
exports.command = {
    name: "at",
    aliases: ["kick"],
    description: "Sunucudaki bir kişiyi yasaklar.",
    usage: "at <Kullanıcı> [neden]",
    permLevel: 2,
    category: "Moderasyon",
    cooldownBoolean: false,
    guildOnly: true,
    run: async function (client, message, args, prefix) {
        let kullanıcı = message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);
        if (!kullanıcı)
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle(":x: Lütfen bir kullanıcı belirtiniz.")
                        .setColor("RED")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
        if (kullanıcı.roles.highest.position >= message.member.roles.highest.position)
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle(":x: Bu kullanıcıyı banlama yetkisine sahip değilsiniz.")
                        .setColor("RED")
                        .setFooter(message.author.username, message.author.displayAvatarURL()),
                ],
            });
        if (kullanıcı.roles.highest.position >=
            message.guild.me.roles.highest.position)
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle(":x: Bu kullanıcıyı banlama yetkisine sahip değilim.")
                        .setColor("RED")
                        .setFooter(message.author.username, message.author.displayAvatarURL()),
                ],
            });
        const reason = args.slice(1).join(" ") || "Belirtilmemiş";
        kullanıcı.kick(reason);
        const data = await ModlogSchema_1.default.findOne({ guild: message.guild.id });
        if (!data)
            return message.channel.send({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("Kullanıcı Atıldı")
                        .setColor("RANDOM")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
        client.channels.cache.get(data.channel).send({
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setTitle("Kullanıcı Atıldı")
                    .addField("Kullanıcı", `\`${kullanıcı.user.tag}\`(${kullanıcı.user.id})`)
                    .addField("Neden", reason)
                    .setColor("RED")
                    .setAuthor(message.guild.name, message.guild?.iconURL()),
            ],
        });
    },
};
