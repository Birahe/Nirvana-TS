"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = (0, mongoose_1.model)("mute", new mongoose_1.Schema({
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
}));
