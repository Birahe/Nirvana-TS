"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const chalk_1 = __importDefault(require("chalk"));
const mongoose_1 = require("mongoose");
const PrefixSchema_1 = __importDefault(require("../Models/PrefixSchema"));
const Mute_1 = __importDefault(require("../Models/Mute"));
const MuteRole_1 = __importDefault(require("../Models/MuteRole"));
exports.event = {
    name: "ready",
    run: async function (client) {
        console.log(chalk_1.default.yellow(`Bot ${chalk_1.default.red(client.user.tag)} adı ile giriş yaptı.`));
        (0, mongoose_1.connect)("mongodb+srv://HestiaN:15262326@nirvana.nkfqk.mongodb.net/Nirvana", {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        }).then(() => console.log(chalk_1.default.green("MongoDB'ye bağlandı!")));
        setInterval(() => {
            client.guilds.cache.forEach(async (guild) => {
                const data = await PrefixSchema_1.default.findOne({ guild: guild.id });
                if (!data)
                    await PrefixSchema_1.default.create({ guild: guild.id });
            });
        }, 2500);
        client.registerSlashCommands();
        client.manager.init(client.user.id);
        client.guilds.cache.forEach(async (guild) => {
            guild.members.cache.forEach(async (member) => {
                const data1 = await Mute_1.default.findOne({
                    user_guild: `${member.user.id}-${guild.id}`,
                });
                if (data1) {
                    const ainterval = setInterval(async function () {
                        if (data1.endTime !== -1) {
                            if (data1.endTime <= Date.now()) {
                                var roleData = await MuteRole_1.default.findOne({ guild: guild.id });
                                if (roleData) {
                                    var role = guild.roles.cache.get(roleData.id);
                                    if (role) {
                                        console.log(Date.now());
                                        if (member.roles.cache.has(role.id))
                                            await member.roles.remove(role);
                                        await Mute_1.default.findOneAndDelete({ guild: guild.id });
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
