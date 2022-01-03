import { Schema, model } from "mongoose";
import Model from "../Interfaces/Models/MuteRole";

export default model<Model>(
  "muterole",
  new Schema({
    guild: {
      type: String,
      required: true,
      unique: true,
    },
    rol: {
      type: String,
      required: true,
    },
  })
);
