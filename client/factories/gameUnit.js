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
  }

  update() {
    if(this.dx != this.x) {
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
