import { MessageEmbed, Snowflake, VoiceChannel } from "discord.js";
import { Command } from "@interfaces/Command";
import moment from "moment";
import "moment-duration-format";
export const command: Command = {
  name: "ara",
  aliases: ["search", "find", "bul"],
  description: "YouTube'dan şarkı aratır.",
  usage: "ara <Şarkı Adı>",
  permLevel: 0,
  guildOnly: true,
  category: "Müzik",
  cooldownBoolean: false,
  run: async function (client, message, args, prefix) {
    try {
      const { channel } = message.member!.voice;
      if (!channel)
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(
                ":x: Bu komutu kullanmak için bir ses kanalına olmalısınız."
              )
              .setColor("RED")
              .setFooter(
                client.user!.username,
                client.user!.displayAvatarURL()
              ),
          ],
        });
      if (!args.join(" "))
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(":x: Lütfen bir terim belirtin!")
              .setColor("RED")
              .setFooter(
                client.user!.username,
                client.user!.displayAvatarURL()
              ),
          ],
        });
      let player = client.manager.get(message.guild!.id);
      let msgg = await message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("🔎 Aranıyor...")
            .setDescription("```" + args.join(" ") + "```")
            .setColor("BLURPLE")
            .setFooter(client.user!.username, client.user?.displayAvatarURL()),
        ],
      });
      let result = await client.manager.search(args.join(" "), message.author);
      let searchResult = "";
      for (let i = 0; i < 10; i++) {
        try {
          searchResult += `**${i + 1}**.[${result.tracks[i].title}](${
            result.tracks[i].uri
          }) - \`${moment
            .duration(result.tracks[i].duration / 1000, "seconds")
            .format()}\`\n`;
        } catch {
          searchResult = "\n";
        }
      }
      let userinput: number;
      msgg
        .edit({
          embeds: [
            new MessageEmbed()
              .setColor("RANDOM")
              .setTitle("Şarkı Seçimi")
              .setFooter(
                "Aramayı iptal etmek için iptal yazınız veya 20 saniye bekleyiniz."
              )
              .setDescription(searchResult.substr(0, 2048)),
          ],
        })
        .then((msg) => {
          msg.channel
            .awaitMessages({
              filter: (m) => m.author.id === message.author.id,
              max: 1,
              time: 20000,
              errors: ["time"],
            })
            .then((collected) => {
              userinput = Number(collected.first()!.content);
              if (isNaN(userinput)) {
                return message.channel.send({
                  embeds: [
                    new MessageEmbed()
                      .setTitle(`:x: | Arama İptal Edildi!`)
                      .setColor("RED")
                      .setFooter(
                        client.user!.username,
                        client.user!.displayAvatarURL()
                      ),
                  ],
                });
              }
              if (Number(userinput) <= 0 || Number(userinput) > 10) {
                message.channel.send("Geçersiz sayı.İlk şarkıyı oynatıyorum.");
                userinput = 1;
              }
              if (!player) {
                player = client.manager.create({
                  guild: message.guild!.id,
                  textChannel: message.channel.id,
                  selfDeafen: true,
                  volume: 15,
                  voiceChannel: message.member?.voice.channel?.id,
                });
                player.set("author", message.author.id);
                player.connect();
                player.queue.add(result.tracks[userinput - 1]);
                player.play();
              } else {
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
                        .setFooter(
                          client.user!.username,
                          client.user!.displayAvatarURL()
                        ),
                    ],
                  });
                if (message.author.id !== player.get("author"))
                  return message.reply({
                    embeds: [
                      new MessageEmbed()
                        .setTitle(
                          ":x: Bu komutu sadece sıra sahibi kullanabilir!"
                        )
                        .setDescription(
                          `Sıra sahibi: **<@!${player.get("author")}>**`
                        )
                        .setColor("RED")
                        .setFooter(
                          client.user!.username,
                          client.user!.displayAvatarURL()
                        ),
                    ],
                  });
                player.queue.add(result.tracks[userinput - 1]);
                message.reply({
                  embeds: [
                    new MessageEmbed()
                      .setAuthor(
                        `🎵 Şarkı Kuyruğa Eklendi: ${
                          result.tracks[userinput - 1].title
                        }`,
                        undefined,
                        result.tracks[userinput - 1].uri
                      )
                      .setColor("YELLOW")
                      .setFooter(
                        client.user!.username,
                        client.user?.displayAvatarURL()
                      )
                      .setImage(
                        result.tracks[userinput - 1].displayThumbnail(
                          "mqdefault"
                        )
                      ),
                  ],
                });
              }
              switch (result.loadType) {
                case "NO_MATCHES":
                  if (!player.queue.current) player.destroy();
                  message.reply("Şarkıyı bulamadım!");
                  break;
                case "LOAD_FAILED":
                  if (!player.queue.current) player.destroy();
                  message.reply("Bir sorun oldu.Lütfen tekrar deneyin.");
                  break;
              }
            })
            .catch((e) => {
              msg.delete();
              return message.channel.send({
                embeds: [
                  new MessageEmbed()
                    .setTitle(`:x: | Arama İptal! 20 Saniye Geçti!`)
                    .setColor("RED")
                    .setFooter(
                      client.user!.username,
                      client.user!.displayAvatarURL()
                    ),
                ],
              });
            });
        });
    } catch (err) {
      message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(":x: Bir Sorun Oldu!")
            .setDescription("```" + err + "```")
            .setColor("RED")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    }
  },
};
