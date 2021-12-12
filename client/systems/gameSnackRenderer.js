import gameState from "../gameState.js";

/**
 * Game Snack is a short lived object, like a chat message. Dmg number etc
 */
const GAME_SNACK_RENDERER = {
  id: 1,
  chats: [],
  combatText: [],
  /**
   *
   * @param {*} obj the game which the chat should hover over
   * @param {*} msg the chat message
   */
  createChat(obj) {
    let gameobject = gameState.gameobjects.filter(
      (g) => g.id == obj.senderId
    )[0];
    if (!gameobject) return;

    let existingchats = this.chats.filter((c) => c.target.id == gameobject.id);
    existingchats.forEach((c) => {
      c.offset_y += 7;
    });
    let newChat = {
      id: this.id++,
      target: gameobject,
      message: obj.msg,
      offset_y: 0,
    };
    this.chats.push(newChat);

    console.log(this.chats);
    setTimeout(
      function () {
        this.chats.splice(this.chats.indexOf(newChat), 1);
      }.bind(this),
      3000
    );
  },
  renderChats: function (p) {
    p.textAlign(p.CENTER);
    p.textSize(7);
    let charSize = 5;
    for (let i = this.chats.length - 1; i >= 0; i--) {
      let chat = this.chats[i];
      let halfMessage = chat.message.length / 2;
      if(halfMessage < 2.5) halfMessage = 2.5;
      p.push();

      p.translate(chat.target.x + 5, chat.target.y - chat.offset_y);
      p.scale(0.5, 0.5);
      p.fill(255);
      p.noStroke();
      if(chat.offset_y == 0)
        p.triangle(-5, -30, -5, -20, 5, -30);

      p.rect(-halfMessage * charSize, -43, halfMessage * charSize * 2, 16, 4);
      p.fill(0);

      p.text(chat.message, 0, -32);
      p.pop();
    }
  },
  
};
export default GAME_SNACK_RENDERER;
