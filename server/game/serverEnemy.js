import GAME_UNIT_TYPES from "../../client/factories/gameUnitTypes.js";
import EVENTS_UDP from "../../common/eventsUDP.js";
import GameObject from "../../common/gameObject.js";
import MATH_HELPERS from "../../common/MathHelpers.js";
import DAMAGE_SYSTEM from "./systems/damage.system.js";

const STATES = {
  FIND_TARGET: 1,
  MOVE_TOWARDS_TARGET: 2,
  MOVE_HOME: 3,
  ATTACK: 4,
};

export default class ServerEnemy extends GameObject {
  constructor(game, id, x, y, type) {
    super(id, x, y, type);
    this.game = game;
    this.state = STATES.FIND_TARGET;
    this.start = this.pos.copy();
    this.target = null;
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
  }

  findTarget(gameObjects) {
    this.target = gameObjects.filter(
      (p) =>
        p.type === GAME_UNIT_TYPES.PLAYER &&
        MATH_HELPERS.getDistanceVec2(p.pos, this.pos) < this.stats.aggroRange
    )[0];

    if (this.target) {
      this.state = STATES.MOVE_TOWARDS_TARGET;
    }
  }

  moveTowardsTarget() {
    // Too far from home
    if (
      MATH_HELPERS.getDistanceVec2(this.start, this.pos) >
      this.stats.aggroRange * 3
    ) {
      this.target = null;
      this.state = STATES.MOVE_HOME;
      return;
    }

    // Too far from player : Player has ran away from enemy
    if (
      MATH_HELPERS.getDistanceVec2(this.target.pos, this.pos) >
      this.stats.aggroRange * 3
    ) {
      this.target = null;
      this.state = STATES.MOVE_HOME;
      return;
    }

    // Move towards player
    var angleRadians = MATH_HELPERS.getAngleRadians(this.pos, this.target.pos);
    this.vel.x -= Math.cos(angleRadians);
    this.vel.y -= Math.sin(angleRadians);

    if (
      MATH_HELPERS.getDistanceVec2(this.target.pos, this.pos) <
      this.stats.attackRange
    ) {
      this.state = STATES.ATTACK;
      return;
    }
  }

  moveHome() {
    var angleRadians = MATH_HELPERS.getAngleRadians(this.pos, this.start);

    this.vel.x -= Math.cos(angleRadians);
    this.vel.y -= Math.sin(angleRadians);

    if (MATH_HELPERS.getDistanceVec2(this.start, this.pos) < 0.5) {
      this.pos.x = this.start.x;
      this.pos.y = this.start.y;
      this.state = STATES.FIND_TARGET;
      return;
    }
  }

  attack() {
    if (this.target.dead) {
      this.state = STATES.MOVE_HOME;
      this.target = null;
      return;
    }
    if (
      MATH_HELPERS.getDistanceVec2(this.target.pos, this.pos) >
      this.stats.attackRange
    ) {
      this.state = STATES.MOVE_TOWARDS_TARGET;
      return;
    }

    this.useSkill();
  }

  useSkill(skill_no) {
    let now = performance.now();
    let diff = now - this.lastAttack;

    if (diff > this.stats.attackSpeed) {
      //console.log("ATTACK", this.stats.attackSpeed);
      this.lastAttack = now;
      let enemies = this.game.gameobjects
        .filter((g) => g.type == GAME_UNIT_TYPES.PLAYER)
        .filter(
          (g) =>
            MATH_HELPERS.getDistanceVec2(g.pos, this.pos) <
            this.stats.attackRange
        );
      // console.log("HIT ", enemies);
      enemies.forEach((e) => {
        let hit = DAMAGE_SYSTEM(this, e);
        e.channel.emit(
          EVENTS_UDP.fromServer.unitUseSkill,
          { attackerId: this.id, skillId: 0 },
          {
            reliable: true,
          }
        );
      });

      /*
      this.channel.emit(EVENTS_UDP.fromServer.playerUseSkill, skill_no, {
        reliable: true,
      });
      */
      //this.animationState = GO_ANIMATION_STATES.ATTACK_NORMAL;
    }
  }
}
