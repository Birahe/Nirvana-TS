"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Prefix = new mongoose_1.Schema({
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
exports.default = (0, mongoose_1.model)("prefix", Prefix);
