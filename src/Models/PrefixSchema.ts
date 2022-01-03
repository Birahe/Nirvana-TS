import { Schema, model } from "mongoose";
import PrefixModel from "../Interfaces/Models/PrefixModel";

const Prefix: Schema = new Schema({
  guild: {
    type: String,
    required: true,
    unique: true,
  },
  prefix: {
    type: String,
    required: true,
    default: "!",
  },
});

export default model<PrefixModel>("prefix", Prefix);
