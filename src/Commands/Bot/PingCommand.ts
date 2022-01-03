import { Command } from "@interfaces/index";
import { MessageEmbed } from "discord.js";

export const command: Command = {
  name: "ping",
  aliases: ["gecikme"],
  description: "Botun pingini gösterir.",
  usage: "ping",
  permLevel: 0,
  cooldownBoolean: true,
  category: "General",
  run: async function (client, message, args) {
    message.channel.send({
      embeds: [
        new MessageEmbed({
          title: `🏓Pong!Botun pingi:**${client.ws.ping}ms**`,
          color: "RANDOM",
          footer: {
            text: client.user!.username,
            icon_url: client.user!.displayAvatarURL(),
          },
        }),
      ],
    });
  },
  Slash: {
    run: async function (client, interaction, args) {
      interaction.reply(`🏓Pong!Botun pingi:**${client.ws.ping}ms**`);
    },
  },
};
