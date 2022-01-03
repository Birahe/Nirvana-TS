import { Command } from "@interfaces/Command";
import { MessageEmbed, Snowflake, VoiceChannel } from "discord.js";
export const command: Command = {
  name: "ilerle",
  aliases: ["fwd", "forward"],
  description: "Sunucuda çalan şarkıyı ilerletir.",
  usage: "ilerle <saniye>",
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
            .setTitle(":x: İlerletebileceğim bir şarkı yok.")
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
    if (!args[0] || isNaN(Number(args[0])))
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`:x: Lütfen bir sayı yazınız.`)
            .setColor("RED")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    let seektime = player.position + Number(args[0]) * 1000;
    if (seektime < 0) seektime = player.queue.current?.duration! * 1000;
    if (seektime >= player.queue.current?.duration! * 1000)
      seektime = player.queue.current?.duration! * 1000 - 1000;
    player.seek(seektime);
    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`✅ Şarkı ${args[0]} saniye ilerletildi.`)
          .setColor("RANDOM")
          .setFooter(client.user!.username, client.user!.displayAvatarURL()),
      ],
    });
  },
};
