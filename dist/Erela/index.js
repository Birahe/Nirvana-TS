"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const erela_js_1 = require("erela.js");
const erela_js_spotify_1 = __importDefault(require("erela.js-spotify"));
const path_1 = require("path");
function default_1(client) {
    client.manager = new erela_js_1.Manager({
        nodes: [
            {
                // host: "lavalink-nirvana.herokuapp.com",
                // identifier: "Heroku",
                // port: 80,
                // password: "youshallnotpass",
                host: "localhost",
                identifier: "Local",
                port: 2333,
                password: "youshallnotpass",
            },
        ],
        plugins: [
            new erela_js_spotify_1.default({
                clientID: client.config.spotify_id,
                clientSecret: client.config.spotify_secret,
            }),
        ],
        send(id, payload) {
            const guild = client.guilds.cache.get(id);
            if (guild)
                guild.shard.send(payload);
        },
    });
    (0, fs_1.readdirSync)((0, path_1.join)(__dirname, "Events")).forEach((file) => {
        require(`./Events/${file}`)(client);
    });
}
exports.default = default_1;
