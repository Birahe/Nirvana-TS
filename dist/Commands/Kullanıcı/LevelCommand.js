"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const Level_1 = __importDefault(require("../../Models/Level"));
exports.command = {
    name: "level",
    aliases: ["seviye", "lvl"],
    description: "Kullanıcının sunucudaki seviyesini gösterir.",
    usage: "level [kullanıcı]",
    permLevel: 0,
    guildOnly: true,
    category: "Kullanıcı",
    cooldownBoolean: true,
    run: async function (client, message, args, prefix) {
        let kullanıcı = message.mentions.users.first() || message.author;
        const data = await Level_1.default.findOne({
            guild: message.guild.id,
        });
        if (!data)
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed({
                        title: ":x: Bu kullanıcının bir seviyesi yok, garip.",
                        color: "RED",
                        footer: {
                            text: kullanıcı.tag,
                            iconURL: kullanıcı.displayAvatarURL({ dynamic: true }),
                        },
                    }),
                ],
            });
        message.channel.send({
            embeds: [
                new discord_js_1.MessageEmbed({
                    author: {
                        name: `${kullanıcı.tag} Adlı Kullanıcının Seviyesi`,
                        iconURL: kullanıcı.displayAvatarURL({ dynamic: true }),
                    },
                    fields: [
                        {
                            name: "Seviye",
                            value: `${data.lvl}`,
                        },
                        {
                            name: "Deneyim Puanı",
                            value: `${data.xp}`,
                        },
                        {
                            name: "Seviye İçin Gerekli Deneyim Puanı",
                            value: `${data.xpToLvl - data.xp}`,
                        },
                    ],
                }),
            ],
        });
    },
};
