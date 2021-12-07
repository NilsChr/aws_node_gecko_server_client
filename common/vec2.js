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
}