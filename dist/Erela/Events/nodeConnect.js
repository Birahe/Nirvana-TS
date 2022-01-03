"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
module.exports = (client) => {
    client.manager.on("nodeConnect", (node) => console.log(chalk_1.default.blue(`Node ${chalk_1.default.yellow(node.options.identifier)} bağlandı`)));
};
