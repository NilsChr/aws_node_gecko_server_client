import { GO_ANIMATION_STATES } from "../../common/gameObject.js";
import GAME_UNIT_TYPES from "../../common/gameUnitTypes.js";
import gameState from "../gameState.js";
import ASSET_MANAGER, {
  ASSET_KEYS,
} from "../managers/assetsManager/assetManager.js";

const GAME_UNIT_DATA = [];
GAME_UNIT_DATA[GAME_UNIT_TYPES.PLAYER] = {
  imgKey: ASSET_KEYS.UNITS,
  row: 1 * 32,
};
GAME_UNIT_DATA[GAME_UNIT_TYPES.SKELETON_1] = {
  imgKey: ASSET_KEYS.UNITS,
  row: 0 * 32,
};
GAME_UNIT_DATA[GAME_UNIT_TYPES.BOSS] = {
  imgKey: ASSET_KEYS.UNITS,
  row: 2 * 32,
};
GAME_UNIT_DATA[GAME_UNIT_TYPES.GRAVEYARD_GRAVE] = {
  imgKey: ASSET_KEYS.GRAVEYARD,
  row: 0 * 32,
};
GAME_UNIT_DATA[GAME_UNIT_TYPES.GRAVEYARD_ANGEL] = {
  imgKey: ASSET_KEYS.GRAVEYARD,
  row: 0 * 32,
};

const GAME_OBJECT_RENDERER = {
  renderObject: function (p, obj) {
    let state = obj.animationState;
    let unitData = GAME_UNIT_DATA[obj.type];
    p.push();
    if (obj.isGhost && obj.id === gameState.myId) {
      p.tint(255, 126);
      render(p, unitData.imgKey, obj, state, unitData.row);
    } else if (!obj.isGhost) {
      render(p, unitData.imgKey, obj, state, unitData.row);
    }
    p.pop();
  },
};

function render(p, imgKey, obj, state, unitRow) {
  p.push();
  p.translate(obj.x, obj.y);
  p.scale(obj.dir, 1);
  let img = ASSET_MANAGER.getAsset(imgKey);
  p.image(img, 0, 0, 32, 32, 32 * state, unitRow, 32, 32);
  p.pop();
}
export default GAME_OBJECT_RENDERER;
