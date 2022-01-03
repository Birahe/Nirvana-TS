"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
module.exports = (client) => {
    client.manager.on("nodeError", (node, error) => console.error(chalk_1.default.magenta(`Node ${chalk_1.default.cyan(node.options.identifier)} hata aldı: ${chalk_1.default.red(error.message)}`)));
};
