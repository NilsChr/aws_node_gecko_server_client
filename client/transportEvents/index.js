import EVENTS_UDP from "../../common/eventsUDP.js";
import gameState from "../gameState.js";
import GAME_SNACK_RENDERER from "../systems/gameSnackRenderer.js";

export default function registerClientEvents(channel) {

  channel.on(EVENTS_UDP.fromServer.enteredNewZone, (data) => {
    console.log(`Entered ${data.title}`);
    gameState.currentZone = data;
  });
  channel.on(EVENTS_UDP.fromServer.playerDied, (data) => {
    console.log(`Player died ${data}`);
    if (gameState.myId == data) {
      gameState.clientPlayerGameObject.isGhost = true;
    } else {
      for (let i = 0; i < gameState.gameobjects.length; i++) {
        if (gameState.gameobjects[i].id == data) {
          gameState.gameobjects.splice(i, 1);
          break;
        }
      }
    }
  });
  channel.on(EVENTS_UDP.fromServer.chatSent, (data) => {
    console.log("Chat", data);
    GAME_SNACK_RENDERER.createChat(data)
    /*
    if (gameState.myId == data) {
      gameState.clientPlayerGameObject.isGhost = true;
    } else {
      for (let i = 0; i < gameState.gameobjects.length; i++) {
        if (gameState.gameobjects[i].id == data) {
          gameState.gameobjects.splice(i, 1);
          break;
        }
      }
    }*/
  });
}
