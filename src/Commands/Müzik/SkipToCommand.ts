import { Command } from "@interfaces/Command";
import { MessageEmbed, Snowflake, VoiceChannel } from "discord.js";
export const command: Command = {
  name: "atla",
  aliases: ["skipto"],
  description: "Sunucu sırasında bir şarkıya atlar.",
  usage: "atla <sayı>",
  permLevel: 0,
  category: "Müzik",
  cooldownBoolean: false,
  guildOnly: true,
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
            .setTitle(":x: Atlayabileceğim bir sıra yok.")
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
    const pos = Number(args[0]);
    if (!pos || isNaN(pos))
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(":x: Lütfen bir sayı belirtin.")
            .setFooter(client.user!.username, client.user!.displayAvatarURL())
            .setColor("RED"),
        ],
      });
    if (pos <= 0 || pos > player.queue.length)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(":x: Lütfen bir sayı belirtin.")
            .setFooter(client.user!.username, client.user!.displayAvatarURL())
            .setColor("RED"),
        ],
      });
    player.stop(pos);
    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`✅ ${pos}. Şarkıya Atlandı`)
          .setColor("GREEN")
          .setFooter(client.user!.username, client.user!.displayAvatarURL()),
      ],
    });
  },
};
