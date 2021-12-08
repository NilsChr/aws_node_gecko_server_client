import { GO_ANIMATION_STATES } from "../../common/gameObject.js";
import GAME_UNIT_TYPES from "../factories/gameUnitTypes.js";
import ASSET_MANAGER from "../managers/assetManager.js";

const GAME_UNIT_DATA = [];
GAME_UNIT_DATA[GAME_UNIT_TYPES.PLAYER] = {
  imgKey: 'units',
  row: 1 * 32
}
GAME_UNIT_DATA[GAME_UNIT_TYPES.SKELETON_1] = {
  imgKey: 'units',
  row: 0 * 32
}

const GAME_OBJECT_RENDERER = {
  renderObject: function (p, obj) {
    let state = obj.animationState;
    let unitData = GAME_UNIT_DATA[obj.type];
    render(p,unitData.imgKey, obj,state, unitData.row);
  },
};

function render(p, imgKey,obj, state,unitRow) {
  p.image(ASSET_MANAGER.getAsset(imgKey), obj.x, obj.y, 32,32, 32* state, unitRow, 32,32);
}


export default GAME_OBJECT_RENDERER;
