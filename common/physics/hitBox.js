export default class HitBox {

    constructor(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    containsPoint(v) {
        return v.x >= this.x && v.x <= this.x + this.w &&
               v.y >= this.y && v.y <= this.y + this.h;
    }

}