import { Command } from "@interfaces/Command";
import { MessageEmbed } from "discord.js";
import schema from "../../Models/Level";
export const command: Command = {
  name: "level",
  aliases: ["seviye", "lvl"],
  description: "Kullanıcının sunucudaki seviyesini gösterir.",
  usage: "level [kullanıcı]",
  permLevel: 0,
  guildOnly: true,
  category: "Kullanıcı",
  cooldownBoolean: true,
  run: async function (client, message, args, prefix) {
    let kullanıcı = message.mentions.users.first() || message.author;
    const data = await schema.findOne({
      guild: message.guild!.id,
    });
    if (!data)
      return message.reply({
        embeds: [
          new MessageEmbed({
            title: ":x: Bu kullanıcının bir seviyesi yok, garip.",
            color: "RED",
            footer: {
              text: kullanıcı.tag,
              iconURL: kullanıcı.displayAvatarURL({ dynamic: true }),
            },
          }),
        ],
      });
    message.channel.send({
      embeds: [
        new MessageEmbed({
          author: {
            name: `${kullanıcı.tag} Adlı Kullanıcının Seviyesi`,
            iconURL: kullanıcı.displayAvatarURL({ dynamic: true }),
          },
          fields: [
            {
              name: "Seviye",
              value: `${data.lvl}`,
            },
            {
              name: "Deneyim Puanı",
              value: `${data.xp}`,
            },
            {
              name: "Seviye İçin Gerekli Deneyim Puanı",
              value: `${data.xpToLvl - data.xp}`,
            },
          ],
        }),
      ],
    });
  },
};
