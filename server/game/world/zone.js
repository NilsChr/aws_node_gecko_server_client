import HitBox from "../../../common/physics/hitBox.js";
import vec2 from "../../../common/vec2.js";

export class Zone {
  constructor(id, title, x, y, w, h) {
    this.id = id;
    this.title = title;
    this.pos = new vec2(x,y);
    this.dim = new vec2(w,h);
    this.hitBox = new HitBox(x,y,w, h);
  }

  inWorld(player) {
      return this.hitBox.containsPoint(player.pos);
  }
}
