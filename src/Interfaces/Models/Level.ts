import { Document } from "mongoose";
export default interface Model extends Document {
  guild: string;
  user: string;
  xp: number;
  lvl: number;
  xpToLvl: number;
}
