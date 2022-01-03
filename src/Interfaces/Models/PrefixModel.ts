import { Document } from "mongoose";

export default interface PrefixModel extends Document {
  guild: string;
  prefix: string;
}
