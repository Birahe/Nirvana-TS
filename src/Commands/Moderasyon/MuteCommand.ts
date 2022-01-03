import { GuildChannel, MessageEmbed, Snowflake, TextChannel } from "discord.js";
import { Command } from "@interfaces/Command";
import roleSchema from "../../Models/MuteRole";
import muteSchema from "../../Models/Mute";
import logSchema from "../../Models/ModlogSchema";
import ms from "ms";
export const command: Command = {
  name: "sustur",
  aliases: ["mute"],
  description: "Sunucudaki bir kullanıcıyı susturursunuz.",
  usage: "sustur <Kullanıcı> [Süre] [Neden]",
  permLevel: 2,
  category: "Moderasyon",
  cooldownBoolean: false,
  guildOnly: true,
  run: async function (client, message, args, prefix) {
    const kullanıcı =
      message.mentions.members!.first() ||
      message.guild!.members.cache.get(args[0] as Snowflake);

    if (!kullanıcı)
      return message.reply({
        embeds: [
          new MessageEmbed({
            title: ":x: Lütfen bir kullanıcı etiketleyiniz.",
            color: "RED",
            footer: {
              text: client.user!.username,
              iconURL: client.user!.displayAvatarURL(),
            },
          }),
        ],
      });
    let rolData = await roleSchema.findOne({ guild: message.guild!.id });
    if (!rolData)
      return message.reply({
        embeds: [
          new MessageEmbed({
            color: "RED",
            title: ":x: Bir Muted Rolü Ayarlanmamış",
            description: `${prefix}mute-rol <oluştur | ayarla>`,
            footer: {
              text: message.author.username,
              iconURL: message.author.displayAvatarURL(),
            },
          }),
        ],
      });
    let role = message.guild!.roles.cache.find((r) => r.id === rolData!.rol);
    if (!role) {
      try {
        role = await message.guild!.roles.create({
          name: "Muted",
          color: "RED",
          permissions: [],
          reason: "Mute Rolü!",
          hoist: true,
        });
        await roleSchema.findOneAndUpdate(
          { guild: message.guild!.id },
          {
            rol: role.id,
          }
        );
        message.guild!.channels.cache.forEach(async (channel) => {
          if (channel instanceof GuildChannel)
            await channel.permissionOverwrites.create(role!, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false,
              CONNECT: false,
              SPEAK: false,
            });
        });
      } catch (err) {
        console.log(err);
      }
    }
    let time = args[1];
    let reason = args.slice(2).join(" ");
    const datatatatata = await muteSchema.findOne({
      user_guild: `${kullanıcı.id}-${message.guild!.id}`,
    });
    if (time) {
      if (reason) {
        if (!datatatatata) {
          await muteSchema.create({
            user_guild: `${kullanıcı.id}-${message.guild!.id}`,
            reason,
            author: message.author.id,
            endTime:
              Date.now() +
              ms(
                time
                  .replace("gün", "d")
                  .replace("saat", "h")
                  .replace("dakika", "m")
                  .replace("saniye", "s")
              ),
          });
          if (!kullanıcı.roles.cache.has(role!.id)) kullanıcı.roles.add(role!);
          sendLog(time);
        } else {
          await muteSchema.findOneAndUpdate(
            {
              user_guild: `${kullanıcı.id}-${message.guild!.id}`,
            },
            {
              reason,
              endTime:
                Date.now() +
                ms(
                  time.replace("g", "d").replace("sa", "h").replace("dk", "m")
                ),
              author: message.author.id,
            }
          );
          if (!kullanıcı.roles.cache.has(role!.id)) kullanıcı.roles.add(role!);
          sendLog(time);
        }
      } else {
        if (!datatatatata) {
          await muteSchema.create({
            user_guild: `${kullanıcı.id}-${message.guild!.id}`,
            author: message.author.id,
            endTime:
              Date.now() +
              ms(time.replace("g", "d").replace("sa", "h").replace("dk", "m")),
          });
          if (!kullanıcı.roles.cache.has(role!.id)) kullanıcı.roles.add(role!);
          sendLog(time);
        } else {
          await muteSchema.findOneAndUpdate(
            {
              user_guild: `${kullanıcı.id}-${message.guild!.id}`,
            },
            {
              endTime:
                Date.now() +
                ms(
                  time.replace("g", "d").replace("sa", "h").replace("dk", "m")
                ),
              author: message.author.id,
            }
          );
          if (!kullanıcı.roles.cache.has(role!.id)) kullanıcı.roles.add(role!);
          sendLog(time);
        }
      }
    } else {
      if (reason) {
        if (!datatatatata) {
          await muteSchema.create({
            user_guild: `${kullanıcı.id}-${message.guild!.id}`,
            reason,
            author: message.author.id,
          });
          if (!kullanıcı.roles.cache.has(role!.id)) kullanıcı.roles.add(role!);
          sendLog("Süresiz");
        } else {
          await muteSchema.findOneAndUpdate(
            {
              user_guild: `${kullanıcı.id}-${message.guild!.id}`,
            },
            {
              endTime: -1,
              reason,
              author: message.author.id,
              startTime: Date.now(),
            }
          );
          if (!kullanıcı.roles.cache.has(role!.id)) kullanıcı.roles.add(role!);
          sendLog("Süresiz");
        }
      } else {
        if (!datatatatata) {
          await muteSchema.create({
            user_guild: `${kullanıcı.id}-${message.guild!.id}`,
            reason,
            author: message.author.id,
          });
          if (!kullanıcı.roles.cache.has(role!.id)) kullanıcı.roles.add(role!);
          sendLog("Süresiz");
        } else {
          await muteSchema.findOneAndUpdate(
            {
              user_guild: `${kullanıcı.id}-${message.guild!.id}`,
            },
            {
              author: message.author.id,
            }
          );
          if (!kullanıcı.roles.cache.has(role!.id)) kullanıcı.roles.add(role!);
          sendLog("Süresiz");
        }
      }
    }
    async function sendLog(time: any) {
      const data = await logSchema.findOne({ guild: message.guild!.id });
      if (!data)
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("Kullanıcı Susturuldu")
              .setColor("RANDOM")
              .setFooter(
                client.user!.username,
                client.user!.displayAvatarURL()
              ),
          ],
        });
      (
        client.channels.cache.get(data.channel as Snowflake) as TextChannel
      ).send({
        embeds: [
          new MessageEmbed()
            .setTitle("Kullanıcı Susturuldu")
            .addField(
              "Kullanıcı",
              `\`${kullanıcı!.user.tag}\`(${kullanıcı!.user.id})`
            )
            .addField("Neden", reason || "Belirtilmemiş")
            .addField("Süre", time)
            .setColor("RED")
            .setAuthor(message.guild!.name!, message.guild?.iconURL()!),
        ],
      });
    }
  },
};
