"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = (client) => {
    client.manager.on("queueEnd", (player) => {
        client.channels.cache.get(player.textChannel).send({
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setTitle("Kuyruğun Sonuna Geldin!")
                    .setColor("BLURPLE")
                    .setFooter(client.user?.username, client.user?.displayAvatarURL()),
            ],
        });
        player.destroy();
    });
};
