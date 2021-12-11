import axios from "axios";
import gameState from "../gameState.js";

export default class GameUnit {
  constructor(id, x, y, type, animationState) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.type = type;
    this.animationState = animationState;
    this.dx = x;
    this.dy = y;
    this.dir = 1;
    this.dead = false;
    this.title = "";
    this.hp = 0;
    this.maxhp = 0;
    let that = this;

    axios
      .get(gameState.SERVER_URL + "/getObjectTitle/" + this.id)
      .then(function (response) {
        that.title = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  update() {
    this.setDirection();

    this.triggeredUpdate();
  }
  triggeredUpdate() {}

  setDirection() {
    if (this.dx != this.x) {
      this.dir = this.x < this.dx ? -1 : 1;
    }
    this.dx = this.x;
    this.dy = this.y;
  }

  setAnimationState(newState) {
    if (newState == this.animationState) return;
    this.animationState = newState;
  }
}
