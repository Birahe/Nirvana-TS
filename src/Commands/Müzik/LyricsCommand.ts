import { Snowflake, VoiceChannel } from "discord.js";
import { MessageEmbed } from "discord.js";
import { Command } from "@interfaces/Command";
const lyricsFinder = require("lyrics-finder");
import _ from "lodash";
export const command: Command = {
  name: "sözler",
  aliases: ["ly", "lyrics"],
  description: "Sunucuda çalan şarkının sözlerini gösterir.",
  usage: "sözler",
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
            .setTitle(":x: Gösterebileceğim bir şarkı yok.")
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
    const songTitle = player.queue.current?.title;
    let lyrics = await lyricsFinder(songTitle);
    if (!lyrics)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`${songTitle} için bir şarkı sözü bulunamadı.`)
            .setColor("RED")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    lyrics = lyrics.split("\n");
    let SplitedLyrics = _.chunk(lyrics, 40);
    let Pages = SplitedLyrics.map((ly) => {
      let em = new MessageEmbed()
        .setAuthor(`Şarkı Sözleri: ${songTitle}`, "")
        .setColor("RANDOM")
        .setDescription(ly.join("\n"));

      if (args.join(" ") !== songTitle)
        em.setThumbnail(
          player.queue.current?.displayThumbnail!("maxresdefault")!
        );

      return em;
    });

    if (!Pages.length || Pages.length === 1)
      return message.channel.send({ embeds: [Pages[0]] });
    else return client.pagination(message, Pages, client);
  },
};
