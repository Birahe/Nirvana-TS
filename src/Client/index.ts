import { Manager } from "erela.js";
import { Event } from "./../Interfaces/Event";
import chalk from "chalk";
import { config } from "./../Config/index";
import { Command } from "../Interfaces/Command"
import {
  Client,
  Collection,
  Message,
  MessageEmbed,
  Permissions,
} from "discord.js";
import { Config } from "../Interfaces/Config";
import path from "path";
import { readdirSync } from "fs";
import prefixSchema from "../Models/PrefixSchema";


declare module "discord.js" {
  interface Client {
    manager: Manager;
  }
}
class NirvanaClient extends Client {
  public commands: Collection<string, Command> = new Collection();
  public aliases: Collection<string, Command> = new Collection();
  public config: Config = config;
  public cooldowns: Collection<string, Collection<string, number>> =
    new Collection();
  public async init() {
    this.loadEvents();
    this.loadCommands();
    this.setMaxListeners(9999);
    this.login(this.config.token);
  }

  private loadCommands() {
    const Path = path.join(__dirname, "..", "Commands");
    readdirSync(Path).forEach((dir) => {
      const commandFiles = readdirSync(path.join(Path, dir));
      for (const file of commandFiles) {
        const { command } = require(`${Path}/${dir}/${file}`);
        const cmd = command as Command;
        this.commands.set(cmd.name, cmd);
        cmd.aliases?.forEach((alias) => {
          this.aliases.set(alias, cmd);
        });
      }
    });
    console.log(
      chalk.bold.yellow(`${chalk.red(this.commands.size)} komut yüklendi!`)
    );
  }

  private loadEvents() {
    const Path = path.join(__dirname, "..", "Events");
    const events = readdirSync(Path);
    for (const file of events) {
      const { event } = require(`${Path}/${file}`);
      this.on((event as Event).name, (...args) =>
        (event as Event).run(this, ...args)
      );
    }
  }
  public elevation(message: Message) {
    let permLvl = 0;
    if (message.member!.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
      permLvl = 1;
    if (message.member!.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
      permLvl = 2;
    if (message.member!.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
      permLvl = 3;
    if (message.author.id === this.config.owner) permLvl = 4;
    return permLvl;
  }
  public async getPrefix(message: Message) {
    const data = await prefixSchema.findOne({ guild: message.guild?.id });
    return data ? data.prefix : this.config.prefix;
  }
  public async registerSlashCommands() {
    this.guilds.cache.forEach((guild) => {
      try {
        const Path = path.join(__dirname, "..", "Commands");
        readdirSync(Path).forEach(async (dir) => {
          const commandFiles = readdirSync(path.join(Path, dir));
          for (const file of commandFiles) {
            const { command } = require(`${Path}/${dir}/${file}`);
            const cmd = command as Command;
            if (!cmd.Slash) return;
            await guild.commands.create({
              name: cmd.name,
              description: cmd.description,
              options: cmd.Slash.options,
            });
          }
        });
        console.log(chalk.greenBright(`[SLASH-CREATE] Tüm Komutlar Yüklendi!`));
      } catch (e) {
        console.log(chalk.red(`[SLASH-FAIL] Bir hata oldu!`), e);
      }
    });
  }
  public async pagination(
    msg: Message,
    pages: MessageEmbed[],
    client: this,
    emojiList: string[] = ["◀", "⏹", "▶"],
    timeout: number = 120000
  ) {
    let page = 0;
    const curPage = await msg.channel.send({
      embeds: [
        pages[page].setFooter(
          `Sayfa ${page + 1}/${pages.length} `,
          msg.author.displayAvatarURL({ dynamic: true })
        ),
      ],
    });
    for (const emoji of emojiList) await curPage.react(emoji);
    const reactionCollector = curPage.createReactionCollector({
      time: timeout,
      filter: (reaction, user) =>
        !reaction.message.deleted &&
        emojiList.includes(reaction.emoji.name!) &&
        !user.bot &&
        user.id === msg.author.id,
    });
    reactionCollector.on("collect", (reaction) => {
      if (reaction.message.deleted) return;
      reaction.users.remove(msg.author);
      switch (reaction.emoji.name) {
        case emojiList[0]:
          page = page > 0 ? --page : pages.length - 1;
          break;
        case emojiList[1]:
          curPage.reactions.removeAll();
          break;
        case emojiList[2]:
          page = page + 1 < pages.length ? ++page : 0;
          break;
      }
      curPage.edit({
        embeds: [
          pages[page].setFooter(
            `Sayfa ${page + 1}/${pages.length} `,
            msg.author.displayAvatarURL({ dynamic: true })
          ),
        ],
      });
    });
    reactionCollector.on("end", () => {
      if (!curPage.deleted) {
        curPage.reactions.removeAll();
        curPage.delete();
      }
    });
  }
}

export default NirvanaClient;
