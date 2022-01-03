import { Command } from "@interfaces/Command";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
export const command: Command = {
  name: "yardım",
  cooldownBoolean: false,
  description: "Botun bütün komutlarını gösterir.",
  permLevel: 0,
  aliases: ["help", "", "y"],
  usage: "yardım [komut]",
  category: "General",
  run: async function (client, message, args, prefix) {
    if (args[0]) {
    } else {
      const general = client.commands
        .filter((x) => x.category == "General")
        .map((x) => "**" + prefix + x.name + "**: " + x.description)
        .sort(function (a, b) {
          return a.localeCompare(b);
        })
        .join("\n");
      const music = client.commands
        .filter((x) => x.category == "Müzik")
        .map((x) => "**" + prefix + x.name + "**: " + x.description)
        .sort(function (a, b) {
          return a.localeCompare(b);
        })
        .join("\n");
      const server = client.commands
        .filter((x) => x.category == "Server")
        .map((x) => "**" + prefix + x.name + "**: " + x.description)
        .sort(function (a, b) {
          return a.localeCompare(b);
        })
        .join("\n");
      const filters = client.commands
        .filter((x) => x.category == "Filtreler")
        .map((x) => "**" + prefix + x.name + "**: " + x.description)
        .sort(function (a, b) {
          return a.localeCompare(b);
        })
        .join("\n");
      const menü = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(
          client.user!.username + " Komut Listesi",
          client.user!.displayAvatarURL()
        )
        .setDescription(
          "**Genel**: :robot:\n**Müzik**: :musical_note:\n**Sunucu**: :tv:\n**Ana Menü**: ➕\n **Filtre Komutları**: 🎶"
        )
        .setFooter(message.author.username)
        .setTimestamp();
      const msg = await message.reply({
        embeds: [menü],
      });
      msg.react("➕");
      msg.react("🤖");
      msg.react("🎵");
      msg.react("🎶");
      msg.react("📺");
      const collector = msg.createReactionCollector({
        filter: (reaction, user) =>
          !user.bot &&
          user.id === message.author.id &&
          ["➕", "🤖", "🎵", "📺"].includes(reaction.emoji.name!),
      });
      collector.on("collect", (reaction, user) => {
        reaction.users.remove(user);
        switch (reaction.emoji.name) {
          case "➕":
            msg.edit({
              embeds: [menü],
            });
            break;
          case "🤖":
            msg.edit({
              embeds: [
                new MessageEmbed()
                  .setAuthor(
                    `${client.user!.username} Komut Listesi`,
                    client.user?.displayAvatarURL()
                  )
                  .setTitle("Genel Komutlar")
                  .setDescription(general)
                  .setColor("RANDOM")
                  .setFooter(
                    client.user!.username,
                    client.user!.displayAvatarURL()
                  ),
              ],
            });
            break;
          case "🎵":
            msg.edit({
              embeds: [
                new MessageEmbed()
                  .setAuthor(
                    `${client.user!.username} Komut Listesi`,
                    client.user?.displayAvatarURL()
                  )
                  .setTitle("Müzik Komutları")
                  .setDescription(music)
                  .setColor("RANDOM")
                  .setFooter(
                    client.user!.username,
                    client.user!.displayAvatarURL()
                  ),
              ],
            });
            break;
          case "🎶":
            msg.edit({
              embeds: [
                new MessageEmbed()
                  .setAuthor(
                    `${client.user!.username} Komut Listesi`,
                    client.user?.displayAvatarURL()
                  )
                  .setTitle("Filtre Komutları")
                  .setDescription(server)
                  .setColor("RANDOM")
                  .setFooter(
                    client.user!.username,
                    client.user!.displayAvatarURL()
                  ),
              ],
            });
            break;
          case "🤡":
            msg.edit({
              embeds: [
                new MessageEmbed()
                  .setAuthor(
                    `${client.user!.username} Komut Listesi`,
                    client.user?.displayAvatarURL()
                  )
                  .setTitle("Filtre Komutları")
                  .setDescription(filters)
                  .setColor("RANDOM")
                  .setFooter(
                    client.user!.username,
                    client.user!.displayAvatarURL()
                  ),
              ],
            });
            break;
        }
      });
    }
  },
};
