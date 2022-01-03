"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
exports.event = {
    name: "raw",
    run: async function (client, d) {
        client.manager.updateVoiceState(d);
    },
};
