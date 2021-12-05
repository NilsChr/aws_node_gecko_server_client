export default class ServerPlayer {
    constructor(id, x,y, type) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.type = type;
        this.target = null;
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