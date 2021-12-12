import EVENTS_UDP from "../../../common/eventsUDP.js";

export default function registerEvents(channel, game) {
  channel.on(EVENTS_UDP.fromClient.playerInput, (data) => {
    game.players[channel.id].handleInput(data);
  });
  channel.on(EVENTS_UDP.fromClient.playerUseSkill, (data) => {
    //console.log(EVENTS_UDP.fromClient.playerUseSkill, data);
    game.players[channel.id].useSkill(data);
  });
  channel.on(EVENTS_UDP.fromClient.chatSent, (data) => {
    console.log('Chat recieved', data);
    let player = game.players[channel.id];
    let packet = {
      msg: data,
      senderId: player.id,
      pos: player.pos
    }
    game.emitToClientsWithinRange(player, EVENTS_UDP.fromServer.chatSent, packet);
  })
}
