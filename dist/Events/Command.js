"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
const moment_1 = __importDefault(require("moment"));
require("moment-duration-format");
exports.event = {
    name: "messageCreate",
    run: async function (client, message) {
        const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
        let prefix = message.content.match(prefixMention)
            ? message.content.match(prefixMention)[0]
            : await client.getPrefix(message);
        if (message.author.bot || !message.content.startsWith(prefix))
            return;
        const command = message.content
            .slice(prefix.length)
            .split(" ")[0]
            .toLowerCase();
        const params = message.content.slice(prefix.length).split(" ").slice(1);
        let cmd;
        if (client.commands.has(command)) {
            cmd = client.commands.get(command);
        }
        else if (client.aliases.has(command)) {
            cmd = client.aliases.get(command);
        }
        if (cmd) {
            if (cmd.guildOnly) {
                if (!message.guild)
                    return message.reply({
                        embeds: [
                            new discord_js_1.MessageEmbed({
                                title: ":x: Bu komut sadece sunucularda kullanılabilir.",
                                color: "RED",
                                footer: {
                                    text: message.author.tag,
                                    iconURL: message.author.displayAvatarURL({ dynamic: true }),
                                },
                            }),
                        ],
                    });
                let perms = await client.elevation(message);
                if (perms < cmd.permLevel)
                    return message.reply(":x: Bu komutu kullanmaya yetkin yok!");
                try {
                    if (cmd.cooldownBoolean) {
                        const { cooldowns } = client;
                        if (!cooldowns.has(cmd.name)) {
                            cooldowns.set(cmd.name, new discord_js_1.Collection());
                        }
                        const now = Date.now();
                        const timestamps = cooldowns.get(cmd.name);
                        const cooldownAmount = (cmd.cooldown || 3) * 1000;
                        if (timestamps.has(message.author.id)) {
                            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                            if (now < expirationTime) {
                                const timeLeft = expirationTime - now;
                                const seksizaman = moment_1.default
                                    .duration(timeLeft, "milliseconds")
                                    .format("H [saat], m [dakika], s [saniye]");
                                return message.reply(`:x: Bu komutu kullanmak için **${seksizaman}** saniye daha beklemelisin.`);
                            }
                        }
                        timestamps.set(message.author.id, now);
                        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
                        cmd.run(client, message, params, prefix);
                    }
                    else {
                        cmd.run(client, message, params, prefix);
                    }
                }
                catch (err) {
                    message.reply({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setTitle(":x: Bir Hata Oldu")
                                .setColor("RED")
                                .setDescription("````" + err + "```")
                                .setFooter(client.user.username, client.user.displayAvatarURL()),
                        ],
                    });
                }
            }
            else {
                if (message.guild) {
                    let perms = await client.elevation(message);
                    if (perms < cmd.permLevel)
                        return message.reply(":x: Bu komutu kullanmaya yetkin yok!");
                    try {
                        if (cmd.cooldownBoolean) {
                            const { cooldowns } = client;
                            if (!cooldowns.has(cmd.name)) {
                                cooldowns.set(cmd.name, new discord_js_1.Collection());
                            }
                            const now = Date.now();
                            const timestamps = cooldowns.get(cmd.name);
                            const cooldownAmount = (cmd.cooldown || 3) * 1000;
                            if (timestamps.has(message.author.id)) {
                                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                                if (now < expirationTime) {
                                    const timeLeft = expirationTime - now;
                                    const seksizaman = moment_1.default
                                        .duration(timeLeft, "milliseconds")
                                        .format("H [saat], m [dakika], s [saniye]");
                                    return message.reply(`:x: Bu komutu kullanmak için **${seksizaman}** saniye daha beklemelisin.`);
                                }
                            }
                            timestamps.set(message.author.id, now);
                            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
                            cmd.run(client, message, params, prefix);
                        }
                        else {
                            cmd.run(client, message, params, prefix);
                        }
                    }
                    catch (err) {
                        message.reply({
                            embeds: [
                                new discord_js_1.MessageEmbed()
                                    .setTitle(":x: Bir Hata Oldu")
                                    .setColor("RED")
                                    .setDescription("````" + err + "```")
                                    .setFooter(client.user.username, client.user.displayAvatarURL()),
                            ],
                        });
                    }
                }
                else {
                    cmd.run(client, message, params, prefix);
                }
            }
        }
        else {
            message.channel.send({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle(`:x: Böyle bir komut bulunamadı!`)
                        .setDescription(`Tüm komutlara ulaşmak için ${prefix}yardım`)
                        .setColor("RED")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
        }
    },
};
