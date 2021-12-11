import { GO_ANIMATION_STATES } from "../../common/gameObject.js";
import { SKILLS, SKILL_IDS } from "../../common/skills/skills.js";
import GameUnit from "../factories/gameUnit.js";
import gameState from "../gameState.js";
import ACTION_BAR from "../GUI/actionbar/actionbar.js";
import INPUT from "../input.js";

export class ClientPlayer extends GameUnit {
  isGhost = false;
  isGhost_prev = false;
  actionBar = [SKILL_IDS.ATTACK, null, null, null];
  actionBarDead = [SKILL_IDS.GRAVE_RES];

  constructor(id, x, y, type, animationState) {
    super(id, x, y, type, animationState);
    ACTION_BAR.build(this.actionBar);
  }

  triggeredUpdate() {
    if (this.isGhost_prev !== this.isGhost) {
      this.isGhost_prev = this.isGhost;
      console.log("GHOST STATUS CHANGED");

      var can = document.querySelector("#game"); // Using a class instead, see note below.
      can.classList.toggle("isDead");

      if (this.isGhost) {
        ACTION_BAR.build(this.actionBarDead);
      } else ACTION_BAR.build(this.actionBar);
    }
  }

  checkInput() {
    let dx = 0;
    let dy = 0;
    if (INPUT.input.MOVE_LEFT) dx--;
    if (INPUT.input.MOVE_RIGHT) dx++;
    if (INPUT.input.MOVE_DOWN) dy++;
    if (INPUT.input.MOVE_UP) dy--;
    //this.move(dx, dy);
    if (
      INPUT.input.MOVE_LEFT ||
      INPUT.input.MOVE_RIGHT ||
      INPUT.input.MOVE_UP ||
      INPUT.input.MOVE_DOWN
    ) {
      this.sendInput();
    }
  }

  // Moving player on client directly makes input feel instant
  move(x, y) {
    gameState.clientPlayerGameObject.x += x;
    gameState.clientPlayerGameObject.y += y;
  }

  sendInput() {
    const data = [
      INPUT.input.MOVE_LEFT,
      INPUT.input.MOVE_RIGHT,
      INPUT.input.MOVE_DOWN,
      INPUT.input.MOVE_UP,
    ];
    gameState.channel.emit("client:playerInput", data);
  }

  useSkill(skill_slot) {
    let skill_bar = this.isGhost ? this.actionBarDead : this.actionBar;
    let skill = skill_bar[skill_slot - 1];
    if (!skill) {
      console.log("no skill assigned", skill_slot);
      return;
    }
    //console.log("using skill ", SKILLS[skill] );
    gameState.channel.emit("client:useSkill", SKILLS[skill], {
      reliable: true,
    });
  }
}
