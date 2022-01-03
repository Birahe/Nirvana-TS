import { Message } from "discord.js";
import { Event } from "../Interfaces/Event";
import schema from "../Models/Level";
export const event: Event = {
  name: "messageCreate",
  run: async function (client, message: Message) {
    if (message.author.bot || !message.guild) return;
    let prefix = await client.getPrefix(message);
    if (message.content.startsWith(prefix)) return;
    let data = await schema.findOne({
      guild: message.guild.id,
      user: message.author.id,
    });
    if (data) {
      const random = Math.floor(Math.random() * 5 + 3);
      data.xp += random;
      if (data.xp >= data.xpToLvl) {
        data.lvl += 1;
        data.xpToLvl += data.lvl * 100;
        message.channel.send(
          `GG <@${message.author.id}>! Seviye atladın.Yeni seviyen: **${data.lvl}**`
        );
      }
      data.save();
    } else {
      await schema.create({
        guild: message.guild.id,
        user: message.author.id,
      });
    }
  },
};
