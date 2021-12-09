import EVENTS_UDP from "../../common/eventsUDP.js";

export default function registerClientEvents(channel) {
  channel.on(EVENTS_UDP.fromServer.enteredNewZone, (data) => {
      console.log(`Entered ${data.title}`);
  })
}
