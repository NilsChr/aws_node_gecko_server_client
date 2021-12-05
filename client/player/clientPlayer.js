import gameState from "../gameState.js";
import INPUT from "../input.js";

export class ClientPlayer {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
  checkInput() {
    let dx = 0;
    let dy = 0;
    if (INPUT.input.MOVE_LEFT) dx--;
    if (INPUT.input.MOVE_RIGHT) dx++;
    if (INPUT.input.MOVE_DOWN) dy++;
    if (INPUT.input.MOVE_UP) dy--;
    this.move(dx, dy);
    if (
      INPUT.input.MOVE_LEFT ||
      INPUT.input.MOVE_RIGHT ||
      INPUT.input.MOVE_UP ||
      INPUT.input.MOVE_DOWN
    ) {
      this.sendInput();
    }
  }

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
}
