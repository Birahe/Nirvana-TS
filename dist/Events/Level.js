"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const Level_1 = __importDefault(require("../Models/Level"));
exports.event = {
    name: "messageCreate",
    run: async function (client, message) {
        if (message.author.bot || !message.guild)
            return;
        let prefix = await client.getPrefix(message);
        if (message.content.startsWith(prefix))
            return;
        let data = await Level_1.default.findOne({
            guild: message.guild.id,
            user: message.author.id,
        });
        if (data) {
            const random = Math.floor(Math.random() * 5 + 3);
            data.xp += random;
            if (data.xp >= data.xpToLvl) {
                data.lvl += 1;
                data.xpToLvl += data.lvl * 100;
                message.channel.send(`GG <@${message.author.id}>! Seviye atladın.Yeni seviyen: **${data.lvl}**`);
            }
            data.save();
        }
        else {
            await Level_1.default.create({
                guild: message.guild.id,
                user: message.author.id,
            });
        }
    },
};
