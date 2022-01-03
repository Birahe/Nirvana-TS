"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const ModlogSchema_1 = __importDefault(require("../../Models/ModlogSchema"));
exports.command = {
    name: "unban",
    aliases: [],
    description: "Sunucudan yasaklanan bir kullanıcının yasaklamasını kaldırır.",
    usage: "unban <ID>",
    permLevel: 2,
    category: "Moderasyon",
    guildOnly: true,
    cooldownBoolean: false,
    run: async function (client, message, args, prefix) {
        if (!args[0])
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed({
                        title: "Lütfen bir ID belirtiniz.",
                        color: "RED",
                        footer: {
                            text: client.user.username,
                            iconURL: client.user.displayAvatarURL(),
                        },
                    }),
                ],
            });
        let kullanıcı = message.guild?.bans.cache.get(args[0]);
        if (!kullanıcı)
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed({
                        title: "Lütfen banlı bir kullanıcı belirtiniz.",
                        color: "RED",
                        footer: {
                            text: client.user.username,
                            iconURL: client.user.displayAvatarURL(),
                        },
                    }),
                ],
            });
        message.guild.members.unban(kullanıcı.user);
        const data = await ModlogSchema_1.default.findOne({ guild: message.guild.id });
        if (!data)
            return message.channel.send({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("Kullanıcı Yasaklaması Kaldırıldı")
                        .setColor("RANDOM")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
    },
};
