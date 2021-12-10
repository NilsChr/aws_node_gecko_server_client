import gameState from "../gameState.js";
import { ClientPlayer } from "../player/clientPlayer.js";
import GameUnit from "./gameUnit.js";
import GAME_UNIT_TYPES from "../../common/gameUnitTypes.js";

const UNIT_FACTORY = {
  spawnUnit: function (unitBlueprint) {
    const { id, x, y, animationState } = unitBlueprint;
    let a = animationState; // prevents lines to get so long they wrap

    if (unitBlueprint.id === gameState.myId) {
      //gameState.clientPlayer = new ClientPlayer(id, x, y);
      //let gameObject = new GameUnit(id, x, y, GAME_UNIT_TYPES.PLAYER, a);

      let gameObject = new ClientPlayer(id, x, y, GAME_UNIT_TYPES.PLAYER, a);
      gameState.clientPlayer = gameObject;
      gameState.gameobjects.push(gameObject);
      gameState.clientPlayerGameObject = gameObject;
      return;
    }

    let gameObject = null;
    gameObject = new GameUnit(id, x, y, unitBlueprint.type, a);
    /*
    switch (unitBlueprint.type) {
      case GAME_UNIT_TYPES.PLAYER:
        gameObject = new GameUnit(id, x, y, GAME_UNIT_TYPES.PLAYER, a);
        break;
      case GAME_UNIT_TYPES.SKELETON_1:
        gameObject = new GameUnit(id, x, y, GAME_UNIT_TYPES.SKELETON_1, a);
        break;
      case GAME_UNIT_TYPES.BOSS:
        gameObject = new GameUnit(id, x, y, GAME_UNIT_TYPES.BOSS, a);
        break;
    }
    */
    if (!gameObject) {
      console.warn("ENEMY TYPE NOT MAPPED IN FACTORY");
      return;
    }
    gameState.gameobjects.push(gameObject);
  },
};
export default UNIT_FACTORY;
