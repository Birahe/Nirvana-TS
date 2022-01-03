import {
  DMChannel,
  Guild,
  GuildChannel,
  MessageEmbed,
  Snowflake,
  TextChannel,
} from "discord.js";
import Client from "../Client/index";
import logSchema from "../Models/ModlogSchema";

export async function load(client: Client) {
  console.log("LOGGER YÜKLENDİ");
  let types = {
    GUILD_TEXT: "Sohbet Kanalı",
    GUILD_VOICE: "Ses Kanalı",
    UNKNOWN: "Bir Tipi Yok",
    GUILD_NEWS: "Haber Kanalı",
    GUILD_STORE: "Mağaza Kanalı",
    GUILD_CATEGORY: "Kategori",
    GUILD_NEWS_THREAD: "Haber Başlığı",
    GUILD_PUBLIC_THREAD: "Genel Başlık",
    GUILD_PRIVATE_THREAD: "Gizli Başlık",
    GUILD_STAGE_VOICE: "Sahne Kanalı",
    GROUP_DM: "DM Grubu",
    DM: "DM",
  };
  client.on("channelCreate", (channel) => {
    send_log(
      client,
      channel.guild,
      new MessageEmbed({
        title: "Kanal Oluşturuldu",
        color: "GREEN",
        fields: [
          {
            name: "Kanal Adı",
            value: channel.name,
          },
          {
            name: "Kanal ID'si",
            value: channel.id,
          },
          {
            name: "Kanal Türü",
            value: types[channel.type],
          },
        ],
      })
    );
  });
  client.on("channelDelete", (channel) => {
    if (channel instanceof DMChannel) return;
    send_log(
      client,
      channel.guild,
      new MessageEmbed()
        .setTitle("Kanal Silindi!")
        .setColor("RED")
        .addField("Kanal Adı", (channel as GuildChannel).name)
        .addField("Kanal ID'si", channel.id)
        .addField("Kanal Türü", types[channel.type])
    );
  });
  client.on("channelUpdate", (oldC, newC) => {
    const oldChannel = oldC as GuildChannel;
    const newChannel = newC as GuildChannel;
    let guildChannel = newChannel.guild;
    if (!guildChannel || !guildChannel.available) return;

    if (oldChannel.name != newChannel.name) {
      send_log(
        client,
        newChannel.guild,
        new MessageEmbed()
          .setTitle("Kanal Güncellendi - Ad")
          .setColor("YELLOW")
          .addField("Eski Ad", oldChannel.name)
          .addField("Yeni Ad", newChannel.name)
      );
    } else if (oldChannel.type != newChannel.type) {
      send_log(
        client,
        oldChannel.guild,
        new MessageEmbed()
          .setTitle("Kanal Güncellendi - Tür")
          .setColor("YELLOW")
          .addField("Kanal Adı", newChannel.name)
          .addField("Eski Tür", types[oldChannel.type])
          .addField("Yeni Tür", types[newChannel.type])
      );
    }
  });
  client.on("guildBanAdd", (ban) => {
    send_log(
      client,
      ban.guild,
      new MessageEmbed()
        .setTitle("Kullanıcı Banlandı")
        .setColor("RED")
        .addField("Kullanıcı", `\`${ban.user.tag}\`(${ban.user.id})`)
        .addField("Neden", ban.reason ? ban.reason : "Belirtilmemiş")
    );
  });
  client.on("guildBanRemove", (ban) => {
    send_log(
      client,
      ban.guild,
      new MessageEmbed()
        .setTitle("Kullanıcı Banlanması Kaldırıldı.")
        .setColor("ORANGE")
        .addField("Kullanıcı", `\`${ban.user.tag}\`(${ban.user.id})`)
        .addField("Banlanma Nedeni", ban.reason! || "Belirtilmemiş")
    );
  });
  client.on("emojiCreate", (emoji) => {
    send_log(
      client,
      emoji.guild,
      new MessageEmbed()
        .setTitle("Emoji Oluşturuldu")
        .setColor("GREEN")
        .addField("Emoji", `${emoji}`)
        .addField("Emoji Adı", `${emoji.name}`)
        .addField("Emoji ID'si", `${emoji.id}`)
        .addField("Emoji URL'si", `${emoji.url}`)
    );
  });
  client.on("emojiDelete", (emoji) => {
    send_log(
      client,
      emoji.guild,
      new MessageEmbed()
        .setTitle("Emoji Silindi")
        .setColor("RED")
        .addField("Emoji", `${emoji}`)
        .addField("Emoji Adı", `${emoji.name}`)
        .addField("Emoji ID'si", `${emoji.id}`)
        .addField("Emoji URL'si", `${emoji.url}`)
    );
  });
  client.on("emojiUpdate", (oldEmoji, newEmoji) => {
    if (oldEmoji.name !== newEmoji.name) {
      send_log(
        client,
        newEmoji.guild,
        new MessageEmbed()
          .setColor("YELLOW")
          .setTitle("Emoji Adı Güncellendi")
          .addField("Emoji", `${newEmoji}`)
          .addField("Eski", oldEmoji.name!)
          .addField("Yeni", newEmoji.name!)
      );
    }
  });
  client.on("guildMemberUpdate", (oldMember, newMember) => {
    let options: any = {};

    if (options[newMember.guild.id]) {
      options = options[newMember.guild.id];
    }

    // Add default empty list
    if (typeof options.excludedroles === "undefined")
      options.excludedroles = new Array([]);
    if (typeof options.trackroles === "undefined") options.trackroles = true;
    const oldMemberRoles = oldMember.roles.cache.keyArray();
    const newMemberRoles = newMember.roles.cache.keyArray();
    const oldRoles = oldMemberRoles
      .filter((x) => !options.excludedroles.includes(x))
      .filter((x) => !newMemberRoles.includes(x));
    const newRoles = newMemberRoles
      .filter((x) => !options.excludedroles.includes(x))
      .filter((x) => !oldMemberRoles.includes(x));
    const rolechanged = newRoles.length || oldRoles.length;

    if (rolechanged) {
      let roleadded = "";
      if (newRoles.length > 0) {
        for (let i = 0; i < newRoles.length; i++) {
          if (i > 0) roleadded += ", ";
          roleadded += `<@&${newRoles[i]}>`;
        }
      }
      let roleremoved = "";
      if (oldRoles.length > 0) {
        for (let i = 0; i < oldRoles.length; i++) {
          if (i > 0) roleremoved += ", ";
          roleremoved += `<@&${oldRoles[i]}>`;
        }
      }
      let text = `${roleremoved ? `❌ Rol Kaldırıldı: \n${roleremoved}` : ""}${
        roleadded ? `✅ Rol Eklendi:\n${roleadded}` : ""
      }`;
      send_log(
        client,
        oldMember.guild,
        new MessageEmbed()
          .setColor(roleadded ? "GREEN" : "RED")
          .setTitle("Kullanıcı Rolleri Güncellendi")
          .addField("Kullanıcı", `${newMember.user.tag}`)
          .setDescription(text)
      );
    }
    if (!oldMember.premiumSince && newMember.premiumSince) {
      send_log(
        client,
        oldMember.guild,
        new MessageEmbed({
          title: "Sunucu Boost'landı",
          description: "Kullanıcı Bilgileri",
          fields: [
            {
              name: "İsmi",
              value: newMember.user.tag,
            },
            {
              name: "ID'si",
              value: newMember.user.id,
            },
            {
              name: "Sunucuya Katılış Tarihi",
              value: `${newMember.joinedAt!.getDay()}:${newMember.joinedAt!.getMonth()}:${newMember.joinedAt!.getFullYear()}`,
            },
          ],
        })
      );
    }
    if (oldMember.premiumSince && !newMember.premiumSince) {
      send_log(
        client,
        oldMember.guild,
        new MessageEmbed({
          title: "Kullanıcı Sunucuyu Boost'lamayı Bıraktı",
          description: "Kullanıcı Bilgileri",
          fields: [
            {
              name: "İsmi",
              value: newMember.user.tag,
            },
            {
              name: "ID'si",
              value: newMember.user.id,
            },
            {
              name: "Sunucuya Katılış Tarihi",
              value: `${newMember.joinedAt!.getDay()}:${newMember.joinedAt!.getMonth()}:${newMember.joinedAt!.getFullYear()}`,
            },
          ],
        })
      );
    }
  });
  client.on("messageDelete", (message) => {
    if (message.author!.bot) return;

    if (message.channel.type !== "GUILD_TEXT") return;

    send_log(
      client,
      message.guild!,
      new MessageEmbed()
        .setColor("ORANGE")
        .setTitle("Mesaj Silindi")
        .addField("Mesaj Sahibi", `**${message.author!.tag}**`)
        .addField("Kanal", `<#${message.channel.id}>`)
    );
  });
  client.on("messageDeleteBulk", (messages) => {
    send_log(
      client,
      messages.first()!.guild!,
      new MessageEmbed({
        title: "Toplu Mesaj Silindi",
        color: "RANDOM",
        fields: [
          {
            name: "Mesaj Sayısı",
            value: `${messages.size}`,
          },
          {
            name: "Kanal",
            value: `${messages.first()!.channel}`,
          },
        ],
      })
    );
  });
}

async function send_log(client: Client, guild: Guild, embed: MessageEmbed) {
  try {
    const data = await logSchema.findOne({
      guild: guild.id,
    });
    if (!data) return;
    const channel = client.channels.cache.get(
      data.channel as Snowflake
    ) as TextChannel;
    channel.send({
      embeds: [embed.setAuthor(guild.name, guild.iconURL()!)],
    });
  } catch (e) {
    console.log(e);
  }
}
