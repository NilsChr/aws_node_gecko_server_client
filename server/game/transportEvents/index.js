import EVENTS_UDP from "../../../common/eventsUDP.js";

export default function registerEvents(channel, game) {
  channel.on(EVENTS_UDP.fromClient.playerInput, (data) => {
    game.players[channel.id].handleInput(data);
  });
  channel.on(EVENTS_UDP.fromClient.playerUseSkill, (data) => {
    //console.log(EVENTS_UDP.fromClient.playerUseSkill, data);
    game.players[channel.id].useSkill(data);
  });
}
