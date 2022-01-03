import { Command } from "@interfaces/Command";
import { MessageEmbed, Snowflake, TextChannel } from "discord.js";
import schema from "../../Models/ModlogSchema";
export const command: Command = {
  name: "at",
  aliases: ["kick"],
  description: "Sunucudaki bir kişiyi yasaklar.",
  usage: "at <Kullanıcı> [neden]",
  permLevel: 2,
  category: "Moderasyon",
  cooldownBoolean: false,
  guildOnly: true,
  run: async function (client, message, args, prefix) {
    let kullanıcı =
      message.mentions.members!.first() ||
      message.guild!.members.cache.get(args[0] as Snowflake);
    if (!kullanıcı)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(":x: Lütfen bir kullanıcı belirtiniz.")
            .setColor("RED")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    if (
      kullanıcı.roles.highest.position >= message.member!.roles.highest.position
    )
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(":x: Bu kullanıcıyı banlama yetkisine sahip değilsiniz.")
            .setColor("RED")
            .setFooter(
              message.author.username,
              message.author.displayAvatarURL()
            ),
        ],
      });
    if (
      kullanıcı.roles.highest.position >=
      message.guild!.me!.roles.highest.position
    )
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(":x: Bu kullanıcıyı banlama yetkisine sahip değilim.")
            .setColor("RED")
            .setFooter(
              message.author.username,
              message.author.displayAvatarURL()
            ),
        ],
      });
    const reason = args.slice(1).join(" ") || "Belirtilmemiş";
    kullanıcı.kick(reason);
    const data = await schema.findOne({ guild: message.guild!.id });
    if (!data)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Kullanıcı Atıldı")
            .setColor("RANDOM")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    (client.channels.cache.get(data.channel as Snowflake) as TextChannel).send({
      embeds: [
        new MessageEmbed()
          .setTitle("Kullanıcı Atıldı")
          .addField(
            "Kullanıcı",
            `\`${kullanıcı.user.tag}\`(${kullanıcı.user.id})`
          )
          .addField("Neden", reason)
          .setColor("RED")
          .setAuthor(message.guild!.name!, message.guild?.iconURL()!),
      ],
    });
  },
};
