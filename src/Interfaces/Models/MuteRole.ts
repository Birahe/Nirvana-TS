import { Document } from "mongoose";

export default interface MuteRole extends Document {
  guild: string;
  rol: string;
}
