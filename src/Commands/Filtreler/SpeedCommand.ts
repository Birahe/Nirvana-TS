import { Command } from "@interfaces/Command";
import { MessageEmbed, Snowflake, VoiceChannel } from "discord.js";
export const command: Command = {
  name: "hız",
  aliases: ["speed", "hiz"],
  description: "Sunucuda çalan şarkının hızını değiştirirsiniz.",
  usage: "hız <Yeni Hız>",
  guildOnly: true,
  permLevel: 0,
  category: "Filtreler",
  cooldownBoolean: false,
  run: async function (client, message, args, prefix) {
    const { channel } = message.member!.voice;
    if (!channel)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(
              ":x: Bu komutu kullanmak için bir ses kanalına olmalısınız."
            )
            .setColor("RED")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    const player = client.manager.get(message.guild!.id);
    if (!player)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(":x: Bitirebileceğim bir sıra yok.")
            .setFooter(client.user!.username, client.user!.displayAvatarURL())
            .setColor("RED"),
        ],
      });
    if (channel.id !== player.voiceChannel)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(":x: Botla aynı ses kanalında değilsin!")
            .setDescription(
              `Botun ses kanalı: **${
                (
                  client.channels.cache.get(
                    player.voiceChannel as Snowflake
                  )! as VoiceChannel
                ).name
              }**`
            )
            .setColor("RED")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    if (message.author.id !== player.get("author"))
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(":x: Bu komutu sadece sıra sahibi kullanabilir!")
            .setDescription(`Sıra sahibi: **<@!${player.get("author")}>**`)
            .setColor("RED")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    let hız: Number = Number(args[0]);
    if (!args[0] || isNaN(Number(args[0])) || Number(args[0]) <= 0) {
      hız = 1;
      message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(
              ":x: Geçersiz bir sayı girdiniz. Değeri varsayılan olarak alıyorum."
            )
            .setColor("RED")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    }
    try {
      player.node.send({
        op: "filters",
        guildId: player.guild,
        timescale: {
          speed: hız,
        },
      });
      message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`✅ Oynatma Hızı ${hız} Olarak Ayarlandı.`)
            .setColor("RED")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    } catch (e) {
      message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(":x: Bir Hata Oldu!")
            .setColor("RED")
            .setDescription(`\`\`\`${e}\`\`\``)
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    }
  },
};
