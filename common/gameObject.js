import EVENTS_UDP from "./eventsUDP.js";
import vec2 from "./vec2.js";

export const GO_ANIMATION_STATES = {
  IDLE: 0,
  WALK: 2,
  ATTACK_NORMAL: 1,
  ATTACK_SPECIAL: 4,
};

export class GameUnitStats {
  constructor(hp = 5, power = 1) {
    this.hp = hp;
    this.maxHp = hp;
    this.power = power;
    this.attackSpeed = 500;
    this.moveSpeed = 1;
    this.aggroRange = 50;
    this.attackRange = 30;
  }

  reset() {
    this.hp = this.maxHp;
  }
}

export default class GameObject {
  constructor(game,id, x, y, type) {
    this.game = game;
    this.id = id;
    this.title = 'no title';
    this.pos = new vec2(x, y);
    this.prev_pos = new vec2(x, y);
    this.vel = new vec2(0, 0);
    this.type = type;
    this.animationState = GO_ANIMATION_STATES.IDLE;
    this.lastAttack = -1;
    this.stats = new GameUnitStats();
    this.dead = false;
    this.isGhost = false;
  }

  tick(gameobjects) {
    this.update(gameobjects);
    this.vel.normalise();
    this.vel.mult(this.stats.moveSpeed);
    this.pos.add(this.vel);
    this.vel.x = 0;
    this.vel.y = 0;
  }

  update(gameobjects) {}

  hasChanged() {
    return this.px != this.x || this.py != this.y;
  }

  setAnimationState(newState) {
    if (newState === this.animationState) return;
    else this.animationState = newState;
  }

  parseForTransfer() {
    return {
      id: this.id,
      x: this.pos.x,
      y: this.pos.y,
      type: this.type,
      animationState: this.animationState,
      dead: this.dead,
      isGhost: this.isGhost,
      hp: this.stats.hp,
      maxhp: this.stats.maxHp,
    };
  }

  onDeath() {
    this.game.emitToClientsWithinRange(this,EVENTS_UDP.fromServer.playerDied, this.id);
  }
}
