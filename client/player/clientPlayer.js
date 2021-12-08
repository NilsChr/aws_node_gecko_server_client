import { GO_ANIMATION_STATES } from "../../common/gameObject.js";
import GameUnit from "../factories/gameUnit.js";
import gameState from "../gameState.js";
import INPUT from "../input.js";

export class ClientPlayer extends GameUnit {
  constructor(id, x, y, type, animationState) {
    super(id, x, y, type, animationState);
    //this.id = id;
    //this.x = x;
    //this.y = y;
  }
  checkInput() {
    let dx = 0;
    let dy = 0;
    if (INPUT.input.MOVE_LEFT) dx--;
    if (INPUT.input.MOVE_RIGHT) dx++;
    if (INPUT.input.MOVE_DOWN) dy++;
    if (INPUT.input.MOVE_UP) dy--;
    //this.move(dx, dy);
    if (
      INPUT.input.MOVE_LEFT ||
      INPUT.input.MOVE_RIGHT ||
      INPUT.input.MOVE_UP ||
      INPUT.input.MOVE_DOWN
    ) {
      this.sendInput();
    }
  }

  // Moving player on client directly makes input feel instant
  move(x, y) {
    gameState.clientPlayerGameObject.x += x;
    gameState.clientPlayerGameObject.y += y;
  }

  sendInput() {
    const data = [
      INPUT.input.MOVE_LEFT,
      INPUT.input.MOVE_RIGHT,
      INPUT.input.MOVE_DOWN,
      INPUT.input.MOVE_UP,
    ];
    gameState.channel.emit("client:playerInput", data);
  }

  useSkill(skill_slot) {
    console.log("using skill ", skill_slot);
    gameState.channel.emit("client:useSkill", skill_slot, { reliable: true });
  }
}
