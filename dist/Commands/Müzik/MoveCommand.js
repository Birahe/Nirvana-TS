"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
exports.command = {
    name: "move",
    aliases: [],
    description: "Sunucu sırasında bir şarkının yerini değiştirirsiniz.",
    usage: "move <eski pozisyon> <yeni pozisyon>",
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
                        .setTitle(":x: Sunucunun bir sırası yok.")
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
        if (!args[0] ||
            !args[1] ||
            isNaN(Number(args[0])) ||
            isNaN(Number(args[1])))
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("Lütfen 2 pozisyon belirtiniz.")
                        .setDescription(`Komutun kullanımı: **${prefix}${this.usage}**`)
                        .setColor("RED")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
        if (player.queue.totalSize - 1 <= 2)
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("Sırada yer değiştirebileceğin yeterli sırada şarkı yok.")
                        .setColor("RED")
                        .setFooter(client.user.username, client.user.displayAvatarURL()),
                ],
            });
        if (Number(args[0]) < 0 || Number(args[0]) > player.queue.totalSize)
            return message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle(`:x: Belirttiğiniz sayı sıradaki şarkı sayısından fazla veya 0'dan az olamaz.`)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setColor("RED"),
                ],
            });
        move(player.queue, Number(args[0]) - 1, Number(args[1]) - 1);
        message.reply({
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setTitle("✅ Yer Değiştirildi.")
                    .setDescription(`Sırayı Görüntülemek İçin **${prefix}kuyruk**`)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setColor("GREEN"),
            ],
        });
        function move(arr, old_index, new_index) {
            if (new_index >= arr.length) {
                var k = new_index - arr.length + 1;
                while (k--) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr; // for testing
        }
    },
};
