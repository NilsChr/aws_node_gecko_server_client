/**
 * Contains the functions to run for each skill used
 */

import EVENTS_UDP from "../../../common/eventsUDP.js";
import GAME_CONSTANS from "../../../common/gameConstants.js";
import GAME_UNIT_TYPES from "../../../common/gameUnitTypes.js";
import MATH_HELPERS from "../../../common/MathHelpers.js";
import { SKILLS, SKILL_IDS } from "../../../common/skills/skills.js";
import DAMAGE_SYSTEM from "../systems/damage.system.js";

export const SKILL_ACTIONS = [];
SKILL_ACTIONS[SKILL_IDS.GRAVE_RES] = function (game, performer) {
    performer.graveRes();
    /*
    let enemies = game.gameobjects
      .filter((g) => g.type != GAME_UNIT_TYPES.PLAYER)
      .filter(
        (g) =>
          MATH_HELPERS.getDistanceVec2(g.pos, performer.pos) <
          performer.stats.attackRange
      );
  
    enemies.forEach((e) => {
      let hit = DAMAGE_SYSTEM(performer, e);
    });
  
    let withinRange = game.getPlayersWithinRange(
      performer,
      GAME_CONSTANS.PLAYER_INCLUDE_ENEMIES_DISTANCE
    );
  
    withinRange.forEach((e) => {
      e.channel.emit(
        EVENTS_UDP.fromServer.unitUseSkill,
        { attackerId: performer.id, skillId: 0 },
        {
          reliable: true,
        }
      );
    });
  
    // TODO: Return attack_speed / weapon speed here
    */
  };
  
SKILL_ACTIONS[SKILL_IDS.ATTACK] = function (game, performer) {
  let enemies = game.gameobjects
    .filter((g) => g.type != GAME_UNIT_TYPES.PLAYER)
    .filter(
      (g) =>
        MATH_HELPERS.getDistanceVec2(g.pos, performer.pos) <
        performer.stats.attackRange
    );

  enemies.forEach((e) => {
    let hit = DAMAGE_SYSTEM(performer, e);
  });

  let withinRange = game.getPlayersWithinRange(
    performer,
    GAME_CONSTANS.PLAYER_INCLUDE_ENEMIES_DISTANCE
  );

  let cooldown = SKILLS[SKILL_IDS.ATTACK].cooldown;

  withinRange.forEach((e) => {
    e.channel.emit(
      EVENTS_UDP.fromServer.unitUseSkill,
      { attackerId: performer.id, skillId: SKILL_IDS.ATTACK, cooldown: cooldown },
      {
        reliable: true,
      }
    );
  });

  // TODO: Return attack_speed / weapon speed here
};
