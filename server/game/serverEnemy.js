import GAME_UNIT_TYPES from "../../common/gameUnitTypes.js";
import EVENTS_UDP from "../../common/eventsUDP.js";
import GAME_CONSTANS from "../../common/gameConstants.js";
import GameObject from "../../common/gameObject.js";
import MATH_HELPERS from "../../common/MathHelpers.js";
import DAMAGE_SYSTEM from "./systems/damage.system.js";

const STATES = {
  FIND_TARGET: 1,
  MOVE_TOWARDS_TARGET: 2,
  MOVE_HOME: 3,
  ATTACK: 4,
  DEAD: 5,
  DESPAWNED: 6,
};

export default class ServerEnemy extends GameObject {
  constructor(game, id, x, y, type) {
    super(id, x, y, type);
    this.game = game;
    this.state = STATES.FIND_TARGET;
    this.start = this.pos.copy();
    this.target = null;
    this.despawnTimer = 1000;
    this.respawnTimer = 1000;
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
      case STATES.DEAD:
        break;
    }
  }

  respawn() {
    this.stats.reset();
    this.pos = this.start.copy();
    this.state = STATES.FIND_TARGET;
    this.dead = false;
    // console.log("RESPAWN");

    //console.log(this);
  }

  onDeath() {
    //console.log("ON DEATH");
    this.state = STATES.DEAD;
    this.target = null;
    this.dead = true;
    let that = this;
    setTimeout(function () {
      that.state = STATES.DESPAWNED;
      setTimeout(function () {
        that.respawn();
      }, that.respawnTimer);
    }, that.despawnTimer);
  }

  findTarget(gameObjects) {
    this.target = gameObjects.filter(
      (p) =>
        p.type === GAME_UNIT_TYPES.PLAYER &&
        !p.isGhost &&
        MATH_HELPERS.getDistanceVec2(p.pos, this.pos) < this.stats.aggroRange
    )[0];

    if (this.target) {
      this.state = STATES.MOVE_TOWARDS_TARGET;
    }
  }

  moveTowardsTarget() {
    if (this.target.isGhost) {
      this.state = STATES.FIND_TARGET;
      return;
    }

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

    if (
      MATH_HELPERS.getDistanceVec2(this.start, this.pos) <=
      this.stats.moveSpeed * 2
    ) {
      this.pos.x = this.start.x;
      this.pos.y = this.start.y;
      this.state = STATES.FIND_TARGET;
      return;
    }
  }

  attack() {
    if (this.target.dead || this.target.isGhost) {
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
      });
      let withinRange = this.game.getPlayersWithinRange(
        this,
        GAME_CONSTANS.PLAYER_INCLUDE_ENEMIES_DISTANCE
      );
      //console.log('withinRange', withinRange);
      withinRange.forEach((e) => {
        e.channel.emit(
          EVENTS_UDP.fromServer.unitUseSkill,
          { attackerId: this.id, skillId: 0 },
          {
            reliable: true,
          }
        );
      });
    }
  }
}
