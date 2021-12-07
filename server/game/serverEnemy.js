import GAME_UNIT_TYPES from "../../client/factories/gameUnitTypes.js";
import MATH_HELPERS from "../../common/MathHelpers.js";

const STATES = {
  FIND_TARGET: 1,
  MOVE_TOWARDS_TARGET: 2,
  MOVE_HOME: 3,
  ATTACK: 4,
};

export default class ServerEnemy {
  constructor(id, x, y, type) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.type = type;
    this.moveSpeed = 1;
    this.state = STATES.FIND_TARGET;

    this.start = {
      x: this.x,
      y: this.y,
    };

    this.target = null;
    this.aggroRange = 50;
    this.attackRange = 5;
  }

  update(gameObjects) {
    switch (this.state) {
      case STATES.FIND_TARGET:
        this.findTarget(gameObjects);
        break;
      case STATES.MOVE_TOWARDS_TARGET:
        this.moveTowardsTarget();
        break;
      case STATES.MOVE_HOME:
        this.moveHome();
        break;
      case STATES.ATTACK:
        this.attack();
        break;
    }

    this.px = this.x;
    this.py = this.y;
  }

  hasChanged() {
    return this.px != this.x || this.py != this.y;
  }

  findTarget(gameObjects) {
    this.target = gameObjects.filter(
      (p) =>
        p.type === GAME_UNIT_TYPES.PLAYER &&
        MATH_HELPERS.getDistance(p.x, p.y, this.x, this.y) < this.aggroRange
    )[0];

    if (this.target) {
      this.state = STATES.MOVE_TOWARDS_TARGET;
    }
  }

  moveTowardsTarget() {
    // Too far from home
    if (
      MATH_HELPERS.getDistance(this.start.x, this.start.y, this.x, this.y) >
      this.aggroRange * 3
    ) {
      this.target = null;
      this.state = STATES.MOVE_HOME;
      return;
    }

    // Too far from player
    if (
      MATH_HELPERS.getDistance(this.target.x, this.target.y, this.x, this.y) >
      this.aggroRange * 3
    ) {
      this.target = null;
      this.state = STATES.MOVE_HOME;
      return;
    }

    // Move towards player
    var angleRadians = Math.atan2(
      this.y - this.target.y,
      this.x - this.target.x
    );

    this.x -= Math.cos(angleRadians) * this.moveSpeed;
    this.y -= Math.sin(angleRadians) * this.moveSpeed;

    if (
      MATH_HELPERS.getDistance(this.target.x, this.target.y, this.x, this.y) <
      this.attackRange
    ) {
        this.state = STATES.ATTACK;
        return;
    }
  }

  moveHome() {
    var angleRadians = Math.atan2(this.y - this.start.y, this.x - this.start.x);

    this.x -= Math.cos(angleRadians) * this.moveSpeed;
    this.y -= Math.sin(angleRadians) * this.moveSpeed;

    if (
      MATH_HELPERS.getDistance(this.start.x, this.start.y, this.x, this.y) < 0.5
    ) {
      this.x = this.start.x;
      this.y = this.start.y;
      this.state = STATES.FIND_TARGET;
      return;
    }
  }

  attack() {
    //console.log("ATTACK");
  }

  parseForTransfer() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      type: this.type,
    };
  }
}
