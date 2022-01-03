import { Document } from "mongoose";

export default interface ModlogModel extends Document {
  guild: string;
  channel: string;
}
