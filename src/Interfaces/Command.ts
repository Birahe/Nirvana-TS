import Client from "../Client";
import {
  ApplicationCommandOptionData,
  CommandInteraction,
  CommandInteractionOption,
  Message,
  Collection,
} from "discord.js";

interface Run {
  (
    client: Client,
    message: Message,
    args: string[],
    prefix?: string
  ): Promise<unknown>;
}

interface SlashRun {
  (
    client: Client,
    interaction: CommandInteraction,
    args: Collection<string, CommandInteractionOption>
  ): Promise<unknown>;
}

export interface Command {
  name: string;
  description: string;
  usage?: string;
  aliases?: Array<string>;
  permLevel: number;
  cooldownBoolean: boolean;
  cooldown?: number;
  category: keyof Categories;
  run: Run;
  guildOnly?: boolean;
  Slash?: {
    options?: Array<ApplicationCommandOptionData>;
    run: SlashRun;
  };
}

interface Categories {
  Müzik: any;
  General: any;
  Server: any;
  Moderasyon: any;
  Filtreler: any;
  Kullanıcı: any;
}
