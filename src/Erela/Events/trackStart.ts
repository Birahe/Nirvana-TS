import { MessageEmbed, Snowflake, TextChannel } from "discord.js";
import Client from "../../Client";
module.exports = (client: Client) => {
  client.manager.on("trackStart", (player, track) => {
    player.set(`votes-${player.guild}`, []);
    let döngü = "Kapalı";
    if (player.queueRepeat) döngü = "Sıra Döngüsü" as string;
    if (player.trackRepeat) döngü = "Şarkı Döngüsü" as string;
    (
      client.channels.cache.get(player.textChannel as Snowflake)! as TextChannel
    ).send({
      embeds: [
        new MessageEmbed()
          .setAuthor(`🎵Şarkı Çalıyor: ${track.title}`)
          .setURL(track.uri)
          .setImage(track.displayThumbnail("mqdefault"))
          .addField("Döngü Durumu", döngü)
          .setColor("ORANGE")
          .setFooter(client.user!.username, client.user!.displayAvatarURL()),
      ],
    });
  });
};
