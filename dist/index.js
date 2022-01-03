"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Client_1 = __importDefault(require("./Client"));
const client = new Client_1.default({
    intents: Object.values(discord_js_1.Intents.FLAGS).reduce((acc, p) => acc | p, 0),
    allowedMentions: {
        repliedUser: false,
    },
    restTimeOffset: 10,
    partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
});
const Erela_1 = __importDefault(require("./Erela"));
(0, Erela_1.default)(client);
client.setMaxListeners(1000);
client.init();
