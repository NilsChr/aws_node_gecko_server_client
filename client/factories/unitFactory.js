import gameState from "../gameState.js";
import { ClientPlayer } from "../player/clientPlayer.js";
import GameUnit from "./gameUnit.js";
import GAME_UNIT_TYPES from "./gameUnitTypes.js";

const UNIT_FACTORY = {
  spawnUnit: function (unitBlueprint) {
    const { id, x, y } = unitBlueprint;

    if (unitBlueprint.id === gameState.myId) {
      gameState.clientPlayer = new ClientPlayer(id, x, y);
      let gameObject = new GameUnit(id, x, y, GAME_UNIT_TYPES.PLAYER);
      gameState.gameobjects.push(gameObject);
      gameState.clientPlayerGameObject = gameObject;
      return;
    }

    let gameObject = null;
    switch (unitBlueprint.type) {
      case GAME_UNIT_TYPES.PLAYER:
        gameObject = new GameUnit(id, x, y, GAME_UNIT_TYPES.PLAYER);
        break;
        case GAME_UNIT_TYPES.SKELETON_1:
            gameObject = new GameUnit(id, x, y, GAME_UNIT_TYPES.SKELETON_1);
            break;
    }
    if(!gameState) {
        console.warn("ENEMY TYPE NOT MAPPED IN FACTORY");
        return;
    }
    gameState.gameobjects.push(gameObject);
  },
};
export default UNIT_FACTORY;
