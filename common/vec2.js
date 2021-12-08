export default class vec2 {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    divide(scalar) {
        if(scalar == 0) return;
        this.x /= scalar;
        this.y /= scalar;
    };

    magnitude() {
        return Math.sqrt(this.x* this.x + this.y * this.y);
    }

    normalise() {
       this.divide(this.magnitude());
    }

    copy() {
        return new vec2(this.x, this.y);
    }
}