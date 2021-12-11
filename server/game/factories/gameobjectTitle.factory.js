import GAME_UNIT_TYPES from "../../../common/gameUnitTypes.js";

const FACTORY_GAMEOBJECT_TITLE = {
  getTitle(obj) {
    switch (obj.type) {
        case GAME_UNIT_TYPES.PLAYER:
        return "Player";
      case GAME_UNIT_TYPES.SKELETON_1:
        return "Skeleton";
      case GAME_UNIT_TYPES.BOSS:
        return "Skeleton boss";
    }
    return "";
  },
};

export default FACTORY_GAMEOBJECT_TITLE;
