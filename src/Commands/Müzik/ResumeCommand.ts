import { MessageEmbed, Snowflake, VoiceChannel } from "discord.js";
import { Command } from "@interfaces/Command";
export const command: Command = {
  name: "devam",
  aliases: ["resume", "res"],
  description: "Durdurulmuş şarkıyı devam ettirir.",
  usage: "devam",
  permLevel: 0,
  category: "Müzik",
  guildOnly: true,
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
            .setTitle(":x: Sunucunun bir sırası yok.")
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
    if (!player.paused)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(":x: Şarkı zaten çalıyor.")
            .setFooter(client.user!.username, client.user!.displayAvatarURL())
            .setColor("RED"),
        ],
      });
    player.pause(false);
    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("✅ Şarkı Devam Ettirildi.")
          .setColor("GREEN")
          .setFooter(client.user!.username, client.user!.displayAvatarURL()),
      ],
    });
  },
};
