"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
exports.event = {
    name: "interactionCreate",
    run: async function (client, interaction) {
        if (!interaction.isCommand())
            return;
        const command = interaction.commandName;
        let cmd;
        if (client.commands.has(command)) {
            cmd = client.commands.get(command);
        }
        else if (client.aliases.has(command)) {
            cmd = client.aliases.get(command);
        }
        if (cmd) {
            cmd.Slash?.run(client, interaction, interaction.options);
        }
    },
};
