import { ClientEvents } from "discord.js";
import Client from "../Client/index";

interface Run {
  (client: Client, ...args: any[]): void;
}

export interface Event {
  name: keyof ClientEvents | string;
  run: Run;
}
