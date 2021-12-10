import GAME_UNIT_TYPES from "../../common/gameUnitTypes.js";
import EVENTS_UDP from "../../common/eventsUDP.js";
import GAME_CONSTANS from "../../common/gameConstants.js";
import GameObject, { GO_ANIMATION_STATES } from "../../common/gameObject.js";
import MATH_HELPERS from "../../common/MathHelpers.js";
import damageSystem from "./systems/damage.system.js";
import DB from "../db/dbConnection.js";

export default class ServerPlayer extends GameObject {
  constructor(game, channel, x, y, type) {
    super(channel.id, x, y, type);
    this.game = game;
    this.channel = channel;
    this.target = null;

    this.stats.moveSpeed = 2;
    this.stats.hp = 20;
    this.isGhost = false;
    this.currentZone = -1;
  }

  handleInput(input) {
    if (input[0]) this.vel.x--;
    if (input[1]) this.vel.x++;
    if (input[2]) this.vel.y++;
    if (input[3]) this.vel.y--;
  }

  onDeath() {
    this.isGhost = true;
    console.log("PLAYER IS GHOST");

    let zone = DB.cache.zones_map[this.currentZone];
    console.log(zone);
    // Move to zone graveyard
    this.pos = DB.cache.zones_map[this.currentZone].pos.copy();
    console.log(this.pos);
    this.channel.emit(EVENTS_UDP.fromServer.playerDied, this.id,  { reliable: true });
    
    // Add grave

    // TODO: Change this

  }

  setZone(zone) {
    this.currentZone = zone.id;
    this.channel.emit(EVENTS_UDP.fromServer.enteredNewZone, zone,  { reliable: true });
  }

  useSkill(skill_no) {
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
