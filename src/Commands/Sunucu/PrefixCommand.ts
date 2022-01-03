import { MessageEmbed } from "discord.js";
import { Command } from "@interfaces/index";
import prefixSchema from "../../Models/PrefixSchema";
export const command: Command = {
  name: "prefix",
  aliases: ["önek"],
  description: "Botun sunucudaki prefix'ini değiştirir.",
  usage: "prefix <yeni prefix>",
  permLevel: 3,
  cooldown: 0,
  cooldownBoolean: false,
  category: "Server",
  guildOnly: true,
  run: async function (client, message, args) {
    const prefix = args[0];
    if (!prefix)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(":x: Lütfen bir prefix belirtin.")
            .setColor("RED")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });

    const data = await prefixSchema.findOne({ guild: message.guild?.id });
    if (data) {
      if (data.prefix === prefix)
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(`:x: Sunucunun prefixi zaten ${prefix}`)
              .setColor("RED")
              .setFooter(
                client.user!.username,
                client.user!.displayAvatarURL()
              ),
          ],
        });

      data.prefix = prefix;
      data.save();
      message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`:white_check_mark: Başarılı!`)
            .setDescription(`Sunucunun prefix'i artık: **${prefix}**`)
            .setColor("ORANGE")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    } else {
      message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(":x: Bir hata oldu!Lütfen birazdan tekrar deneyiniz.")
            .setColor("RED")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    }
  },
  Slash: {
    options: [
      {
        name: "prefix",
        description: "Botun sunucudaki prefix'ini değiştirir.",
        type: "STRING",
        required: true,
      },
    ],
    run: async function (client, interaction, args) {
      const prefix = args.get("prefix")!.value as string;
      if (!prefix)
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(":x: Lütfen bir prefix belirtin.")
              .setColor("RED")
              .setFooter(
                client.user!.username,
                client.user!.displayAvatarURL()
              ),
          ],
        });

      const data = await prefixSchema.findOne({ guild: interaction.guild?.id });
      if (data) {
        if (data.prefix === prefix)
          return interaction.reply({
            embeds: [
              new MessageEmbed()
                .setTitle(`:x: Sunucunun prefixi zaten ${prefix}`)
                .setColor("RED")
                .setFooter(
                  client.user!.username,
                  client.user!.displayAvatarURL()
                ),
            ],
          });

        data.prefix = prefix;
        data.save();
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(`:white_check_mark: Başarılı!`)
              .setDescription(`Sunucunun prefix'i artık: **${prefix}**`)
              .setColor("ORANGE")
              .setFooter(
                client.user!.username,
                client.user!.displayAvatarURL()
              ),
          ],
        });
      } else {
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(":x: Bir hata oldu!Lütfen birazdan tekrar deneyiniz.")
              .setColor("RED")
              .setFooter(
                client.user!.username,
                client.user!.displayAvatarURL()
              ),
          ],
        });
      }
    },
  },
};
