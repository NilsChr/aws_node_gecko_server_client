export default class GameUnit {
  constructor(id, x, y, type, animationState) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.type = type;
    this.animationState = animationState;
  }

  setAnimationState(newState) {
    if(newState == this.animationState) return;
    this.animationState = newState;
  }

}
