import chalk from "chalk";
import { Event } from "../Interfaces/Event";
import { connect } from "mongoose";
import prefixSchema from "../Models/PrefixSchema";
import muteSchema from "../Models/Mute";
import roleSchema from "../Models/MuteRole";

export const event: Event = {
  name: "ready",
  run: async function (client) {
    console.log(
      chalk.yellow(`Bot ${chalk.red(client.user!.tag)} adı ile giriş yaptı.`)
    );
    connect(
      client.config.mongo_url,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    ).then(() => console.log(chalk.green("MongoDB'ye bağlandı!")));

    setInterval(() => {
      client.guilds.cache.forEach(async (guild) => {
        const data = await prefixSchema.findOne({ guild: guild.id });
        if (!data) await prefixSchema.create({ guild: guild.id });
      });
    }, 2500);

    client.registerSlashCommands();
    client.manager.init(client.user!.id);
    client.guilds.cache.forEach(async (guild) => {
      guild.members.cache.forEach(async (member) => {
        const data1 = await muteSchema.findOne({
          user_guild: `${member.user.id}-${guild.id}`,
        });
        if (data1) {
          const ainterval = setInterval(async function () {
            if (data1.endTime !== -1) {
              if (data1.endTime <= Date.now()) {
                var roleData = await roleSchema.findOne({ guild: guild.id });
                if (roleData) {
                  var role = guild.roles.cache.get(roleData.id);
                  if (role) {
                    console.log(Date.now());
                    if (member.roles.cache.has(role!.id))
                      await member.roles.remove(role!);
                    await muteSchema.findOneAndDelete({ guild: guild.id });
                    clearInterval(ainterval);
                  }
                }
              }
            }
          }, 5000);
        }
      });
    });
  },
};
