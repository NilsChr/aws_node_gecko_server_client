export default class ServerPlayer {
  constructor(id, x, y, type) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.dx = 0;
    this.dy = 0;
    this.type = type;
    this.target = null;
    this.moveSpeed = 1;

    //this.SI = null;
    //this.channel = null;
  }

  update(gameobjects) {
    this.x += this.dx;
    this.y += this.dy;

    this.dx = 0;
    this.dy = 0;
  }

  hasChanged() {
    return this.px != this.x || this.py || this.y;
  }
  
  handleInput(input) {
    if (input[0]) this.dx -= this.moveSpeed;
    if (input[1]) this.dx += this.moveSpeed;
    if (input[2]) this.dy += this.moveSpeed;
    if (input[3]) this.dy -= this.moveSpeed;
    /*
        if (input[0]) this.x--;
        if (input[1]) this.x++;
        if (input[2]) this.y++;
        if (input[3]) this.y--;
        */
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
