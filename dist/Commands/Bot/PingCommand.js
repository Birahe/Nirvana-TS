"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
exports.command = {
    name: "ping",
    aliases: ["gecikme"],
    description: "Botun pingini gösterir.",
    usage: "ping",
    permLevel: 0,
    cooldownBoolean: true,
    category: "General",
    run: async function (client, message, args) {
        message.channel.send({
            embeds: [
                new discord_js_1.MessageEmbed({
                    title: `🏓Pong!Botun pingi:**${client.ws.ping}ms**`,
                    color: "RANDOM",
                    footer: {
                        text: client.user.username,
                        icon_url: client.user.displayAvatarURL(),
                    },
                }),
            ],
        });
    },
    Slash: {
        run: async function (client, interaction, args) {
            interaction.reply(`🏓Pong!Botun pingi:**${client.ws.ping}ms**`);
        },
    },
};
