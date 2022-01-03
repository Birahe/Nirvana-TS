"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const ModlogSchema_1 = __importDefault(require("../../Models/ModlogSchema"));
exports.command = {
    name: "modlog",
    aliases: ["log", "modlog-kanal"],
    description: "Sunucu olaylarının gönderileceği kanalı belirlersiniz.",
    usage: "modlog #kanal",
    permLevel: 2,
    category: "Moderasyon",
    cooldownBoolean: false,
    guildOnly: true,
    run: async function (client, message, args, prefix) {
        if (!args[0])
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle(":x: Lütfen bir kanal veya işlem belirtin.")
                        .setColor("RED")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
        if (args[0] === "sil") {
            const data = await ModlogSchema_1.default.findOne({ guild: message.guild.id });
            if (!data)
                return message.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setTitle(":x: Silebileceğim bir veri yok.")
                            .setColor("RED")
                            .setFooter(client.user.username, client.user.displayAvatarURL()),
                    ],
                });
            await ModlogSchema_1.default
                .findOneAndDelete({ guild: message.guild.id })
                .catch(console.error);
            message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("Modlog kanalı başarıyla sıfırlandı.")
                        .setColor("RANDOM")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
        }
        else if (args[0] === "göster") {
            const data = await ModlogSchema_1.default.findOne({ guild: message.guild.id });
            if (!data)
                return message.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setTitle(":x: Gösterebileceğim bir veri yok.")
                            .setColor("RED")
                            .setFooter(client.user.username, client.user.displayAvatarURL()),
                    ],
                });
            message.reply(`Sunucunun modlog kanalı: <#${data.channel}>`);
        }
        else {
            const kanal = message.mentions.channels.first() ||
                client.channels.cache.get(args[0]);
            if (!kanal)
                return message.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setTitle(":x: Lütfen bir kanal belirtin.")
                            .setFooter(message.author.username, message.author.displayAvatarURL())
                            .setColor("RED"),
                    ],
                });
            const data = await ModlogSchema_1.default.findOne({ guild: message.guild.id });
            if (data) {
                data.channel = kanal.id;
                data.save();
                message.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setDescription(`**Sunucunun modlog kanalı ${kanal} olarak değiştirildi.**`)
                            .setColor("RANDOM")
                            .setFooter(client.user.username, client.user.displayAvatarURL()),
                    ],
                });
            }
            else {
                await ModlogSchema_1.default.create({ guild: message.guild.id, channel: kanal.id });
                message.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setDescription(`**Sunucunun modlog kanalı ${kanal} olarak ayarlandı.**`)
                            .setColor("RANDOM")
                            .setFooter(client.user.username, client.user.displayAvatarURL()),
                    ],
                });
            }
        }
    },
};
