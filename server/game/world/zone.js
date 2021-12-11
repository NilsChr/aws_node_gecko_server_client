import HitBox from "../../../common/physics/hitBox.js";
import vec2 from "../../../common/vec2.js";

export class Zone {
  constructor(id, title, color, x, y, w, h, gy_x, gy_y) {
    this.id = id;
    this.title = title;
    this.color = color;
    this.pos = new vec2(x,y);
    this.dim = new vec2(w,h);
    this.hitBox = new HitBox(x,y,w, h);
    this.graveyard = new vec2(x+gy_x, y+gy_y);
  }

  inWorld(player) {
      return this.hitBox.containsPoint(player.pos);
  }
}
