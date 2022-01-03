import { Command } from "@interfaces/Command";
import { MessageEmbed, Snowflake } from "discord.js";
import schema from "../../Models/ModlogSchema";
export const command: Command = {
  name: "unban",
  aliases: [],
  description: "Sunucudan yasaklanan bir kullanıcının yasaklamasını kaldırır.",
  usage: "unban <ID>",
  permLevel: 2,
  category: "Moderasyon",
  guildOnly: true,
  cooldownBoolean: false,
  run: async function (client, message, args, prefix) {
    if (!args[0])
      return message.reply({
        embeds: [
          new MessageEmbed({
            title: "Lütfen bir ID belirtiniz.",
            color: "RED",
            footer: {
              text: client.user!.username,
              iconURL: client.user!.displayAvatarURL(),
            },
          }),
        ],
      });
    let kullanıcı = message.guild?.bans.cache.get(args[0] as Snowflake);
    if (!kullanıcı)
      return message.reply({
        embeds: [
          new MessageEmbed({
            title: "Lütfen banlı bir kullanıcı belirtiniz.",
            color: "RED",
            footer: {
              text: client.user!.username,
              iconURL: client.user!.displayAvatarURL(),
            },
          }),
        ],
      });
    message.guild!.members.unban(kullanıcı.user);
    const data = await schema.findOne({ guild: message.guild!.id });
    if (!data)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Kullanıcı Yasaklaması Kaldırıldı")
            .setColor("RANDOM")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
  },
};
