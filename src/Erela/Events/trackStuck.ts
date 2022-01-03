import Client from "../../Client";
module.exports = (client: Client) => {
  client.manager.on("trackStuck", (player, track) => {
    player.queue.add(track);
    player.play();
  });
};
