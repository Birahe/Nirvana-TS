"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = (client) => {
    client.manager.on("trackStart", (player, track) => {
        player.set(`votes-${player.guild}`, []);
        let döngü = "Kapalı";
        if (player.queueRepeat)
            döngü = "Sıra Döngüsü";
        if (player.trackRepeat)
            döngü = "Şarkı Döngüsü";
        client.channels.cache.get(player.textChannel).send({
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setAuthor(`🎵Şarkı Çalıyor: ${track.title}`)
                    .setURL(track.uri)
                    .setImage(track.displayThumbnail("mqdefault"))
                    .addField("Döngü Durumu", döngü)
                    .setColor("ORANGE")
                    .setFooter(client.user.username, client.user.displayAvatarURL()),
            ],
        });
    });
};
