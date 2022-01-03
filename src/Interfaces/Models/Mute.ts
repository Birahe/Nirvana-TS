import { Document } from "mongoose";
export default interface Model extends Document {
  user_guild: string;
  endTime: number;
  startTime: number;
  author: string;
  reason: string;
}
