import { Command } from "@interfaces/Command";
import { MessageEmbed, Snowflake } from "discord.js";
import schema from "../../Models/ModlogSchema";
export const command: Command = {
  name: "modlog",
  aliases: ["log", "modlog-kanal"],
  description: "Sunucu olaylarının gönderileceği kanalı belirlersiniz.",
  usage: "modlog #kanal",
  permLevel: 2,
  category: "Moderasyon",
  cooldownBoolean: false,
  guildOnly: true,
  run: async function (client, message, args, prefix) {
    if (!args[0])
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(":x: Lütfen bir kanal veya işlem belirtin.")
            .setColor("RED")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    if (args[0] === "sil") {
      const data = await schema.findOne({ guild: message.guild!.id });
      if (!data)
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(":x: Silebileceğim bir veri yok.")
              .setColor("RED")
              .setFooter(
                client.user!.username,
                client.user!.displayAvatarURL()
              ),
          ],
        });
      await schema
        .findOneAndDelete({ guild: message.guild!.id })
        .catch(console.error);
      message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Modlog kanalı başarıyla sıfırlandı.")
            .setColor("RANDOM")
            .setFooter(client.user!.username, client.user!.displayAvatarURL()),
        ],
      });
    } else if (args[0] === "göster") {
      const data = await schema.findOne({ guild: message.guild!.id });
      if (!data)
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(":x: Gösterebileceğim bir veri yok.")
              .setColor("RED")
              .setFooter(
                client.user!.username,
                client.user!.displayAvatarURL()
              ),
          ],
        });
      message.reply(`Sunucunun modlog kanalı: <#${data.channel}>`);
    } else {
      const kanal =
        message.mentions.channels.first() ||
        client.channels.cache.get(args[0] as Snowflake);
      if (!kanal)
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(":x: Lütfen bir kanal belirtin.")
              .setFooter(
                message.author.username,
                message.author.displayAvatarURL()
              )
              .setColor("RED"),
          ],
        });
      const data = await schema.findOne({ guild: message.guild!.id });
      if (data) {
        data.channel = kanal.id;
        data.save();
        message.reply({
          embeds: [
            new MessageEmbed()
              .setDescription(
                `**Sunucunun modlog kanalı ${kanal} olarak değiştirildi.**`
              )
              .setColor("RANDOM")
              .setFooter(
                client.user!.username,
                client.user!.displayAvatarURL()
              ),
          ],
        });
      } else {
        await schema.create({ guild: message.guild!.id, channel: kanal.id });
        message.reply({
          embeds: [
            new MessageEmbed()
              .setDescription(
                `**Sunucunun modlog kanalı ${kanal} olarak ayarlandı.**`
              )
              .setColor("RANDOM")
              .setFooter(
                client.user!.username,
                client.user!.displayAvatarURL()
              ),
          ],
        });
      }
    }
  },
};
