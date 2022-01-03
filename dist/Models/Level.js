"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = (0, mongoose_1.model)("level", new mongoose_1.Schema({
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
}));
