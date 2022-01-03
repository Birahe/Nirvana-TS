import { Config } from "@interfaces/index";
import dotenv from "dotenv";
dotenv.config();
export const config: Config = {
  token: process.env.TOKEN!,
  prefix: process.env.PREFIX!,
  owner: process.env.OWNER!,
  spotify_id: process.env.SPOTIFY_ID!,
  spotify_secret: process.env.SPOTIFY_SECRET!,
};
