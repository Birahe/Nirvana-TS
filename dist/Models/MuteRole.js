"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = (0, mongoose_1.model)("muterole", new mongoose_1.Schema({
    guild: {
        type: String,
        required: true,
        unique: true,
    },
    rol: {
        type: String,
        required: true,
    },
}));
