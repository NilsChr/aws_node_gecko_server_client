import { SKILLS } from "../../../common/skills/skills.js";
import gameState from "../../gameState.js";
const root = document.querySelector(":root");

const ACTION_BAR = {
  build: function (actionbar) {
    let ab = document.getElementById("actionbar");
    ab.innerHTML = "";
    for (let i = 0; i < actionbar.length; i++) {
      let btn = document.createElement("div");
      btn.id = "btn" + (i + 1);
      btn.appendChild(document.createElement("div"));
      //if (btn) {
        let skill = SKILLS[actionbar[i]]
        if(skill) {
            let title = document.createElement("label")
            title.innerHTML = skill.title;
            title.classList.add('actionbar-title');
            title.style = "font-size: 12px; font-family: sans-serif;";
            btn.appendChild(title);

            
            let key = document.createElement("label")
            key.classList.add('actionbar-key');
            key.innerHTML = (i+1);
            btn.appendChild(key);
            

        }
        //console.log(SKILLS[actionbar[i]])

      ab.appendChild(btn);
      //}
      //let skill = SKILLS[actionbar[i]]
      //console.log(SKILLS[actionbar[i]])

    }
  },
  triggerCooldown: function (skill) {
    let i =
      gameState.clientPlayerGameObject.actionBar.indexOf(skill.skillId) + 1;
    let cd = skill.cooldown / 1000;
    let cssClass = "cooldown-" + i;

    root.style.setProperty("--cooldown-" + i, cd + "s");
    let el = document.getElementById("btn" + i);
    el.firstChild.classList.add(cssClass);
    setTimeout(function () {
      el.firstChild.classList.remove(cssClass);
    }, skill.cooldown);
  },
};

export default ACTION_BAR;
