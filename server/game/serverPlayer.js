import GAME_UNIT_TYPES from "../../common/gameUnitTypes.js";
import EVENTS_UDP from "../../common/eventsUDP.js";
import GAME_CONSTANS from "../../common/gameConstants.js";
import GameObject, { GO_ANIMATION_STATES } from "../../common/gameObject.js";
import MATH_HELPERS from "../../common/MathHelpers.js";
import damageSystem from "./systems/damage.system.js";
import DB from "../db/dbConnection.js";
import { GAME_UNIT_CATEGORES } from "./factories/gameobject.factory.js";
import { SKILL_ACTIONS } from "./skills/skillActions.js";

export default class ServerPlayer extends GameObject {
  constructor(game, channel, x, y, type) {
    super(channel, x, y, type);
    this.game = game;
    this.channel = channel;
    this.target = null;

    this.stats.moveSpeed = 2;
    this.stats.hp = 20;
    // this.isGhost = false;
    this.currentZone = -1;
    this.grave = null;
    this.usedSkills = [];
  }

  handleInput(input) {
    if (input[0]) this.vel.x--;
    if (input[1]) this.vel.x++;
    if (input[2]) this.vel.y++;
    if (input[3]) this.vel.y--;
  }

  onDeath() {
    this.isGhost = true;
    // this.dead = true;
    console.log("PLAYER IS GHOST");

    let zone = DB.cache.zones_map[this.currentZone];
    console.log(zone);
    // Add grave
    let grave = this.game.objFactory.createObject(
      GAME_UNIT_CATEGORES.STATIC,
      GAME_UNIT_TYPES.GRAVEYARD_GRAVE,
      this.pos.x,
      this.pos.y
    );
    this.game.addGameObject(grave);
    this.grave = grave;

    // Move to zone graveyard
    this.pos = DB.cache.zones_map[this.currentZone].graveyard.copy();
    this.pos.y += 10;
    console.log(this.pos);

    this.channel.emit(EVENTS_UDP.fromServer.playerDied, this.id, {
      reliable: true,
    });

    this.game
      .getPlayersWithinRange(
        this,
        GAME_CONSTANS.PLAYER_INCLUDE_ENEMIES_DISTANCE
      )
      .forEach((p) => {
        p.channel.emit(EVENTS_UDP.fromServer.playerDied, this.id, {
          reliable: true,
        });
      });
  }

  graveRes() {
    this.isGhost = false;
    this.game.removeGameObject(this.grave.id);
    this.grave = null;
    this.stats.hp = this.stats.maxHp / 2;
  }

  setZone(zone) {
    this.currentZone = zone.id;
    this.channel.emit(EVENTS_UDP.fromServer.enteredNewZone, zone, {
      reliable: true,
    });
  }

  useSkill(skill) {
    let usedSkill = this.usedSkills.find((s) => s.id == skill.id);
    if (!usedSkill) {
      console.log(`Use skill ${skill.title}`);
      let use = {
        used: performance.now(),
        id: skill.id,
        cooldown: skill.cooldown,
      };
      this.usedSkills.push(use);

      SKILL_ACTIONS[skill.id](this.game, this);

      setTimeout(
        function () {
          this.usedSkills.splice(this.usedSkills.indexOf(use), 1);
        }.bind(this),
        skill.cooldown
      );
    }
  }

  useSkill_(skill_no) {
    let now = performance.now();
    let diff = now - this.lastAttack;

    if (diff > this.stats.attackSpeed) {
      this.lastAttack = now;
      let enemies = this.game.gameobjects
        .filter((g) => g.type != GAME_UNIT_TYPES.PLAYER)
        .filter(
          (g) =>
            MATH_HELPERS.getDistanceVec2(g.pos, this.pos) <
            this.stats.attackRange
        );
      enemies.forEach((e) => {
        let hit = damageSystem(this, e);
      });

      let withinRange = this.game.getPlayersWithinRange(
        this,
        GAME_CONSTANS.PLAYER_INCLUDE_ENEMIES_DISTANCE
      );
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
