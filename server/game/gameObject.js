import vec2 from "./util/vec2";

export const GO_ANIMATION_STATES = {
  IDLE: 1,
  WALK: 2,
  ATTACK_NORMAL: 3,
  ATTACK_SPECIAL: 4,
};

export default class GameObject {
  constructor(id, x, y, type) {
    this.id = id;
    this.pos = new vec2(x, y);
    this.prev_pos = new vec2(x, y);
    this.moveSpeed = 1;
    this.type = type;
    this.animationState = GO_ANIMATION_STATES.IDLE;
  }

  setAnimationState(newState) {
    if (newState === this.animationState) return;
    else this.animationState = newState;
  }
}
