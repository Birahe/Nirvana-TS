import { readdirSync } from "fs";
import { Snowflake } from "discord.js";
import Client from "../Client";
import { Manager } from "erela.js";
import Spotify from "erela.js-spotify";
import { join } from "path";

export default function (client: Client) {
  client.manager = new Manager({
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
      new Spotify({
        clientID: client.config.spotify_id,
        clientSecret: client.config.spotify_secret,
      }),
    ],
    send(id: Snowflake, payload) {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    },
  });
  readdirSync(join(__dirname, "Events")).forEach((file) => {
    require(`./Events/${file}`)(client);
  });
}
