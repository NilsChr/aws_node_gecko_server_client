export default function registerEvents(channel, game) {
  channel.on("client:playerInput", (data) => {
    game.players[channel.id].handleInput(data);
  });
}
