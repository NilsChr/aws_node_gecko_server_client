import GAME_UNIT_TYPES from "../../../common/gameUnitTypes.js";
import ServerEnemy from "../serverEnemy.js";
import ServerPlayer from "../serverPlayer.js";
import ServerStatic from "../serverStatic.js";
import FACTORY_GAMEOBJECT_TITLE from "./gameobjectTitle.factory.js";

export const GAME_UNIT_CATEGORES = {
  PLAYER: 1,
  ENEMY: 2,
  STATIC: 3,
};

export default class FACTORY_GAMEOBJECT {
  id = 0;
  constructor(game) {
    this.game = game;
    this.id = 1;
  }

  createObject(obj_category, type, x, y) {
    let obj = null;
    switch (obj_category) {
      case GAME_UNIT_CATEGORES.PLAYER:
        obj = this.createPlayerCategory(type, x, y);
        break;
      case GAME_UNIT_CATEGORES.ENEMY:
        obj = this.createEnemyCategory(type, x, y);
        break;
      case GAME_UNIT_CATEGORES.STATIC:
        obj = this.createStaticCategory(type, x, y);
        break;
    }
    obj.title = FACTORY_GAMEOBJECT_TITLE.getTitle(obj);
    obj.stats.reset(); // Sets hp
    return obj;
  }

  createPlayerCategory(type, x, y) {
    switch (type) {
      case GAME_UNIT_TYPES.PLAYER:
        return new ServerPlayer(this.game, null, x, y, type);
    }
  }

  createEnemyCategory(type, x, y) {
    switch (type) {
      case GAME_UNIT_TYPES.SKELETON_1:
        return new ServerEnemy(this.game, this.id++, x, y, type);
      case GAME_UNIT_TYPES.BOSS:
        let obj = new ServerEnemy(this.game, this.id++, x, y, type);
        obj.stats.moveSpeed = 1.69;
        obj.stats.attackSpeed = 400;
        obj.stats.aggroRange = 100;
        obj.stats.power = 2;
        return obj;
    }
  }

  createStaticCategory(type, x, y) {
    return new ServerStatic(this, this.id++, x, y, type);
  }
}
