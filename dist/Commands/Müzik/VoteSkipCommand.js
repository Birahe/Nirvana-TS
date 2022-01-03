"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
exports.command = {
    name: "geç",
    aliases: ["skip", "voteskip", "vote", "s"],
    description: "Sunucuda çalan şarkıyı geçmek için oylama yaparsınız.",
    usage: "geç",
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
                        .setTitle(":x: Geçebileceğim bir şarkı yok.")
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
        let votes = player.get(`votes-${message.guild.id}`);
        if (votes.includes(message.author))
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle(":x: Zaten Oy Vermişsiniz.")
                        .setColor("RED")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
        let channelmembersize = channel.members.size;
        let voteamount = 0;
        if (channelmembersize <= 3)
            voteamount = 1;
        voteamount = Math.ceil(channelmembersize / 3);
        votes.push(message.author);
        if (voteamount <= votes.length) {
            message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("✅ Oyunuz Eklendi!")
                        .setDescription("**⏩ Gereken Oy Sayısına Ulaşıldı.Şarkı Geçiliyor.**")
                        .setColor("DARK_BLUE")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
            player.stop();
        }
        else {
            message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("✅ Oyunuz Eklendi!")
                        .setDescription(`Şu Anki Oy Sayısı: **${votes.length}/${voteamount}**`)
                        .setColor("DARK_BLUE")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
            player.set(`votes-${player.guild}`, votes);
        }
    },
};
