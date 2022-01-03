"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const index_1 = require("./../Config/index");
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const AsciiTable = require("ascii-table");
const PrefixSchema_1 = __importDefault(require("../Models/PrefixSchema"));
class NirvanaClient extends discord_js_1.Client {
    constructor() {
        super(...arguments);
        this.commands = new discord_js_1.Collection();
        this.aliases = new discord_js_1.Collection();
        this.config = index_1.config;
        this.cooldowns = new discord_js_1.Collection();
    }
    async init() {
        this.loadEvents();
        this.loadCommands();
        this.setMaxListeners(9999);
        this.login(this.config.token);
    }
    loadCommands() {
        const table = new AsciiTable("Komut Tablosu").setHeading("Dosya", "Durum");
        const Path = path_1.default.join(__dirname, "..", "Commands");
        (0, fs_1.readdirSync)(Path).forEach((dir) => {
            const commandFiles = (0, fs_1.readdirSync)(path_1.default.join(Path, dir));
            for (const file of commandFiles) {
                const { command } = require(`${Path}/${dir}/${file}`);
                const cmd = command;
                table.addRow(file, "✔");
                this.commands.set(cmd.name, cmd);
                cmd.aliases?.forEach((alias) => {
                    this.aliases.set(alias, cmd);
                });
            }
        });
        console.log(chalk_1.default.magenta(table.toString()));
        console.log(chalk_1.default.bold.yellow(`${chalk_1.default.red(this.commands.size)} komut yüklendi!`));
    }
    loadEvents() {
        const table = new AsciiTable("Event Tablosu").setHeading("Dosya", "Durum");
        const Path = path_1.default.join(__dirname, "..", "Events");
        const events = (0, fs_1.readdirSync)(Path);
        for (const file of events) {
            const { event } = require(`${Path}/${file}`);
            this.on(event.name, (...args) => event.run(this, ...args));
            table.addRow(file, "✔");
        }
        console.log(chalk_1.default.cyan(table.toLocaleString()));
    }
    elevation(message) {
        let permLvl = 0;
        if (message.member.permissions.has(discord_js_1.Permissions.FLAGS.MANAGE_MESSAGES))
            permLvl = 1;
        if (message.member.permissions.has(discord_js_1.Permissions.FLAGS.BAN_MEMBERS))
            permLvl = 2;
        if (message.member.permissions.has(discord_js_1.Permissions.FLAGS.ADMINISTRATOR))
            permLvl = 3;
        if (message.author.id === this.config.owner)
            permLvl = 4;
        return permLvl;
    }
    async getPrefix(message) {
        const data = await PrefixSchema_1.default.findOne({ guild: message.guild?.id });
        return data ? data.prefix : this.config.prefix;
    }
    async registerSlashCommands() {
        this.guilds.cache.forEach((guild) => {
            try {
                const Path = path_1.default.join(__dirname, "..", "Commands");
                (0, fs_1.readdirSync)(Path).forEach(async (dir) => {
                    const commandFiles = (0, fs_1.readdirSync)(path_1.default.join(Path, dir));
                    for (const file of commandFiles) {
                        const { command } = require(`${Path}/${dir}/${file}`);
                        const cmd = command;
                        if (!cmd.Slash)
                            return;
                        await guild.commands.create({
                            name: cmd.name,
                            description: cmd.description,
                            options: cmd.Slash.options,
                        });
                    }
                });
                console.log(chalk_1.default.greenBright(`[SLASH-CREATE] Tüm Komutlar Yüklendi!`));
            }
            catch (e) {
                console.log(chalk_1.default.red(`[SLASH-FAIL] Bir hata oldu!`), e);
            }
        });
    }
    async pagination(msg, pages, client, emojiList = ["◀", "⏹", "▶"], timeout = 120000) {
        let page = 0;
        const curPage = await msg.channel.send({
            embeds: [
                pages[page].setFooter(`Sayfa ${page + 1}/${pages.length} `, msg.author.displayAvatarURL({ dynamic: true })),
            ],
        });
        for (const emoji of emojiList)
            await curPage.react(emoji);
        const reactionCollector = curPage.createReactionCollector({
            time: timeout,
            filter: (reaction, user) => !reaction.message.deleted &&
                emojiList.includes(reaction.emoji.name) &&
                !user.bot &&
                user.id === msg.author.id,
        });
        reactionCollector.on("collect", (reaction) => {
            if (reaction.message.deleted)
                return;
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
                    pages[page].setFooter(`Sayfa ${page + 1}/${pages.length} `, msg.author.displayAvatarURL({ dynamic: true })),
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
exports.default = NirvanaClient;
