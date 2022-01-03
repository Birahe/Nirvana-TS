import prettyMilliseconds from "pretty-ms";
import { Command } from "@interfaces/Command";
import { MessageEmbed, Snowflake, VoiceChannel } from "discord.js";
import { splitBar } from "string-progressbar";
import { getInfo } from "ytdl-core";

export const command: Command = {
  name: "çalan",
  aliases: ["np", "nowplaying", "çalıyor", "playing"],
  description: "Sunucuda çalan şarkıyı gösterir.",
  usage: "çalan",
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
    const vidDetails = await getInfo(player.queue.current!.uri!);
    let döngü = "Kapalı";
    if (player.queueRepeat) döngü = "Sıra Döngüsü" as string;
    if (player.trackRepeat) döngü = "Şarkı Döngüsü" as string;
    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`Şu An Çalan Şarkı: ${player.queue.current!.title}`)
          .setURL(player.queue.current?.uri!)
          .addField(
            "\u200b",
            `👍${vidDetails.videoDetails.likes} | 👎${vidDetails.videoDetails.dislikes} | :eye:${vidDetails.videoDetails.viewCount}`
          )
          .addField("Döngü Durumu", döngü)
          .setColor("RANDOM")
          .setThumbnail(
            player.queue.current!.displayThumbnail!("maxresdefault")
          )
          .setDescription(
            `${
              splitBar(
                Number(player.queue.current!.duration!.toFixed(0)),
                Number(player.position),
                20
              )[0]
            } - ${prettyMilliseconds(player.position, {
              colonNotation: true,
              secondsDecimalDigits: 0,
            })}/${prettyMilliseconds(player.queue.current!.duration!, {
              colonNotation: true,
              secondsDecimalDigits: 0,
            })}`
          ),
      ],
    });
  },
};
