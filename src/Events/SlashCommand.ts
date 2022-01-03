import { Interaction } from "discord.js";
import { Event } from "@interfaces/index";

export const event: Event = {
  name: "interactionCreate",
  run: async function (client, interaction: Interaction) {
    if (!interaction.isCommand()) return;
    const command = interaction.commandName;
    let cmd;
    if (client.commands.has(command)) {
      cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
      cmd = client.aliases.get(command);
    }
    if (cmd) {
      cmd.Slash?.run(client, interaction, interaction.options);
    }
  },
};
