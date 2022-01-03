import { MessageEmbed, Snowflake, TextChannel } from "discord.js";
import Client from "../../Client";
module.exports = (client: Client) => {
  client.manager.on("queueEnd", (player) => {
    (
      client.channels.cache.get(player.textChannel as Snowflake)! as TextChannel
    ).send({
      embeds: [
        new MessageEmbed()
          .setTitle("Kuyruğun Sonuna Geldin!")
          .setColor("BLURPLE")
          .setFooter(client.user?.username!, client.user?.displayAvatarURL()),
      ],
    });

    player.destroy();
  });
};
