import EVENTS_UDP from "../../../common/eventsUDP.js";
import gameState from "../../gameState.js";

const chatbar = document.getElementById("chatbar-input");

chatbar.addEventListener("focus", onChatBarFocus);
chatbar.addEventListener("blur", onChatBarBlur);
/*
chatbar.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
      /*
    event.preventDefault();
    document.activeElement.blur();
    let msg = chatbar.value;
    chatbar.value = "";
    if(msg == "") return;
    gameState.channel.emit(EVENTS_UDP.fromClient.chatSent, msg, {reliable: true});
     CHAT_BAR_MANAGER.toggle();
  }
});
*/

function onChatBarFocus() {
  gameState.CHATBAR_FOCUSED = true;
}

function onChatBarBlur() {
  gameState.CHATBAR_FOCUSED = false;
}

const CHAT_BAR_MANAGER = {
  lastFocus: -1,
  hasFocus: false,
  toggle() {
    console.log("CHAR BAR toogle");
    if (this.hasFocus) {
      chatbar.blur();
      this.hasFocus = false;
      let msg = chatbar.value;
      chatbar.value = "";
      if (msg == "") return;
      gameState.channel.emit(EVENTS_UDP.fromClient.chatSent, msg, {
        reliable: true,
      });
      return;
    }
    chatbar.focus();
    this.hasFocus = true;
  },
};

console.log("CHATBAR");
export default CHAT_BAR_MANAGER;
