"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (client) => {
    client.manager.on("trackStuck", (player, track) => {
        player.queue.add(track);
        player.play();
    });
};
