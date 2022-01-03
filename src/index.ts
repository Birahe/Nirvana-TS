import { Intents } from "discord.js";
import Client from "./Client";
const client = new Client({
  intents: Object.values(Intents.FLAGS).reduce((acc, p) => acc | p, 0),
  allowedMentions: {
    repliedUser: false,
  },
  restTimeOffset: 10,
  partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
});
import { load } from "./Log";
load(client);
import Erela from "./Erela";
Erela(client);
client.setMaxListeners(1000);
client.init();

