export default class ServerPlayer {
    constructor(id, x,y, type) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.type = type;
        this.target = null;
    }

    handleInput(input) {
        if (input[0]) this.x--;
        if (input[1]) this.x++;
        if (input[2]) this.y++;
        if (input[3]) this.y--;
    }

    parseForTransfer() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            type: this.type
        }
    }

}