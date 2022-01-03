import { Event } from "./../Interfaces/Event";
export const event: Event = {
  name: "raw",
  run: async function (client, d) {
    client.manager.updateVoiceState(d);
  },
};
