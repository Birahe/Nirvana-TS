import { Schema, model } from "mongoose";
import Model from "Interfaces/Models/ModLog";

const Modlog: Schema = new Schema({
  guild: {
    type: String,
    required: true,
    unique: true,
  },
  channel: {
    type: String,
    required: true,
    unique: true,
  },
});

export default model<Model>("modlog", Modlog);
