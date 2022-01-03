import { Schema, model } from "mongoose";
import Model from "../Interfaces/Models/Mute";

export default model<Model>(
  "mute",
  new Schema({
    user_guild: {
      type: String,
      required: true,
    },
    endTime: {
      type: Number,
      required: true,
      default: -1,
    },
    startTime: {
      type: Number,
      required: true,
      default: Date.now(),
    },
    author: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      default: "Belirtilmemiş",
    },
  })
);
