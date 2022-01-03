import { Command } from "@interfaces/Command";
import { MessageEmbed, Snowflake, VoiceChannel } from "discord.js";
export const command: Command = {
  name: "üsteekle",
  aliases: ["üste-ekle", "playtop", "pt", "play-top"],
  description: "Sıranın en üstüne şarkı ekler.",
  usage: "üsteekle <Şarkı>",
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
            .setTitle(":x: Şarkı ekleyebileceğim bir sıra yok.")
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
    if (!args[0])
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(":x: Lütfen bir terim belirtin!")
            .setColor("RED")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("🔎 Aranıyor...")
          .setDescription("```" + args.join(" ") + "```")
          .setColor("BLURPLE")
          .setFooter(client.user!.username, client.user?.displayAvatarURL()),
      ],
    });
    const res = await client.manager.search(args.join(" "), message.author);
    player.queue.unshift(res.tracks[0]);
    message.reply({
      embeds: [
        new MessageEmbed()
          .setAuthor(
            `🎵 Şarkı En Üste Eklendi: ${res.tracks[0].title}`,
            undefined,
            res.tracks[0].uri
          )
          .setColor("YELLOW")
          .setFooter(client.user!.username, client.user?.displayAvatarURL())
          .setImage(res.tracks[0].displayThumbnail("mqdefault")),
      ],
    });
    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        message.reply("Şarkıyı bulamadım!");
        break;
      case "LOAD_FAILED":
        if (!player.queue.current) player.destroy();
        message.reply("Bir sorun oldu.Lütfen tekrar deneyin.");
        break;
      case "PLAYLIST_LOADED":
        message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(":x: Bu Komut Playlist'leri desteklemiyor.")
              .setColor("RED")
              .setFooter(
                client.user!.username,
                client.user!.displayAvatarURL()
              ),
          ],
        });
        break;
    }
  },
};
