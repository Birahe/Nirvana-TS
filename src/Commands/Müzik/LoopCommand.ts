import { Snowflake, VoiceChannel } from "discord.js";
import { MessageEmbed } from "discord.js";
import { Command } from "@interfaces/Command";
export const command: Command = {
  name: "döngü",
  aliases: ["tekrar", "loop"],
  description: "Sunucuda çalan şarkıyı/sırayı döngüye alırsınız.",
  usage: "döngü <şarkı | sıra>",
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
            .setTitle(":x: Döngüye alabileceğim bir sıra veya şarkı yok.")
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
    if (!args[0] || !["sıra", "şarkı"].includes(args[0].toLowerCase()))
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(":x: Lütfen geçerli bir seçenek belirtiniz.")
            .setDescription("Geçerli Seçenekler: **sıra/şarkı**")
            .setColor("RED")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    if (args[0] === "sıra") {
      player.setTrackRepeat(false);
      player.queueRepeat != player.queueRepeat;
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(
              `Sıranın Döngüsü Şu Anda ${
                player.queueRepeat ? "Açık" : "Kapalı"
              }`
            )
            .setColor("RANDOM")
            .setFooter(client.user!.username, client.user?.displayAvatarURL()),
        ],
      });
    } else {
      player.setQueueRepeat(false);
      player.trackRepeat != player.trackRepeat;
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(
              `Şarkı Döngüsü Şu Anda ${player.trackRepeat ? "Açık" : "Kapalı"}`
            )
            .setColor("RANDOM")
            .setFooter(client.user!.username, client.user?.displayAvatarURL()),
        ],
      });
    }
  },
};
