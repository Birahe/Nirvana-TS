import { Command } from "@interfaces/Command";
import { MessageEmbed, Snowflake } from "discord.js";
import schema from "../../Models/MuteRole";
export const command: Command = {
  name: "mute-rol",
  aliases: ["muterol"],
  description:
    "Sunucunun susturulmuş rolünü belirlersiniz veya oluşturursunuz.",
  usage: "mute-rol <oluştur | ayarla> [rol]",
  permLevel: 2,
  category: "Moderasyon",
  guildOnly: true,
  cooldownBoolean: false,
  run: async function (client, message, args, prefix) {
    if (!args[0])
      return message.reply({
        embeds: [
          new MessageEmbed({
            title: ":x: Lütfen bir işlem belirtiniz!",
            description: "Geçerli İşlemler: **oluştur / ayarla**",
          }),
        ],
      });
    const data = await schema.findOne({
      guild: message.guild!.id,
    });
    if (data) {
      message
        .reply({
          embeds: [
            new MessageEmbed({
              title:
                "Zaten bir muted rolü ayarlanmış, değiştirmek ister misiniz.",
              description: "Kabul Ediyorsanız 👍, Etmiyorsanız👎",
              color: "RANDOM",
              footer: {
                text: client.user!.username,
                iconURL: client.user!.displayAvatarURL(),
              },
            }),
          ],
        })
        .then((msg) => {
          const collector = msg.createReactionCollector({
            filter: (reaction, user) =>
              !user.bot &&
              user.id === message.author.id &&
              ["👍", "👎"].includes(reaction.emoji.name!),
            time: 20000,
            max: 1,
          });
          collector.on("collect", async (reaction, user) => {
            if (reaction.emoji.name === "👎") {
              collector.stop();
              message.channel.send({
                embeds: [
                  new MessageEmbed({
                    title: "İşlem İptal Edildi",
                    color: "RED",
                    footer: {
                      text: message.author.username,
                      iconURL: message.author.displayAvatarURL(),
                    },
                  }),
                ],
              });
            } else {
              if (args[0].toLowerCase() === "oluştur") {
                const role = await message.guild!.roles.create({
                  hoist: true,
                  color: "RED",
                  permissions: [],
                  name: "Muted",
                  reason: "Mute Rolü!",
                });
                await schema.findOneAndUpdate(
                  { guild: message.guild!.id },
                  {
                    rol: role.id,
                  }
                );
                message.channel.send({
                  embeds: [
                    new MessageEmbed({
                      title: "Yeni Mute Rolü Oluşturuldu!",
                      color: "GREEN",
                      footer: {
                        text: message.guild!.name,
                        iconURL: message.guild!.iconURL()!,
                      },
                    }),
                  ],
                });
              } else if (args[0].toLowerCase() === "ayarla") {
                const rol =
                  message.mentions.roles.first() ||
                  message.guild!.roles.cache.get(args[1] as Snowflake);
                if (!rol)
                  return message.reply({
                    embeds: [
                      new MessageEmbed({
                        title: ":x: Lütfen bir rol veya id belirtin.",
                        color: "RED",
                        footer: {
                          text: message.guild!.name,
                          iconURL: message.guild!.iconURL()!,
                        },
                      }),
                    ],
                  });
                await schema.findOneAndUpdate(
                  { guild: message.guild!.id },
                  {
                    rol: rol.id,
                  }
                );
                message.channel.send({
                  embeds: [
                    new MessageEmbed({
                      title: "Mute Rolü Ayarlandı!",
                      color: "GREEN",
                      footer: {
                        text: message.guild!.name,
                        iconURL: message.guild!.iconURL()!,
                      },
                    }),
                  ],
                });
              }
            }
          });
        });
    } else {
      if (args[0].toLowerCase() === "oluştur") {
        const role = await message.guild!.roles.create({
          hoist: true,
          color: "RED",
          permissions: [],
          name: "Muted",
          reason: "Mute Rolü!",
        });
        await schema.create({
          guild: message.guild!.id,
          rol: role.id,
        });
        message.channel.send({
          embeds: [
            new MessageEmbed({
              title: "Mute Rolü Oluşturuldu!",
              color: "GREEN",
              footer: {
                text: message.guild!.name,
                iconURL: message.guild!.iconURL()!,
              },
            }),
          ],
        });
      } else if (args[0] === "ayarla") {
        const rol =
          message.mentions.roles.first() ||
          message.guild!.roles.cache.get(args[1] as Snowflake);
        if (!rol)
          return message.reply({
            embeds: [
              new MessageEmbed({
                title: ":x: Lütfen bir rol veya id belirtin.",
                color: "RED",
                footer: {
                  text: message.guild!.name,
                  iconURL: message.guild!.iconURL()!,
                },
              }),
            ],
          });
        await schema.create({
          guild: message.guild!.id,
          rol: rol.id,
        });
        message.channel.send({
          embeds: [
            new MessageEmbed({
              title: "Mute Rolü Ayarlandı!",
              color: "GREEN",
              footer: {
                text: message.guild!.name,
                iconURL: message.guild!.iconURL()!,
              },
            }),
          ],
        });
      }
    }
  },
};
