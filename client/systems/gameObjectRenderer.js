import GAME_UNIT_TYPES from "../factories/gameUnitTypes.js";
import ASSET_MANAGER from "../managers/assetManager.js";

const GAME_OBJECT_RENDERER = {
  renderObject: function (p, obj) {
    switch (obj.type) {
      case GAME_UNIT_TYPES.PLAYER:
        p.image(ASSET_MANAGER.getAsset("units"), obj.x, obj.y, 64, 32, 32, 0);
        p.stroke(255,0,0);
        p.noFill();
        p.ellipse(obj.x+16, obj.y+16, 300,300);
        break;
      case GAME_UNIT_TYPES.SKELETON_1:
        p.image(ASSET_MANAGER.getAsset("units"), obj.x, obj.y, 32, 32, 0, 0, 32,32);
        break;
    }
  },
};

export default GAME_OBJECT_RENDERER;
