import { Schema, model } from "mongoose";
import Model from "../Interfaces/Models/Level";

export default model<Model>(
  "level",
  new Schema({
    guild: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    xp: {
      type: Number,
      required: true,
      default: 5,
    },
    lvl: {
      type: Number,
      required: true,
      default: 1,
    },
    xpToLvl: {
      type: Number,
      required: true,
      default: 100,
    },
  })
);
